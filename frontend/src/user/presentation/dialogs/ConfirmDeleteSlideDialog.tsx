import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

type ConfirmDeleteSlideDialogProps = {
  // 控制对话框是否打开。
  // 这个状态由父组件 Presentation 持有，因为“删不删 slide”属于页面级业务状态。
  open: boolean;

  // 当前要删除的是第几张 slide（从 1 开始显示给用户）。
  // 这里只用于文案展示，不参与删除逻辑计算。
  slideNumber: number;

  // 用户点击“返回 / 取消”时调用。
  onCancel: () => void;

  // 用户点击“确认删除”时调用。
  // 真正的删除逻辑仍由父组件负责。
  onConfirm: () => void;
};

export default function ConfirmDeleteSlideDialog({
  open,
  slideNumber,
  onCancel,
  onConfirm,
}: ConfirmDeleteSlideDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Delete slide</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete slide {slideNumber}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Back</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}