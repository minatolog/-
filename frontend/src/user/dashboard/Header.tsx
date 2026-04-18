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
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(14px)',
      }}
    >
      <Toolbar sx={{ minHeight: 76 }}>
        <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 800, color: '#0f172a', letterSpacing: -0.5 }}>
          Presto
        </Typography>

        <IconButton
          sx={{ color: '#0f172a', bgcolor: 'rgba(15, 23, 42, 0.06)', mr: 1 }}
          onClick={onAddClick}
          aria-label="New presentation"
        >
          <AddIcon />
        </IconButton>

        <Button
          variant="outlined"
          sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700, color: '#0f172a', borderColor: 'rgba(15, 23, 42, 0.15)' }}
          onClick={() => setToken(null)}
        >
          logout
        </Button>
      </Toolbar>
    </AppBar>
  )
}
