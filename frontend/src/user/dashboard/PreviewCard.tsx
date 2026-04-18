import type {PresentationType} from "../PresentaionType.ts";
import {Card, CardActionArea, CardContent, CardMedia, Typography} from "@mui/material";
import {Link} from "react-router-dom";

type Props = {
  presentation: PresentationType;
};

export default function PreviewCard({ presentation }: Props) {

  const mediaProps = presentation.thumbnail ?
    {
      component: "img",
      image: presentation.thumbnail,
      alt: presentation.title,
    } : {
      component: "div",
    };

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 5,
        border: '1px solid rgba(15, 23, 42, 0.08)',
        backgroundColor: 'rgba(255,255,255,0.86)',
        boxShadow: '0 20px 44px rgba(15, 23, 42, 0.08)',
        transition: 'transform 160ms ease, box-shadow 160ms ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 26px 52px rgba(15, 23, 42, 0.14)',
        },
      }}
    >
      <CardActionArea
        component={Link} to={`../presentation/${presentation.id}/1`}
        sx={{height: "100%",}}
      >
        <CardMedia
          {...mediaProps}
          sx={{
            aspectRatio: '2 / 1',
            background: presentation.thumbnail
              ? undefined
              : 'linear-gradient(135deg, #f8d9a0 0%, #f2efe8 48%, #c5e2ff 100%)',
          }}
        />

        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 800, color: '#0f172a' }}>
            {presentation.title.trim() || 'Untitled presentation'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>
            {presentation.description.trim() || 'No description yet.'}
          </Typography>
          <Typography variant="caption" sx={{ color: '#475569', fontWeight: 700, letterSpacing: 0.3 }}>
            {presentation.slides.length} slides
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
