import { Box, Stack, Typography, TextField,Button,Alert } from '@mui/material';
import { useContext, useState, type SubmitEvent } from 'react';
import BackToHomeBtn from './BackToHomeBtn.tsx';
import { login } from '../api.ts';
import { AuthContext } from './AuthContext.tsx';

export default function LoginPage() {
  const { setToken } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errormeaage,setErrorMessage]=useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent): Promise<void> {
  event.preventDefault();

  if (isSubmitting) {
    return;
  }

  setErrorMessage('');
  setIsSubmitting(true);

  try {
    const data = await login(email, password);
    setToken(data.token);
  } catch (error) {
    setErrorMessage((error as Error).message);
  } finally {
    setIsSubmitting(false);
  }
}

  const hasEmptyField = email.trim() === '' || password.trim() === '';
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Sign in to your Presto account
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
      {errormeaage && <Alert severity="error">{errormeaage}</Alert>}
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            fullWidth
            autoComplete="email"
          />

          <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          fullWidth
          autoComplete="current-password"
          />

          <Button
            variant="contained"
            type="submit"
            fullWidth
            disabled={hasEmptyField || isSubmitting}
          >
            Login
          </Button>

        <BackToHomeBtn />

        </Stack>
      </Box>
    </>
  )
}
