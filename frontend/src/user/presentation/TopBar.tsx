import {AppBar, IconButton, Stack, Toolbar, Typography} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';

type PresentationTopBarProps = {
  title: string;
  saveStatusText: string;
  isBusy: boolean;
  onBack: () => void;
  onDeletePresentation: () => void;
};

export default function TopBar({
  title,
  saveStatusText,
  isBusy,
  onBack,
  onDeletePresentation,
}: PresentationTopBarProps) {

  const styles = {
    savingStatus: {
      opacity: 0.9 // 不透明度 0.9
    },

    toolBar: {
      gap: 1,
      justifyContent: "space-between", // 将 left right 元素摆到两旁
    },
  };

  const backBtn = (
    <IconButton color="inherit" edge="start" onClick={onBack} disabled={isBusy}>
      <ArrowBackIcon />
    </IconButton>
  );

  const titleBox = (
    <Typography variant="h6">
      {title.trim() || 'Untitled'}
    </Typography>
  );

  const left = (
    <Stack direction="row" spacing={1} alignItems="center">
      {backBtn}
      {titleBox}
    </Stack>
  );

  const savingStatus = (
    <Typography variant="body2" sx={styles.savingStatus}>
      {saveStatusText}
    </Typography>
  );

  const deleteBtn = (
    <IconButton
      color="inherit"
      onClick={onDeletePresentation}
      disabled={isBusy}
      aria-label="Delete presentation"
    >
      <DeleteIcon />
    </IconButton>
  );

  const right = (
    <Stack direction="row" spacing={1} alignItems="center">
      {savingStatus}
      {deleteBtn}
    </Stack>
  );

  return (
    <AppBar position="static">
      <Toolbar sx={styles.toolBar}>
        {left}
        {right}
      </Toolbar>
    </AppBar>
  );
}
