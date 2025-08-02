import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { FilterDialogProps } from "../../models/model";

const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onClose,
  onAddFilter,
}) => {
  const [currentFilter, setCurrentFilter] = useState({
    field: "",
    operator: "contains",
    value: "",
  });

  const filterOperators = [
    { value: "contains", label: "Contains" },
    { value: "equals", label: "Equals" },
    { value: "startsWith", label: "Starts with" },
    { value: "endsWith", label: "Ends with" },
    { value: "isEmpty", label: "Is empty" },
    { value: "greaterThan", label: "Greater than" },
    { value: "lessThan", label: "Less than" },
  ];

  const filterFields = [
    { value: "brand", label: "Brand" },
    { value: "model", label: "Model" },
    { value: "bodyStyle", label: "Body Style" },
    { value: "segment", label: "Segment" },
    { value: "powerTrain", label: "Power Train" },
    { value: "plugType", label: "Plug Type" },
    { value: "rapidChar", label: "Rapid Charge" },
    { value: "accelSec", label: "Acceleration" },
    { value: "topSpeedKm", label: "Top Speed" },
    { value: "rangeKm", label: "Range" },
    { value: "efficiencyKwh100km", label: "Efficiency" },
    { value: "fastChargKmh", label: "Fast Charge" },
    { value: "seats", label: "Seats" },
    { value: "priceEuro", label: "Price" },
  ];

  const handleAddFilter = () => {
    if (currentFilter.field && currentFilter.value) {
      onAddFilter(currentFilter);
      setCurrentFilter({ field: "", operator: "contains", value: "" });
    }
  };

  const handleClose = () => {
    setCurrentFilter({ field: "", operator: "contains", value: "" });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Filter</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: 300,
            pt: 1,
          }}
        >
          <FormControl fullWidth>
            <InputLabel>Field</InputLabel>
            <Select
              value={currentFilter.field}
              onChange={(e) =>
                setCurrentFilter((prev) => ({
                  ...prev,
                  field: e.target.value,
                }))
              }
              label="Field"
            >
              {filterFields.map((field) => (
                <MenuItem key={field.value} value={field.value}>
                  {field.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Operator</InputLabel>
            <Select
              value={currentFilter.operator}
              onChange={(e) =>
                setCurrentFilter((prev) => ({
                  ...prev,
                  operator: e.target.value,
                }))
              }
              label="Operator"
            >
              {filterOperators.map((op) => (
                <MenuItem key={op.value} value={op.value}>
                  {op.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Value"
            value={currentFilter.value}
            onChange={(e) =>
              setCurrentFilter((prev) => ({ ...prev, value: e.target.value }))
            }
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAddFilter} variant="contained">
          Add Filter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
