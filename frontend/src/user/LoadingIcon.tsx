import {Box, CircularProgress} from "@mui/material";

export default function LoadingIcon() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <CircularProgress />
    </Box>
  )
}