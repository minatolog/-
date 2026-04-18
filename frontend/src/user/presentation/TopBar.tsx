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
      opacity: 0.9,
      color: '#475569',
      fontWeight: 700,
    },

    toolBar: {
      gap: 1,
      justifyContent: "space-between",
      minHeight: 76,
    },
  };

  const backBtn = (
    <IconButton
      edge="start"
      onClick={onBack}
      disabled={isBusy}
      sx={{ color: '#0f172a', bgcolor: 'rgba(15, 23, 42, 0.06)' }}
    >
      <ArrowBackIcon />
    </IconButton>
  );

  const titleBox = (
    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
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
      onClick={onDeletePresentation}
      disabled={isBusy}
      aria-label="Delete presentation"
      sx={{ color: '#0f172a', bgcolor: 'rgba(239, 68, 68, 0.1)' }}
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
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
        backgroundColor: 'rgba(255, 255, 255, 0.74)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <Toolbar sx={styles.toolBar}>
        {left}
        {right}
      </Toolbar>
    </AppBar>
  );
}
