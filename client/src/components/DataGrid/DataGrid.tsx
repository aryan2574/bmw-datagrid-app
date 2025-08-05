import React, { useState, useEffect } from "react";
import { Box, Typography, Alert, Snackbar } from "@mui/material";
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
    pagination,
    loading,
    error,
    clearError,
    fetchVehicles,
    handlePageChange,
    handlePageSizeChange,
  } = useVehicleData();

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  /**
   * Handles opening the vehicle detail dialog
   * @param vehicle - The vehicle object to display details for
   */
  const handleViewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDetailDialogOpen(true);
  };

  /**
   * Handles vehicle deletion and refreshes the data grid
   * @param vehicleId - The ID of the vehicle to delete
   */
  const handleDeleteVehicle = async (vehicleId: number) => {
    await fetchVehicles();
  };

  /**
   * Handles manual refresh of the data grid
   * Refetches data with current pagination settings
   */
  const handleRefresh = async () => {
    await fetchVehicles(pagination.page, pagination.pageSize);
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Main title for the application */}
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontSize: { xs: "1.5rem", sm: "2.125rem" },
          textAlign: { xs: "center", sm: "left" },
          mb: { xs: 2, sm: 3 },
        }}
      >
        Electric Vehicle DataGrid
      </Typography>

      {/* Error notification snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={clearError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={clearError} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Search and filter controls component */}
      <SearchAndFilterControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        onAddFilter={() => setFilterDialogOpen(true)}
        onRemoveFilter={(field: string) => {
          // Remove a specific filter from the filters object
          setFilters((prev) => {
            const newFilters = { ...prev };
            delete newFilters[field];
            return newFilters;
          });
        }}
        onRefresh={handleRefresh}
        loading={loading}
      />

      {/* Main data grid component displaying vehicles */}
      <VehicleGrid
        vehicles={vehicles}
        pagination={pagination}
        loading={loading}
        onViewVehicle={handleViewVehicle}
        onDeleteVehicle={handleDeleteVehicle}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Filter dialog */}
      <FilterDialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        onAddFilter={(newFilter: FilterData) => {
          // Add a new filter to the filters object
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

      {/* Vehicle detail dialog */}
      <VehicleDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        vehicle={selectedVehicle}
      />
    </Box>
  );
};

export default DataGrid;
