import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography} from "@mui/material";
import type {UserOutletContext} from "../User.tsx";
import {useEffect, useRef, useState, type ChangeEvent} from "react";
import type {CodeElement, ImageElement, PresentationType, SlideBackground, TextElement, VideoElement} from "../PresentaionType.ts";
import {createEmptySlide, createId, getSaveStatusText} from "./helpers.ts";
import TopBar from "./TopBar.tsx";
import SlideRail from "./SlideRail.tsx";
import TitleBox from "./TitleBox.tsx";
import SlideCanvas from "./SlideCanvas.tsx";
import InspectorPanel from "./InspectorPanel.tsx";
import ConfirmDeleteSlideDialog from "./dialogs/ConfirmDeleteSlideDialog.tsx";
import {fileToDataUrl} from "../../utils.ts";

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
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [textDraft, setTextDraft] = useState('');
  const [fontSizeDraft, setFontSizeDraft] = useState('1');
  const [colorDraft, setColorDraft] = useState('#222222');
  const [xDraft, setXDraft] = useState('0');
  const [yDraft, setYDraft] = useState('0');
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageSrcDraft, setImageSrcDraft] = useState('');
  const [imageAltDraft, setImageAltDraft] = useState('');
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [videoSrcDraft, setVideoSrcDraft] = useState('');
  const [videoAutoplayDraft, setVideoAutoplayDraft] = useState('false');
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [codeDraft, setCodeDraft] = useState('');
  const [codeFontSizeDraft, setCodeFontSizeDraft] = useState('1');
  const [editingCodeId, setEditingCodeId] = useState<string | null>(null);
  const [slidePanelOpen, setSlidePanelOpen] = useState(false);
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const [currentBackgroundModeDraft, setCurrentBackgroundModeDraft] = useState('solid');
  const [currentBackgroundDraft, setCurrentBackgroundDraft] = useState('#ffffff');
  const [currentBackgroundSecondaryDraft, setCurrentBackgroundSecondaryDraft] = useState('#dbeafe');
  const [currentBackgroundImageDraft, setCurrentBackgroundImageDraft] = useState('');
  const [defaultBackgroundModeDraft, setDefaultBackgroundModeDraft] = useState('solid');
  const [defaultBackgroundDraft, setDefaultBackgroundDraft] = useState('#ffffff');
  const [defaultBackgroundSecondaryDraft, setDefaultBackgroundSecondaryDraft] = useState('#dbeafe');
  const [defaultBackgroundImageDraft, setDefaultBackgroundImageDraft] = useState('');

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

  function onAddText() {
    updatePresentation(prev => {
      const currentIndex = getCurrentSlideIndex();
      const slides = [...prev.slides];
      const currentSlide = structuredClone(slides[currentIndex]);

      const nextLayer = currentSlide.elements.length === 0
        ? 1
        : Math.max(...currentSlide.elements.map((element) => element.layer)) + 1;

      currentSlide.elements.push({
        id: createId(),
        type: 'text',
        text: 'New text',
        fontSize: 1,
        color: '#222222',
        width: 30,
        height: 20,
        x: 0,
        y: 0,
        layer: nextLayer,
      });

      slides[currentIndex] = currentSlide;
      return { ...prev, slides };
    });
  }

  function onDeleteElement(elementId: string) {
    updatePresentation(prev => {
      const currentIndex = getCurrentSlideIndex();
      const slides = [...prev.slides];
      const currentSlide = structuredClone(slides[currentIndex]);

      currentSlide.elements = currentSlide.elements.filter((element) => element.id !== elementId);
      slides[currentIndex] = currentSlide;

      return { ...prev, slides };
    });
  }

  function onEditText(elementId: string) {
    const currentSlide = presentationRef.current?.slides[getCurrentSlideIndex()];
    const element = currentSlide?.elements.find((item) => item.id === elementId && item.type === 'text');
    if (!element || element.type !== 'text') return;

    setEditingTextId(element.id);
    setTextDraft(element.text);
    setFontSizeDraft(String(element.fontSize));
    setColorDraft(element.color);
    setXDraft(String(element.x));
    setYDraft(String(element.y));
  }

  function onSaveTextEdit() {
    if (!editingTextId) return;
    const parsedFontSize = Number(fontSizeDraft);
    const parsedX = Number(xDraft);
    const parsedY = Number(yDraft);
    if (!Number.isFinite(parsedFontSize) || parsedFontSize <= 0) {
      setErrorMessage('Font size must be a positive number.');
      return;
    }
    if (!Number.isFinite(parsedX) || parsedX < 0 || parsedX > 100) {
      setErrorMessage('X position must be between 0 and 100.');
      return;
    }
    if (!Number.isFinite(parsedY) || parsedY < 0 || parsedY > 100) {
      setErrorMessage('Y position must be between 0 and 100.');
      return;
    }

    updatePresentation(prev => {
      const currentIndex = getCurrentSlideIndex();
      const slides = [...prev.slides];
      const currentSlide = structuredClone(slides[currentIndex]);

      currentSlide.elements = currentSlide.elements.map((element) => {
        if (element.id !== editingTextId || element.type !== 'text') {
          return element;
        }

        const nextElement: TextElement = {
          ...element,
          text: textDraft,
          fontSize: parsedFontSize,
          color: colorDraft,
          x: parsedX,
          y: parsedY,
        };
        return nextElement;
      });

      slides[currentIndex] = currentSlide;
      return { ...prev, slides };
    });

    setEditingTextId(null);
  }

  async function handleImageFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload an image file.');
      event.target.value = '';
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setImageSrcDraft(dataUrl);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to read image file.');
    }
  }

  function onAddImage() {
    setEditingImageId(null);
    setImageSrcDraft('');
    setImageAltDraft('');
    setImageDialogOpen(true);
  }

  function onEditImage(elementId: string) {
    const currentSlide = presentationRef.current?.slides[getCurrentSlideIndex()];
    const element = currentSlide?.elements.find((item) => item.id === elementId && item.type === 'image');
    if (!element || element.type !== 'image') return;

    setEditingImageId(element.id);
    setImageSrcDraft(element.src);
    setImageAltDraft(element.alt);
    setImageDialogOpen(true);
  }

  function onSaveImage() {
    if (imageSrcDraft.trim() === '') {
      setErrorMessage('Please provide an image URL or upload an image.');
      return;
    }

    updatePresentation(prev => {
      const currentIndex = getCurrentSlideIndex();
      const slides = [...prev.slides];
      const currentSlide = structuredClone(slides[currentIndex]);

      if (editingImageId) {
        currentSlide.elements = currentSlide.elements.map((element) => {
          if (element.id !== editingImageId || element.type !== 'image') {
            return element;
          }

          const nextElement: ImageElement = {
            ...element,
            src: imageSrcDraft.trim(),
            alt: imageAltDraft.trim(),
          };
          return nextElement;
        });
      } else {
        const nextLayer = currentSlide.elements.length === 0
          ? 1
          : Math.max(...currentSlide.elements.map((element) => element.layer)) + 1;

        currentSlide.elements.push({
          id: createId(),
          type: 'image',
          src: imageSrcDraft.trim(),
          alt: imageAltDraft.trim(),
          width: 40,
          height: 30,
          x: 0,
          y: 0,
          layer: nextLayer,
        });
      }

      slides[currentIndex] = currentSlide;
      return { ...prev, slides };
    });

    setImageDialogOpen(false);
    setEditingImageId(null);
  }

  function onAddVideo() {
    setEditingVideoId(null);
    setVideoSrcDraft('');
    setVideoAutoplayDraft('false');
    setVideoDialogOpen(true);
  }

  function onEditVideo(elementId: string) {
    const currentSlide = presentationRef.current?.slides[getCurrentSlideIndex()];
    const element = currentSlide?.elements.find((item) => item.id === elementId && item.type === 'video');
    if (!element || element.type !== 'video') return;

    setEditingVideoId(element.id);
    setVideoSrcDraft(element.src);
    setVideoAutoplayDraft(String(element.autoplay));
    setVideoDialogOpen(true);
  }

  function onSaveVideo() {
    if (videoSrcDraft.trim() === '') {
      setErrorMessage('Please provide a YouTube embed URL.');
      return;
    }

    updatePresentation(prev => {
      const currentIndex = getCurrentSlideIndex();
      const slides = [...prev.slides];
      const currentSlide = structuredClone(slides[currentIndex]);

      if (editingVideoId) {
        currentSlide.elements = currentSlide.elements.map((element) => {
          if (element.id !== editingVideoId || element.type !== 'video') {
            return element;
          }

          const nextElement: VideoElement = {
            ...element,
            src: videoSrcDraft.trim(),
            autoplay: videoAutoplayDraft === 'true',
          };
          return nextElement;
        });
      } else {
        const nextLayer = currentSlide.elements.length === 0
          ? 1
          : Math.max(...currentSlide.elements.map((element) => element.layer)) + 1;

        currentSlide.elements.push({
          id: createId(),
          type: 'video',
          src: videoSrcDraft.trim(),
          autoplay: videoAutoplayDraft === 'true',
          width: 45,
          height: 30,
          x: 0,
          y: 0,
          layer: nextLayer,
        });
      }

      slides[currentIndex] = currentSlide;
      return { ...prev, slides };
    });

    setVideoDialogOpen(false);
    setEditingVideoId(null);
  }

  function onAddCode() {
    setEditingCodeId(null);
    setCodeDraft('');
    setCodeFontSizeDraft('1');
    setCodeDialogOpen(true);
  }

  function onEditCode(elementId: string) {
    const currentSlide = presentationRef.current?.slides[getCurrentSlideIndex()];
    const element = currentSlide?.elements.find((item) => item.id === elementId && item.type === 'code');
    if (!element || element.type !== 'code') return;

    setEditingCodeId(element.id);
    setCodeDraft(element.code);
    setCodeFontSizeDraft(String(element.fontSize));
    setCodeDialogOpen(true);
  }

  function onSaveCode() {
    const parsedFontSize = Number(codeFontSizeDraft);
    if (!Number.isFinite(parsedFontSize) || parsedFontSize <= 0) {
      setErrorMessage('Font size must be a positive number.');
      return;
    }

    updatePresentation(prev => {
      const currentIndex = getCurrentSlideIndex();
      const slides = [...prev.slides];
      const currentSlide = structuredClone(slides[currentIndex]);

      if (editingCodeId) {
        currentSlide.elements = currentSlide.elements.map((element) => {
          if (element.id !== editingCodeId || element.type !== 'code') {
            return element;
          }

          const nextElement: CodeElement = {
            ...element,
            code: codeDraft,
            fontSize: parsedFontSize,
          };
          return nextElement;
        });
      } else {
        const nextLayer = currentSlide.elements.length === 0
          ? 1
          : Math.max(...currentSlide.elements.map((element) => element.layer)) + 1;

        currentSlide.elements.push({
          id: createId(),
          type: 'code',
          code: codeDraft,
          fontSize: parsedFontSize,
          width: 45,
          height: 30,
          x: 0,
          y: 0,
          layer: nextLayer,
        });
      }

      slides[currentIndex] = currentSlide;
      return { ...prev, slides };
    });

    setCodeDialogOpen(false);
    setEditingCodeId(null);
  }

  function openThemeDialog() {
    const currentSlide = presentationRef.current?.slides[getCurrentSlideIndex()];
    const currentBackground = currentSlide?.background?.kind === 'solid'
      ? currentSlide.background.color
      : '#ffffff';
    const defaultBackground = presentationRef.current?.theme?.defaultBackground?.kind === 'solid'
      ? presentationRef.current.theme.defaultBackground.color
      : '#ffffff';

    setCurrentBackgroundDraft(currentBackground);
    setDefaultBackgroundDraft(defaultBackground);
    setThemeDialogOpen(true);
  }

  function saveThemeSettings() {
    const currentBackground: SlideBackground = currentBackgroundModeDraft === 'gradient'
      ? { kind: 'gradient', from: currentBackgroundDraft, to: currentBackgroundSecondaryDraft, direction: '135deg' }
      : currentBackgroundModeDraft === 'image'
        ? { kind: 'image', src: currentBackgroundImageDraft.trim() }
        : { kind: 'solid', color: currentBackgroundDraft };

    const defaultBackground: SlideBackground = defaultBackgroundModeDraft === 'gradient'
      ? { kind: 'gradient', from: defaultBackgroundDraft, to: defaultBackgroundSecondaryDraft, direction: '135deg' }
      : defaultBackgroundModeDraft === 'image'
        ? { kind: 'image', src: defaultBackgroundImageDraft.trim() }
        : { kind: 'solid', color: defaultBackgroundDraft };

    updatePresentation(prev => {
      const currentIndex = getCurrentSlideIndex();
      const slides = [...prev.slides];
      const currentSlide = structuredClone(slides[currentIndex]);

      currentSlide.background = currentBackground;
      slides[currentIndex] = currentSlide;

      return {
        ...prev,
        slides,
        theme: {
          ...prev.theme,
          defaultBackground,
        },
      };
    });

    setThemeDialogOpen(false);
  }

  async function handleBackgroundImageChange(event: ChangeEvent<HTMLInputElement>, target: 'current' | 'default') {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload an image file.');
      event.target.value = '';
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      if (target === 'current') {
        setCurrentBackgroundModeDraft('image');
        setCurrentBackgroundImageDraft(dataUrl);
      } else {
        setDefaultBackgroundModeDraft('image');
        setDefaultBackgroundImageDraft(dataUrl);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to read image file.');
    }
  }

  function getBackgroundSx(background?: SlideBackground) {
    if (!background) return { bgcolor: '#ffffff' };
    if (background.kind === 'solid') return { bgcolor: background.color };
    if (background.kind === 'gradient') {
      return { background: `linear-gradient(${background.direction || '135deg'}, ${background.from}, ${background.to})` };
    }
    return {
      backgroundImage: `url(${background.src})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };
  }

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

  function onPreview() {
    navigate(`/user/presentation/${id}/${getCurrentSlideIndex() + 1}/preview`);
  }

  async function autoSave() {
    if (!presentationRef.current || isBusyRef.current || !hasUnsavedChanges()) {
      return;
    }

    isBusyRef.current = true;
    setIsBusy(true);
    try {
      await performPush();
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : "auto save failed");
    } finally {
      isBusyRef.current = false;
      setIsBusy(false);
    }
  }

  useEffect(() => {
    presentationRef.current = presentation;
  }, [presentation]);

  useEffect(() => {
    if (!presentation) return;
    const pageNum = Number(page);
    const slidesCount = presentation.slides.length;
    if (!Number.isInteger(pageNum) || pageNum < 1) {
      navigate(`/user/presentation/${id}/1`);
    } else if (pageNum > slidesCount) {
      navigate(`/user/presentation/${id}/${slidesCount}`);
    }
  }, []);

  // 注册定时器(auto save)
  // 每隔 3 秒
  // 自动上传当前 presentation 到 User
  // User 发送 PUT 请求更新 store(presentation list)
  useEffect(() => {
    const interval = setInterval(() => {
      void autoSave();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!presentation) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Presentation not found.</Typography>
      </Box>
    );
  }

  const currentSlideIndex = getCurrentSlideIndex();
  const currentSlide = presentation.slides[currentSlideIndex];
  const saveStatusText = getSaveStatusText(isBusy, hasUnsavedChanges());
  const appliedBackground = currentSlide.background || presentation.theme?.defaultBackground;

  const styles = {
    mainPage: {
      p: 2,
      display: 'grid',
      // 在小屏幕下，这个 grid 只有 1 列。
      // 在 md 及以上屏幕时，变成 3 列布局：220px | 自适应 | 240px
      gridTemplateColumns: { xs: '1fr', md: '220px minmax(0, 1fr) 240px' },
      gap: 2,
      alignItems: 'start',
    },

    slideRail: {
      minWidth: 0,
      // 在小屏幕下，SlideRail 排在第 2 行。
      // 在中屏幕下, 排在第一排
      order: { xs: 2, md: 1 },
    },

    middleArea: {
      minWidth: 0,
      order: { xs: 1, md: 2 },
    },

    inspectorPanle: {
      minWidth: 0,
      order: { xs: 3, md: 3 },
    },
  };

  return (
    <>
      <TopBar
        title={presentation.title}
        saveStatusText={saveStatusText}
        onBack={onBack}
        onDeletePresentation={onDeletePresentation}
        isBusy={isBusy}
      />

      <Box sx={{ px: 2, pt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={openThemeDialog}>
            Theme
          </Button>
          <Button variant="outlined" onClick={() => setSlidePanelOpen(true)}>
            Slides
          </Button>
          <Button variant="outlined" onClick={onPreview}>
          Preview
          </Button>
        </Stack>
      </Box>

      <Box sx={styles.mainPage}>
        <Box sx={styles.slideRail}>
          <SlideRail
            slides={presentation.slides}
            currentSlideIndex={currentSlideIndex}
            goToSlide={goToSlide}
            onAddSlide={addSlide}
          />
        </Box>

        <Stack spacing={2} sx={styles.middleArea}>
          <TitleBox
            presentation={presentation}
            updateTitle={updateTitle}
            updateDescription={updateDescription}
          />
          <SlideCanvas
            currentSlide={currentSlide}
            currentSlideIndex={currentSlideIndex}
            slideCount={presentation.slides.length}
            goToSlide={goToSlide}
            onDeleteElement={onDeleteElement}
            onEditText={onEditText}
            onEditImage={onEditImage}
            onEditVideo={onEditVideo}
            onEditCode={onEditCode}
            backgroundSx={getBackgroundSx(appliedBackground)}
          />
        </Stack>
        <Box sx={styles.inspectorPanle}>
          <InspectorPanel
            onAddSlide={addSlide}
            onRequestDeleteSlide={requestDeleteCurrentSlide}
            onAddText={onAddText}
            onAddImage={onAddImage}
            onAddVideo={onAddVideo}
            onAddCode={onAddCode}
          />
        </Box>
      </Box>

      <ConfirmDeleteSlideDialog
        open={deleteSlideDialogOpen}
        slideNumber={currentSlideIndex + 1}
        onCancel={() => setDeleteSlideDialogOpen(false)}
        onConfirm={confirmDeleteCurrentSlide}
      />

      <Dialog open={editingTextId !== null} onClose={() => setEditingTextId(null)} fullWidth maxWidth="sm">
        <DialogTitle>Edit text</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Text"
              value={textDraft}
              onChange={(event) => setTextDraft(event.target.value)}
              multiline
              minRows={3}
              fullWidth
            />
            <TextField
              label="Font size (em)"
              value={fontSizeDraft}
              onChange={(event) => setFontSizeDraft(event.target.value)}
              fullWidth
            />
            <TextField
              label="Color"
              value={colorDraft}
              onChange={(event) => setColorDraft(event.target.value)}
              fullWidth
            />
            <TextField
              label="X position (0-100)"
              value={xDraft}
              onChange={(event) => setXDraft(event.target.value)}
              fullWidth
            />
            <TextField
              label="Y position (0-100)"
              value={yDraft}
              onChange={(event) => setYDraft(event.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingTextId(null)}>Cancel</Button>
          <Button onClick={onSaveTextEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={imageDialogOpen}
        onClose={() => {
          setImageDialogOpen(false);
          setEditingImageId(null);
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editingImageId ? 'Edit image' : 'Add image'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Image URL"
              value={imageSrcDraft}
              onChange={(event) => setImageSrcDraft(event.target.value)}
              fullWidth
            />
            <Button variant="outlined" component="label">
              Upload image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageFileChange}
              />
            </Button>
            <TextField
              label="Alt text"
              value={imageAltDraft}
              onChange={(event) => setImageAltDraft(event.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setImageDialogOpen(false);
            setEditingImageId(null);
          }}
          >
            Cancel
          </Button>
          <Button onClick={onSaveImage} variant="contained">
            {editingImageId ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={videoDialogOpen}
        onClose={() => {
          setVideoDialogOpen(false);
          setEditingVideoId(null);
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editingVideoId ? 'Edit video' : 'Add video'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="YouTube embed URL"
              value={videoSrcDraft}
              onChange={(event) => setVideoSrcDraft(event.target.value)}
              fullWidth
            />
            <TextField
              label="Autoplay"
              value={videoAutoplayDraft}
              onChange={(event) => setVideoAutoplayDraft(event.target.value)}
              helperText="Use true or false"
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setVideoDialogOpen(false);
            setEditingVideoId(null);
          }}
          >
            Cancel
          </Button>
          <Button onClick={onSaveVideo} variant="contained">
            {editingVideoId ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={codeDialogOpen}
        onClose={() => {
          setCodeDialogOpen(false);
          setEditingCodeId(null);
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editingCodeId ? 'Edit code' : 'Add code'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Code"
              value={codeDraft}
              onChange={(event) => setCodeDraft(event.target.value)}
              multiline
              minRows={5}
              fullWidth
            />
            <TextField
              label="Font size (em)"
              value={codeFontSizeDraft}
              onChange={(event) => setCodeFontSizeDraft(event.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setCodeDialogOpen(false);
            setEditingCodeId(null);
          }}
          >
            Cancel
          </Button>
          <Button onClick={onSaveCode} variant="contained">
            {editingCodeId ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={slidePanelOpen}
        onClose={() => setSlidePanelOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Slide Control Panel</DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{ mt: 1, maxHeight: 420, overflowY: 'auto' }}>
            {presentation.slides.map((slide, index) => (
              <Button
                key={slide.id}
                variant={index === currentSlideIndex ? 'contained' : 'outlined'}
                onClick={() => {
                  goToSlide(index);
                  setSlidePanelOpen(false);
                }}
                sx={{ justifyContent: 'flex-start', minHeight: 56 }}
              >
                Slide {index + 1}
              </Button>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSlidePanelOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={themeDialogOpen}
        onClose={() => setThemeDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Theme and Background</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Current slide background mode" value={currentBackgroundModeDraft} onChange={(event) => setCurrentBackgroundModeDraft(event.target.value)} fullWidth />
            <TextField
              label="Current slide background color"
              value={currentBackgroundDraft}
              onChange={(event) => setCurrentBackgroundDraft(event.target.value)}
              fullWidth
            />
            <TextField label="Current gradient secondary color" value={currentBackgroundSecondaryDraft} onChange={(event) => setCurrentBackgroundSecondaryDraft(event.target.value)} fullWidth />
            <TextField label="Current background image URL" value={currentBackgroundImageDraft} onChange={(event) => setCurrentBackgroundImageDraft(event.target.value)} fullWidth />
            <Button variant="outlined" component="label">
              Upload current background image
              <input type="file" accept="image/*" hidden onChange={(event) => void handleBackgroundImageChange(event, 'current')} />
            </Button>
            <TextField label="Default background mode" value={defaultBackgroundModeDraft} onChange={(event) => setDefaultBackgroundModeDraft(event.target.value)} fullWidth />
            <TextField
              label="Default background color"
              value={defaultBackgroundDraft}
              onChange={(event) => setDefaultBackgroundDraft(event.target.value)}
              fullWidth
            />
            <TextField label="Default gradient secondary color" value={defaultBackgroundSecondaryDraft} onChange={(event) => setDefaultBackgroundSecondaryDraft(event.target.value)} fullWidth />
            <TextField label="Default background image URL" value={defaultBackgroundImageDraft} onChange={(event) => setDefaultBackgroundImageDraft(event.target.value)} fullWidth />
            <Button variant="outlined" component="label">
              Upload default background image
              <input type="file" accept="image/*" hidden onChange={(event) => void handleBackgroundImageChange(event, 'default')} />
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setThemeDialogOpen(false)}>Cancel</Button>
          <Button onClick={saveThemeSettings} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
