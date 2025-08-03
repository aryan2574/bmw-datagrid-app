import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { VehicleDetailDialogProps } from "../../models/model";

const VehicleDetailDialog: React.FC<VehicleDetailDialogProps> = ({
  open,
  onClose,
  vehicle,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!vehicle) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
        Electric Vehicle Details
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
            gap: { xs: 1, sm: 2 },
            pt: 1,
          }}
        >
          <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
            <strong>ID:</strong> {vehicle.id}
          </Typography>
          <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
            <strong>Brand:</strong> {vehicle.brand}
          </Typography>
          <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
            <strong>Model:</strong> {vehicle.model}
          </Typography>
          <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
            <strong>Acceleration:</strong> {vehicle.accelSec}s
          </Typography>
          <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
            <strong>Top Speed:</strong> {vehicle.topSpeedKm} km/h
          </Typography>
          <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
            <strong>Range:</strong> {vehicle.rangeKm} km
          </Typography>
          <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
            <strong>Efficiency:</strong> {vehicle.efficiencyKwh100km} kWh/100km
          </Typography>
          <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
            <strong>Fast Charge:</strong> {vehicle.fastChargKmh} km/h
          </Typography>
          <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
            <strong>Rapid Charge:</strong> {vehicle.rapidChar}
          </Typography>
          <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
            <strong>Power Train:</strong> {vehicle.powerTrain}
          </Typography>
          <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
            <strong>Plug Type:</strong> {vehicle.plugType}
          </Typography>
          <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
            <strong>Body Style:</strong> {vehicle.bodyStyle}
          </Typography>
          <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
            <strong>Segment:</strong> {vehicle.segment}
          </Typography>
          <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
            <strong>Seats:</strong> {vehicle.seats}
          </Typography>
          <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
            <strong>Price:</strong> €{vehicle.priceEuro?.toLocaleString()}
          </Typography>
          <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
            <strong>Date:</strong> {vehicle.date}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: { xs: 2, sm: 1 } }}>
        <Button
          onClick={onClose}
          size={isMobile ? "large" : "medium"}
          fullWidth={isMobile}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VehicleDetailDialog;
