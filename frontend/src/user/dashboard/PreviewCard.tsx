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
    <Card sx={{ height: "100%" }}>
      <CardActionArea
        component={Link} to={`../presentation/${presentation.id}/1`}
        sx={{height: "100%",}}
      >
        <CardMedia
          {...mediaProps}
          sx={{
            height: 140,
            backgroundColor: "#e0e0e0",
          }}
        />

        <CardContent>
          <Typography variant="h6" gutterBottom>
            {presentation.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {presentation.description}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {presentation.slides.length} slides
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}