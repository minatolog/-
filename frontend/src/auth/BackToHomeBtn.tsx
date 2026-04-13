import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function BackToHomeBtn() {
  const navigate = useNavigate();

  return (
    <Button
      type="button"
      variant="text"
      onClick={() => navigate('/auth')}
    >
      Back to Home
    </Button>
  );
}