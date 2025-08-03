import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { VehicleDetailDialogProps } from "../../models/model";

const VehicleDetailDialog: React.FC<VehicleDetailDialogProps> = ({
  open,
  onClose,
  vehicle,
}) => {
  if (!vehicle) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Electric Vehicle Details</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 2,
            pt: 1,
          }}
        >
          <Typography>
            <strong>ID:</strong> {vehicle.id}
          </Typography>
          <Typography>
            <strong>Brand:</strong> {vehicle.brand}
          </Typography>
          <Typography>
            <strong>Model:</strong> {vehicle.model}
          </Typography>
          <Typography>
            <strong>Acceleration:</strong> {vehicle.accelSec}s
          </Typography>
          <Typography>
            <strong>Top Speed:</strong> {vehicle.topSpeedKm} km/h
          </Typography>
          <Typography>
            <strong>Range:</strong> {vehicle.rangeKm} km
          </Typography>
          <Typography>
            <strong>Efficiency:</strong> {vehicle.efficiencyKwh100km} kWh/100km
          </Typography>
          <Typography>
            <strong>Fast Charge:</strong> {vehicle.fastChargKmh} km/h
          </Typography>
          <Typography>
            <strong>Rapid Charge:</strong> {vehicle.rapidChar}
          </Typography>
          <Typography>
            <strong>Power Train:</strong> {vehicle.powerTrain}
          </Typography>
          <Typography>
            <strong>Plug Type:</strong> {vehicle.plugType}
          </Typography>
          <Typography>
            <strong>Body Style:</strong> {vehicle.bodyStyle}
          </Typography>
          <Typography>
            <strong>Segment:</strong> {vehicle.segment}
          </Typography>
          <Typography>
            <strong>Seats:</strong> {vehicle.seats}
          </Typography>
          <Typography>
            <strong>Price:</strong> €{vehicle.priceEuro?.toLocaleString()}
          </Typography>
          <Typography>
            <strong>Date:</strong> {vehicle.date}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default VehicleDetailDialog;
