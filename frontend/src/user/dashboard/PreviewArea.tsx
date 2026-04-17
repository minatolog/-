import type {PresentationType} from "../PresentaionType.ts";
import {Grid} from "@mui/material";
import PreviewCard from "./PreviewCard.tsx";

type Prop = {
  presentationList: PresentationType[]
}

export default function PreviewArea({ presentationList }: Prop) {
  return (
    <Grid container spacing={2}>
      {presentationList.map((presentation) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={presentation.id}>
          <PreviewCard presentation={presentation} />
        </Grid>
      ))}
    </Grid>
  )
}