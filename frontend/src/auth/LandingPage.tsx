import { Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <Typography
        variant="overline"
        sx={{ letterSpacing: 3, color: '#b45309', fontWeight: 700 }}
      >
        PRESTO
      </Typography>

      <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, lineHeight: 1.1 }}>
        Welcome to Presto
      </Typography>

      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Build sharp, lightweight slides with a cleaner workflow and a calmer editing space.
      </Typography>

      <Stack spacing={2}>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('login')}
          sx={{ py: 1.2, borderRadius: 999, textTransform: 'none', fontWeight: 700 }}
        >
          Login
        </Button>

        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('register')}
          sx={{ py: 1.2, borderRadius: 999, textTransform: 'none', fontWeight: 700 }}
        >
          Register
        </Button>
      </Stack>
    </>
  );
}
