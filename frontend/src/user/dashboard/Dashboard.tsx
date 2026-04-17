import { useContext } from "react";
import { AuthContext } from "../../auth/AuthContext.tsx";
import { Box, Button } from "@mui/material";
import Header from "./Header.tsx";  

export default function Dashboard() {
  const { setToken } = useContext(AuthContext);

  return (
    < Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
      <Button color="inherit" onClick={(): void => setToken(null)}>
        Logout
      </Button>
    </Box>
  );
}
