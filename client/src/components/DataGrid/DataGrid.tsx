import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Vehicle, FilterData } from "../../models/model";
import SearchAndFilterControls from "./SearchAndFilterControls";
import VehicleGrid from "./VehicleGrid";
import FilterDialog from "./FilterDialog";
import VehicleDetailDialog from "./VehicleDetailDialog";
import { useVehicleData } from "../../hooks/useVehicleData";

const DataGrid: React.FC = () => {
  const {
    vehicles,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    fetchVehicles,
  } = useVehicleData();

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleViewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDetailDialogOpen(true);
  };

  const handleDeleteVehicle = async (vehicleId: number) => {
    await fetchVehicles();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Electric Vehicle DataGrid
      </Typography>

      <SearchAndFilterControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        onAddFilter={() => setFilterDialogOpen(true)}
        onRemoveFilter={(field: string) => {
          setFilters((prev) => {
            const newFilters = { ...prev };
            delete newFilters[field];
            return newFilters;
          });
        }}
      />

      <VehicleGrid
        vehicles={vehicles}
        onViewVehicle={handleViewVehicle}
        onDeleteVehicle={handleDeleteVehicle}
      />

      <FilterDialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        onAddFilter={(newFilter: FilterData) => {
          setFilters((prev) => ({
            ...prev,
            [newFilter.field]: {
              operator: newFilter.operator,
              value: newFilter.value,
            },
          }));
          setFilterDialogOpen(false);
        }}
      />

      <VehicleDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        vehicle={selectedVehicle}
      />
    </Box>
  );
};

export default DataGrid;
