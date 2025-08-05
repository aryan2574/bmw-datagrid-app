import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FilterDialogProps, FilterData } from "../../models/model";

const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onClose,
  onAddFilter,
}) => {
  const [field, setField] = useState<string>("");
  const [operator, setOperator] = useState<string>("contains");
  const [value, setValue] = useState<string>("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = () => {
    if (field && operator && value) {
      const newFilter: FilterData = {
        field,
        operator,
        value,
      };
      onAddFilter(newFilter);
      // Reset form
      setField("");
      setOperator("contains");
      setValue("");
    }
  };

  const handleClose = () => {
    // Reset form
    setField("");
    setOperator("contains");
    setValue("");
    onClose();
  };

  const vehicleFields = [
    "brand",
    "model",
    "accelSec",
    "topSpeedKm",
    "rangeKm",
    "efficiencyKwh100km",
    "fastChargKmh",
    "rapidChar",
    "powerTrain",
    "plugType",
    "bodyStyle",
    "segment",
    "seats",
    "priceEuro",
    "date",
  ];

  const operators = [
    { value: "contains", label: "Contains" },
    { value: "equals", label: "Equals" },
    { value: "startsWith", label: "Starts with" },
    { value: "endsWith", label: "Ends with" },
    { value: "isEmpty", label: "Is empty" },
    { value: "greaterThan", label: "Greater than" },
    { value: "lessThan", label: "Less than" },
  ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
        Add Filter
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: { xs: 2, sm: 3 },
            pt: 1,
          }}
        >
          <FormControl fullWidth size={isMobile ? "small" : "medium"}>
            <InputLabel>Field</InputLabel>
            <Select
              value={field}
              onChange={(e) => setField(e.target.value)}
              label="Field"
            >
              {vehicleFields.map((fieldName) => (
                <MenuItem key={fieldName} value={fieldName}>
                  {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size={isMobile ? "small" : "medium"}>
            <InputLabel>Operator</InputLabel>
            <Select
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              label="Operator"
            >
              {operators.map((op) => (
                <MenuItem key={op.value} value={op.value}>
                  {op.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            fullWidth
            size={isMobile ? "small" : "medium"}
            disabled={operator === "isEmpty"}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: { xs: 2, sm: 1 } }}>
        <Button onClick={handleClose} size={isMobile ? "large" : "medium"}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!field || !operator || (operator !== "isEmpty" && !value)}
          size={isMobile ? "large" : "medium"}
        >
          Add Filter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
