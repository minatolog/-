import { Box, Stack, Typography, TextField,Button } from '@mui/material';
import { useState } from 'react';
export default function LoginPage() {
import BackToHomeBtn from './BackToHomeBtn';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
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
            disabled={hasEmptyField}
          >
            Login
          </Button>

        <BackToHomeBtn />

        </Stack>
      </Box>
    </>
  )
}