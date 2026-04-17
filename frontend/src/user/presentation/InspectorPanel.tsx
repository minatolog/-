import {Button, Paper, Stack, Typography} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import CodeIcon from '@mui/icons-material/Code';

type InspectorPanelProps = {
  onAddSlide: () => void;

  // 请求删除当前 slide：
  // 这里故意不用 onDeleteSlide 这个名字，
  // 因为这一步并不一定立刻删除，
  // 父组件可能先弹确认框，再决定是否真的执行删除。
  onRequestDeleteSlide: () => void;

  onAddText: () => void;
  onAddImage: () => void;
  onAddVideo: () => void;
  onAddCode: () => void;
};

export default function InspectorPanel({
  onAddSlide,
  onRequestDeleteSlide,
  onAddText,
  onAddImage,
  onAddVideo,
  onAddCode,
}: InspectorPanelProps) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5 }}>
      <Stack spacing={1.5}>
        <Typography variant="subtitle1">Inspector</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={onAddSlide}>
          Add slide
        </Button>

        <Button variant="outlined" color="error" onClick={onRequestDeleteSlide}>
          Delete slide
        </Button>

        <Button variant="outlined" startIcon={<TextFieldsIcon />} onClick={onAddText}>
          Add text
        </Button>

        <Button variant="outlined" startIcon={<ImageIcon />} onClick={onAddImage}>
          Add image
        </Button>

        <Button variant="outlined" startIcon={<SmartDisplayIcon />} onClick={onAddVideo}>
          Add video
        </Button>

        <Button variant="outlined" startIcon={<CodeIcon />} onClick={onAddCode}>
          Add code
        </Button>
      </Stack>
    </Paper>
  )
}
