import { Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Welcome to Presto
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        A lightweight presentation app
      </Typography>

      <Stack spacing={2}>
        <Button
          variant="contained"
          onClick={() => navigate('login')}
        >
          Login
        </Button>

        <Button
          variant="outlined"
          onClick={() => navigate('register')}
        >
          Register
        </Button>
      </Stack>
    </>
  );
}