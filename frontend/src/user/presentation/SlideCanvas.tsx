import type {SlideType} from "../PresentaionType.ts";
import {useEffect, useMemo} from "react";
import {Box, IconButton, Paper, Typography} from "@mui/material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ElementRenderer from "./ElementRenderer.tsx";

type SlideCanvasProps = {
  currentSlide: SlideType;
  currentSlideIndex: number;
  slideCount: number;
  goToSlide: (_index: number) => void;
  onDeleteElement: (_elementId: string) => void;
  onEditText: (_elementId: string) => void;
};

export default function SlideCanvas({
  currentSlide,
  currentSlideIndex,
  slideCount,
  goToSlide,
  onDeleteElement,
  onEditText,
}: SlideCanvasProps) {
  const sortedElements = useMemo(() => {
    return currentSlide.elements.slice().sort((a, b) => a.layer - b.layer);
  }, [currentSlide]);

  function goToPreviousSlide() {
    goToSlide(currentSlideIndex - 1);
  }

  function goToNextSlide() {
    goToSlide(currentSlideIndex + 1);
  }

  const canGoPrev = currentSlideIndex > 0;
  const canGoNext = currentSlideIndex < slideCount - 1;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' && canGoPrev) {
        goToPreviousSlide();
      }
      if (e.key === 'ArrowRight' && canGoNext) {
        goToNextSlide();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex]);

  const styles = {
    container: {
      position: 'relative',
      width: '100%',
      aspectRatio: '16 / 9',
      overflow: 'hidden',
    },

    arrow: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
    },

    leftArrow: {
      left: 8,
    },

    rightArrow: {
      right: 8,
    },

    pageNumber: {
      position: 'absolute',
      right: 8,
      bottom: 8,
      p: 1,
      bgcolor: 'rgba(255,255,255,0.5)',
      borderRadius: 999,
      zIndex: 2,
    },

    canvas : {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
    },
  }

  const leftArrow = (
    <IconButton
      onClick={goToPreviousSlide}
      disabled={!canGoPrev}
      sx={{ ...styles.arrow, ...styles.leftArrow }}
    >
      <ChevronLeftIcon />
    </IconButton>
  );

  const rightArrow = (
    <IconButton
      onClick={goToNextSlide}
      disabled={!canGoNext}
      sx={{ ...styles.arrow, ...styles.rightArrow }}
    >
      <ChevronRightIcon />
    </IconButton>
  );

  const canvas = (
    <Box sx={styles.canvas}>
      {sortedElements.map((element) =>
        <ElementRenderer
          key={element.id}
          element={element}
          onDelete={() => onDeleteElement(element.id)}
          onEditText={() => onEditText(element.id)}
        />
      )}
    </Box>
  );

  const pageNum = (
    <Typography
      variant="caption" // 默认辅助信息样式
      sx={styles.pageNumber}
    >
      {currentSlideIndex + 1}
    </Typography>
  );

  return (
    <Paper variant="outlined" sx={styles.container}>
      {leftArrow}
      {canvas}
      {rightArrow}
      {pageNum}
    </Paper>
  );
}
