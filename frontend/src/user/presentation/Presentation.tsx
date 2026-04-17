import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import {Box, Stack, Typography} from "@mui/material";
import type {UserOutletContext} from "../User.tsx";
import {useEffect, useRef, useState} from "react";
import type {PresentationType, SlideType} from "../PresentaionType.ts";
import {createEmptySlide, getSaveStatusText} from "./helpers.ts";
import TopBar from "./TopBar.tsx";
import SlideRail from "./SlideRail.tsx";
import TitleBox from "./TitleBox.tsx";
import SlideCanvas from "./SlideCanvas.tsx";
import InspectorPanel from "./InspectorPanel.tsx";
import ConfirmDeleteSlideDialog from "./dialogs/ConfirmDeleteSlideDialog.tsx";

export default function Presentation() {

  const navigate = useNavigate();

  const { id, page, } = useParams<{ id: string, page: string }>();

  const {
    getPresentation,
    pushPresentation,
    deletePresentation,
    setErrorMessage,
  } = useOutletContext<UserOutletContext>();

  const initialPresentation = getPresentation(id);
  const [presentation, setPresentationState] = useState(initialPresentation);
  const presentationRef = useRef(initialPresentation);

  // 页面级 busy：
  // 用于表示当前 presentation 页面正在执行较重的异步动作，
  // 例如 autoSave、返回前保存、删除 presentation 等。
  const [isBusy, setIsBusy] = useState(false);
  const isBusyRef = useRef(false);
  // 是否打开“删除当前 slide”的确认框。
  // 这是本次新增的页面级状态。
  const [deleteSlideDialogOpen, setDeleteSlideDialogOpen] = useState(false);

  const localVersionRef = useRef(0);  // 本地版本号
  const remoteVersionRef = useRef(0); // 远程版本号

  function hasUnsavedChanges() {
    return remoteVersionRef.current < localVersionRef.current;
  }

  function markChange() {
    localVersionRef.current++;
  }

  // 根据路由参数 page 计算当前 slide 的下标。
  // page 是给用户看的 1-based 页码；
  // index 是数组内部使用的 0-based 下标。
  function getCurrentSlideIndex(): number {
    const slideCount = presentationRef.current?.slides.length ?? 0;
    const pageNum = Number(page);
    if (!Number.isInteger(pageNum) || pageNum < 1) return 0;
    if (pageNum > slideCount) return slideCount - 1;
    return pageNum - 1;
  }

  // 同时更新 ref 与 state。
  // 这样后续同步逻辑和渲染逻辑看到的是同一份 presentation。
  function setPresentation(p: PresentationType | null) {
    presentationRef.current = p;
    setPresentationState(p);
  }

  // 通用的 presentation 更新入口。
  // recipe 接收旧 presentation，返回新 presentation。
  // 这里会：
  // 1. 复制旧对象
  // 2. 调用 recipe 生成新对象
  // 3. 更新 ref 与 state
  // 4. 标记本地版本发生变化
  function updatePresentation(recipe: (_prev: PresentationType) => PresentationType) {
    if (!presentationRef.current) return;
    const next = recipe(structuredClone(presentationRef.current));
    setPresentation(next);
    markChange();
  }

  // 针对“当前正在浏览的 slide”的局部更新工具。
  function updateCurrentSlide(recipe: (_slide: SlideType) => SlideType) {
    updatePresentation(prev => {
      const index = getCurrentSlideIndex();
      const slides = [...prev.slides];
      slides[index] = recipe(structuredClone(slides[index]));
      return { ...prev, slides };
    });
  }

  // 跳转到指定下标的 slide。
  // 对外暴露的是数组下标；对路由写入的是 page = index + 1。
  function goToSlide(index: number) {
    if (!presentationRef.current) return;
    if (!Number.isInteger(index) || index < 0) {
      index = 0;
    } else if (index >= presentationRef.current.slides.length) {
      index = presentationRef.current.slides.length - 1;
    }
    navigate(`/user/presentation/${id}/${index + 1}`);
  }

  // 在当前浏览的 slide 后面插入一张空白 slide，
  // 然后跳转到新插入的那一张。
  function addSlide() {
    const currentIndex = getCurrentSlideIndex();
    const insertIndex = currentIndex + 1;
    updatePresentation(prev => {
      const nextSlides = [...prev.slides];
      // splice 的语义：
      // 从 insertIndex 位置开始，
      // 删除 0 个元素，
      // 并在这里插入一个新的空 slide。
      nextSlides.splice(insertIndex, 0, createEmptySlide());
      return { ...prev, slides: nextSlides };
    });
    goToSlide(insertIndex);
  }

  // 用户点击 InspectorPanel 中的 Delete slide 后，先走这里。
  //
  // 这里不直接删除，先做业务判断：
  // - 如果只剩一张 slide，不允许删除，弹错误信息
  // - 如果可以删，则打开确认对话框
  function requestDeleteCurrentSlide() {
    if (!presentationRef.current) return;
    if (presentationRef.current.slides.length <= 1) {
      setErrorMessage('Cannot delete the only slide. Delete the presentation instead.');
      return;
    }
    setDeleteSlideDialogOpen(true);
  }

  // 用户在确认框中点击 Confirm 后，真正执行删除逻辑。
  //
  // 删除后需要把对话框关闭，并跳转到一个合法的 slide：
  // - 如果删除的是第 n 张 slide，删除后显示最新的同样是第 n 张 slide (原第 n+1 张)
  // - 因为会调用 updatePresentation -> 调用 setPresentationState -> 触发重新渲染组件 -> currentSlide 重新计算
  // - 所以无需显式调用 navigate 也能获取到最新的 currentSlide -> 从而能够正确渲染 slide
  function confirmDeleteCurrentSlide() {
    const currentIndex = getCurrentSlideIndex();
    setDeleteSlideDialogOpen(false);
    updatePresentation(prev => {
      const nextSlides = prev.slides.filter((_, index) => index !== currentIndex);
      return { ...prev, slides: nextSlides };
    });
  }

  // 更新标题。
  //
  // 这是本次为 TitleBox 新增的提交入口。
  // TitleBox 不直接操作 presentation；
  // 它只在用户编辑完成后，把 nextTitle 交给这里。
  function updateTitle(nextTitle: string) {
    updatePresentation(prev => {
      return {
        ...prev,
        title: nextTitle,
      };
    });
  }

  // 更新描述。
  // 语义同 updateTitle，只是目标字段不同。
  function updateDescription(nextDescription: string) {
    updatePresentation(prev => {
      return {
        ...prev,
        description: nextDescription,
      };
    });
  }

  function onAddText() {}
  function onAddImage() {}
  function onAddVideo() {}
  function onAddCode() {}

  /////////////////////////////////

  async function onDeletePresentation() {
    if (isBusyRef.current) return;
    isBusyRef.current = true;
    setIsBusy(true);
    try {
      if (presentationRef.current) {
        await deletePresentation(id as string);
      }
      navigate("/");
    } catch (e) {
      isBusyRef.current = false;
      setIsBusy(false);
      setErrorMessage(e instanceof Error ? e.message : "Failed to delete presentation.");
    }
  }

  async function performPush() {
    const versionSnapshot = localVersionRef.current;
    await pushPresentation(presentationRef.current as PresentationType);
    remoteVersionRef.current = Math.max(versionSnapshot, remoteVersionRef.current);
  }

  async function onBack() {
    if (isBusyRef.current) return;
    isBusyRef.current = true;
    setIsBusy(true);
    try {
      if (presentationRef.current && hasUnsavedChanges()) {
        await performPush();
      }
      navigate("/");
    } catch (e) {
      isBusyRef.current = false;
      setIsBusy(false);
      setErrorMessage(e instanceof Error ? e.message : "Save failed.");
    }
  }