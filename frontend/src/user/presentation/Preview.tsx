import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import {Box, Button, Stack, Typography} from "@mui/material";
import type {UserOutletContext} from "../User.tsx";
import SlideCanvas from "./SlideCanvas.tsx";

export default function Preview() {
  const navigate = useNavigate();
  const { id, page } = useParams<{ id: string, page: string }>();
  const { getPresentation } = useOutletContext<UserOutletContext>();

  const presentation = getPresentation(id);

  function getCurrentSlideIndex(): number {
    const slideCount = presentation?.slides.length ?? 0;
    const pageNum = Number(page);
    if (!Number.isInteger(pageNum) || pageNum < 1) return 0;
    if (pageNum > slideCount) return slideCount - 1;
    return pageNum - 1;
  }

  function goToSlide(index: number) {
    if (!presentation) return;
    if (!Number.isInteger(index) || index < 0) {
      index = 0;
    } else if (index >= presentation.slides.length) {
      index = presentation.slides.length - 1;
    }
    navigate(`/user/presentation/${id}/${index + 1}/preview`);
  }

  if (!presentation) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Presentation not found.</Typography>
      </Box>
    );
  }

  const currentSlideIndex = getCurrentSlideIndex();
  const currentSlide = presentation.slides[currentSlideIndex];

  return (
    <Stack spacing={2} sx={{ minHeight: '100vh', p: 2, bgcolor: '#eef2f6' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">{presentation.title.trim() || 'Untitled'}</Typography>
        <Button variant="outlined" onClick={() => navigate(`/user/presentation/${id}/${currentSlideIndex + 1}`)}>
          Back to editor
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <SlideCanvas
          currentSlide={currentSlide}
          currentSlideIndex={currentSlideIndex}
          slideCount={presentation.slides.length}
          goToSlide={goToSlide}
          onDeleteElement={() => {}}
          onEditText={() => {}}
          onEditImage={() => {}}
          onEditVideo={() => {}}
          onEditCode={() => {}}
          readOnly
        />
      </Box>
    </Stack>
  );
}
