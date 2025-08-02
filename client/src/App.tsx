import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppBar, Toolbar, Typography, Container } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

import DataGrid from "./components/DataGrid/DataGrid";

const theme = createTheme({
  palette: {
    primary: {
      main: "#16588E",
    },
    secondary: {
      main: "#E7222E",
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <DirectionsCarIcon sx={{ mr: 2, fontSize: 40 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Electric Vehicle DataGrid Application
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 3 }}>
          <DataGrid />
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
