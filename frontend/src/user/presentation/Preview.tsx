import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import {Box, Button, Stack, Typography} from "@mui/material";
import type {UserOutletContext} from "../User.tsx";
import SlideCanvas from "./SlideCanvas.tsx";
import type {SlideBackground} from "../PresentaionType.ts";

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
  const appliedBackground = currentSlide.background || presentation.theme?.defaultBackground;
  const backToEditorPath = `/user/presentation/${id}/${currentSlideIndex + 1}`;

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

  return (
    <Stack
      spacing={3}
      sx={{
        minHeight: '100vh',
        p: { xs: 2, md: 3 },
        background:
          'radial-gradient(circle at top left, rgba(255, 236, 205, 0.9), transparent 24%), radial-gradient(circle at top right, rgba(198, 228, 255, 0.85), transparent 24%), linear-gradient(180deg, #f7fafc 0%, #eaf0f6 100%)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          px: 2.5,
          py: 1.5,
          borderRadius: 4,
          border: '1px solid rgba(15, 23, 42, 0.08)',
          backgroundColor: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
        }}
      >
        <Box>
          <Typography variant="overline" sx={{ letterSpacing: 2, color: '#b45309', fontWeight: 700 }}>
            Preview Mode
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
            {presentation.title.trim() || 'Untitled'}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={() => navigate(backToEditorPath)}
          sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700 }}
        >
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
          backgroundSx={getBackgroundSx(appliedBackground)}
        />
      </Box>
    </Stack>
  );
}
