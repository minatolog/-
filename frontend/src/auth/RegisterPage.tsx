import { useState,type SubmitEvent } from 'react';
import { Box, Stack, Typography, TextField, Button } from '@mui/material';
export default function RegisterPage() {

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPswd, setConfirmPswd] = useState('');

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
  }

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

        </Stack>
      </Box>
    </>
  )
}