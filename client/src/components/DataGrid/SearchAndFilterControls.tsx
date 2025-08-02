import React from "react";
import { Box, TextField, Button, Paper, Chip } from "@mui/material";
import {
  Upload as UploadIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { FilterState } from "../../models/model";
import { useVehicleData } from "../../hooks/useVehicleData";

interface SearchAndFilterControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: FilterState;
  setFilters: (
    filters: FilterState | ((prev: FilterState) => FilterState)
  ) => void;
  onAddFilter: () => void;
  onRemoveFilter: (field: string) => void;
}

const SearchAndFilterControls: React.FC<SearchAndFilterControlsProps> = ({
  searchTerm,
  setSearchTerm,
  filters,
  onAddFilter,
  onRemoveFilter,
}) => {
  const { uploadCSV } = useVehicleData();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadCSV(file);
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
        <TextField
          label="Search electric vehicles"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
            ),
          }}
          sx={{ minWidth: 300 }}
        />

        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={onAddFilter}
        >
          Add Filter
        </Button>

        <Button variant="outlined" component="label" startIcon={<UploadIcon />}>
          Upload CSV
          <input type="file" accept=".csv" hidden onChange={handleFileUpload} />
        </Button>
      </Box>

      {/* Active Filters */}
      {Object.keys(filters).length > 0 && (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {Object.entries(filters).map(([field, filter]) => (
            <Chip
              key={field}
              label={`${field}: ${filter.operator} "${filter.value}"`}
              onDelete={() => onRemoveFilter(field)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default SearchAndFilterControls;
