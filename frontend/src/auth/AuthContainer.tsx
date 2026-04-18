import { Outlet } from 'react-router-dom'
import { Box, Paper } from '@mui/material'

export default function AuthContainer() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 6,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4.5 },
          width: '100%',
          maxWidth: 420,
          textAlign: 'center',
          borderRadius: 6,
          border: '1px solid rgba(255,255,255,0.65)',
          backgroundColor: 'rgba(255,255,255,0.78)',
          backdropFilter: 'blur(18px)',
          boxShadow: '0 22px 80px rgba(15, 23, 42, 0.12)',
        }}
      >
        <Outlet />
      </Paper>
    </Box>
  )
}
