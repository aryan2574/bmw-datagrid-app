import React from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Chip,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Upload as UploadIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { SearchAndFilterControlsProps } from "../../models/model";
import { useVehicleData } from "../../hooks/useVehicleData";

const SearchAndFilterControls: React.FC<SearchAndFilterControlsProps> = ({
  searchTerm,
  setSearchTerm,
  filters,
  onAddFilter,
  onRemoveFilter,
  onRefresh,
  loading = false,
}) => {
  const { uploadCSV } = useVehicleData();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadCSV(file);
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <Paper sx={{ p: { xs: 1, sm: 2 }, mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          gap: { xs: 1, sm: 2 },
          alignItems: "center",
          mb: 2,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <TextField
          label="Search electric vehicles"
          placeholder="Search electric vehicles"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
            ),
          }}
          sx={{
            minWidth: { xs: "100%", sm: 300 },
            maxWidth: { xs: "100%", sm: 500 },
            mb: { xs: 1, sm: 0 },
          }}
          size={isMobile ? "small" : "medium"}
        />

        <Box
          sx={{
            display: "flex",
            gap: { xs: 1, sm: 2 },
            flexDirection: { xs: "row", sm: "row" },
            width: { xs: "100%", sm: "auto" },
            justifyContent: { xs: "space-between", sm: "flex-start" },
          }}
        >
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={onAddFilter}
            size={isMobile ? "small" : "medium"}
            sx={{
              minWidth: { xs: "auto", sm: "auto" },
              px: { xs: 1, sm: 2 },
            }}
          >
            {isMobile ? "Filter" : "Add Filter"}
          </Button>

          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadIcon />}
            size={isMobile ? "small" : "medium"}
            sx={{
              minWidth: { xs: "auto", sm: 150 },
              maxWidth: { xs: "auto", sm: 200 },
              px: { xs: 1, sm: 2 },
            }}
          >
            {isMobile ? "CSV" : "Upload CSV"}
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={handleFileUpload}
            />
          </Button>

          <Button
            variant="outlined"
            startIcon={
              loading ? <CircularProgress size={16} /> : <RefreshIcon />
            }
            onClick={handleRefresh}
            disabled={loading}
            size={isMobile ? "small" : "medium"}
            sx={{
              minWidth: { xs: "auto", sm: "auto" },
              px: { xs: 1, sm: 2 },
            }}
          >
            {"Refresh"}
          </Button>
        </Box>
      </Box>

      {Object.keys(filters).length > 0 && (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {Object.entries(filters).map(([field, filter]) => (
            <Chip
              key={field}
              label={`${field}: ${filter.operator} "${filter.value}"`}
              onDelete={() => onRemoveFilter(field)}
              color="primary"
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                maxWidth: { xs: "100%", sm: "auto" },
              }}
            />
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default SearchAndFilterControls;
