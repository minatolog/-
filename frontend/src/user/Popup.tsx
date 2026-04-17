import {Alert, Snackbar} from "@mui/material";

type PoppupProps = {
  message: string;
  onClose: () => void;
};
export default function Popup({message, onClose}: PoppupProps) {
  return (
    <Snackbar open
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={4000}
      onClose={onClose}
      sx={{ mt: 8 }}
    >
      <Alert severity="error" onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
}