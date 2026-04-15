import { useContext } from "react";
import { AuthContext } from "../../auth/AuthContext.tsx";
import { Button } from "@mui/material";

export default function Dashboard() {
  const { setToken } = useContext(AuthContext);

  return (
    <>
      <Button color="inherit" onClick={(): void => setToken(null)}>
        Logout
      </Button>
    </>
  );
}
