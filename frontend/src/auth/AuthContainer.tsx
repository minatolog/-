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
        bgcolor: '#fbfbfb',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: 350,
          textAlign: 'center',
        }}
      >
        <Outlet />
      </Paper>
    </Box>
  )
}