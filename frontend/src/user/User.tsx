import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { Button } from '@mui/material';
import { AuthContext } from '../auth/AuthContext';

export default function User() {
  const { setToken } = useContext(AuthContext);

  return (
    <>

      <Button onClick={() => setToken(null)}>
        Logout
      </Button>

      <Outlet />
    </>
  );
}