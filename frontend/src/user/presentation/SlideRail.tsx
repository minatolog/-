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
      p: 1.5,
    },

    slideButton: {
      textTransform: 'none', // 小写文字
      minHeight: 72,
    },
  }

  const addSlideBtn = (
    <Button
      variant="contained"
      startIcon={<AddIcon />} // 放在按钮左侧的 icon 图标
      onClick={onAddSlide}
      fullWidth
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