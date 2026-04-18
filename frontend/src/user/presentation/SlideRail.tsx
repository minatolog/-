import type {SlideType} from "../PresentaionType.ts";
import AddIcon from "@mui/icons-material/Add";
import {Button, Divider, Paper, Stack, Typography} from "@mui/material";

type SlideRailProps = {
  slides: SlideType[];
  currentSlideIndex: number;
  goToSlide: (_index: number) => void;
  onAddSlide: () => void;
};

export default function SlideRail({
  slides, // 当前 presentation 的 slides 列表
  currentSlideIndex, // 当前页面选中的 slides 列表的下标
  goToSlide, // 当用户点击某个 slide 按钮时要触发的行为
  onAddSlide, // 当用户点击 + 按钮时要触发的行为
}: SlideRailProps) {

  const styles = {
    slideRail: {
      p: 1.75,
      borderRadius: 4,
      backgroundColor: 'rgba(255,255,255,0.72)',
      backdropFilter: 'blur(14px)',
      borderColor: 'rgba(15, 23, 42, 0.08)',
    },

    slideButton: {
      textTransform: 'none',
      minHeight: 72,
      justifyContent: 'flex-start',
      borderRadius: 3,
      fontWeight: 700,
    },
  }

  const addSlideBtn = (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={onAddSlide}
      fullWidth
      sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700 }}
    >
      Add slide
    </Button>
  );

  const rail = slides.map((slide, i) => {
    return (
      <Button
        key={slide.id}
        variant={i === currentSlideIndex ? 'contained' : 'outlined'}
        onClick={() => goToSlide(i)}
        sx={styles.slideButton}
      >
        <Typography variant="body2">Slide {i + 1}</Typography>
      </Button>
    );
  });

  return (
    <Paper variant="outlined" sx={styles.slideRail}>
      <Stack spacing={1.5}>
        {addSlideBtn}
        {/*分割线*/}
        <Divider />
        {rail}
      </Stack>
    </Paper>
  );

}
