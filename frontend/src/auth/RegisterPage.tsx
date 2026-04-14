import { useContext, useState, type SubmitEvent } from 'react';
import { Box, Stack, Typography, TextField, Button, Alert } from '@mui/material';
import BackToHomeBtn from './BackToHomeBtn';
import { register } from '../api.ts';
import { AuthContext } from './AuthContext.tsx';

export default function RegisterPage() {
  const { setToken } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPswd, setConfirmPswd] = useState('');
  const [errormeaage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }
    if (password !== confirmPswd) {
      setErrorMessage('Passwords do not match!');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const data = await register(email, password, name);
      setToken(data.token);
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const hasEmptyField = [email, name, password, confirmPswd].some((field) => field.trim() === '');

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Create your Presto account
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {errormeaage && <Alert severity="error">{errormeaage}</Alert>}
          <TextField
            label="Name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            fullWidth
            autoComplete="name"
          />

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
            autoComplete="new-password"
          />

          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPswd}
            onChange={(event) => setConfirmPswd(event.target.value)}
            required
            fullWidth
            autoComplete="new-password"
          />

          <Button
            variant="contained"
            type="submit"
            fullWidth
            disabled={hasEmptyField || isSubmitting}
          >
            Register
          </Button>

          <BackToHomeBtn />
        </Stack>
      </Box>
    </>
  );
}
