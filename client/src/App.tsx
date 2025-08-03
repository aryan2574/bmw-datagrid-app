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
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
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
            <DirectionsCarIcon sx={{ mr: 2, fontSize: { xs: 32, sm: 40 } }} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                fontSize: { xs: "1rem", sm: "1.25rem" },
                display: { xs: "none", sm: "block" },
              }}
            >
              Electric Vehicle DataGrid Application
            </Typography>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                fontSize: "1rem",
                display: { xs: "block", sm: "none" },
              }}
            >
              EV DataGrid
            </Typography>
          </Toolbar>
        </AppBar>

        <Container
          maxWidth="xl"
          sx={{
            mt: { xs: 1, sm: 3 },
            px: { xs: 1, sm: 2, md: 3 },
          }}
        >
          <DataGrid />
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
