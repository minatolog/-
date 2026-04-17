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
