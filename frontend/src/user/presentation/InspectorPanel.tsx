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
  const buttonSx = {
    justifyContent: 'flex-start',
    borderRadius: 3,
    textTransform: 'none',
    fontWeight: 700,
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.75,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(14px)',
        borderColor: 'rgba(15, 23, 42, 0.08)',
      }}
    >
      <Stack spacing={1.5}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
          Inspector
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={onAddSlide} sx={buttonSx}>
          Add slide
        </Button>

        <Button variant="outlined" color="error" onClick={onRequestDeleteSlide} sx={buttonSx}>
          Delete slide
        </Button>

        <Button variant="outlined" startIcon={<TextFieldsIcon />} onClick={onAddText} sx={buttonSx}>
          Add text
        </Button>

        <Button variant="outlined" startIcon={<ImageIcon />} onClick={onAddImage} sx={buttonSx}>
          Add image
        </Button>

        <Button variant="outlined" startIcon={<SmartDisplayIcon />} onClick={onAddVideo} sx={buttonSx}>
          Add video
        </Button>

        <Button variant="outlined" startIcon={<CodeIcon />} onClick={onAddCode} sx={buttonSx}>
          Add code
        </Button>
      </Stack>
    </Paper>
  )
}
