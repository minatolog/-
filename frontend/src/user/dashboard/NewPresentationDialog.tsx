import type {PresentationType} from "../PresentaionType.ts";
import {useState} from "react";
import {type ChangeEvent} from "react"
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material";
import {fileToDataUrl} from "../../utils";
import {createEmptySlide, createId} from "../presentation/helpers.ts";

type CreatePresentationDialogProps = {
  onClose: () => void;
  onCreated: (_newPresentation: PresentationType) => Promise<void>;
  onError: (_message: string) => void;
};

export default function NewPresentationDialog({
  onClose,
  onCreated,
  onError,
}: CreatePresentationDialogProps) {
  const [title, setTitle] = useState("Untitled");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 处理点击 Upload Thumbnail 按钮事件:
  // 当用户选择图片后, 开始尝试转换图片为 Data URL
  // 成功 -> 渲染图片
  // 失败 -> 渲染错误弹窗
  async function handleThumbnailChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      onError("Please upload an image file.");
      e.target.value = "";
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setThumbnail(dataUrl);
    } catch (error) {
      if (error instanceof Error) {
        onError(error.message);
      } else {
        onError("Failed to convert image.");
      }
    }
  }

  // 根据表单信息构造一个只有一张幻灯片的空 Presentation 对象
  function createNewPresentation() {
    const newPresentation: PresentationType = {
      id: createId(),
      title: title.trim() === "" ? "Untitled" : title.trim(),
      description: description.trim(),
      thumbnail: thumbnail,
      slides: [createEmptySlide()],
    };
    return newPresentation;
  }

  // 处理点击 Create 按钮事件:
  // 处理过程中渲染 submitting 样式
  // 提交新建的 Presentation
  // 结束提交后关闭 submitting 样式(无论提交成功与否)
  async function handleCreate() {
    setSubmitting(true);
    try {
      const newPresentation = createNewPresentation();
      await onCreated(newPresentation);
    } finally {
      setSubmitting(false);
    }
  }

  const titleField = (
    <TextField
      label="Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      fullWidth
    />
  );

  const uploadThumbnailBtn = (
    <Button variant="outlined" component="label">
      Upload Thumbnail
      <input
        type="file"
        accept="image/*"
        hidden
        onChange={handleThumbnailChange}
      />
    </Button>
  );

  const thumbnailPreview = (
    <img
      src={thumbnail}
      alt="Thumbnail preview"
      style={{
        width: "100%",
        maxHeight: 200,
        objectFit: "contain",
        border: "1px solid #ccc",
        borderRadius: 4,
      }}
    />
  );

  const descriptionField = (
    <TextField
      label="Description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      fullWidth
      multiline
      minRows={3}
    />
  );

  const cancelBtn = (
    <Button onClick={onClose} disabled={submitting}>
      Cancel
    </Button>
  );

  const submitBtn = (
    <Button
      onClick={handleCreate}
      variant="contained"
      disabled={submitting}
    >
      Create
    </Button>
  );

  return (
    <Dialog
      open={true}
      onClose={submitting ? undefined : onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>New Presentation</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{mt: 1}}>
          {titleField}
          {descriptionField}
          {uploadThumbnailBtn}
          {thumbnail && thumbnailPreview}
        </Stack>
      </DialogContent>

      <DialogActions>
        {cancelBtn}
        {submitBtn}
      </DialogActions>

    </Dialog>
  )
}
