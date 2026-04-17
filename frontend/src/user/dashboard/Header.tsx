import {useContext} from "react";
import {AuthContext} from "../../auth/AuthContext.tsx";
import {AppBar, Button, IconButton, Toolbar, Typography} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

type HeaderProps = {
  onAddClick: () => void;
};

export default function Header({onAddClick}: HeaderProps) {
  const {setToken} = useContext(AuthContext);
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Presto
        </Typography>

        <IconButton color="inherit" onClick={onAddClick}>
          <AddIcon />
        </IconButton>

        <Button color="inherit" onClick={() => setToken(null)}>
          logout
        </Button>
      </Toolbar>
    </AppBar>
  )
}