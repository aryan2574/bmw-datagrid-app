import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { ColDef, GridReadyEvent, ICellRendererParams } from "ag-grid-community";
import {
  Paper,
  Box,
  IconButton,
  Chip,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  Typography,
  SelectChangeEvent,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { VehicleGridProps } from "../../models/model";
import { useVehicleData } from "../../hooks/useVehicleData";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

const VehicleGrid: React.FC<VehicleGridProps> = ({
  vehicles,
  pagination,
  loading,
  onViewVehicle,
  onDeleteVehicle,
  onPageChange,
  onPageSizeChange,
}) => {
  const { deleteVehicle } = useVehicleData();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const ActionCellRenderer = useMemo(
    () => (props: ICellRendererParams) => {
      const handleView = () => {
        onViewVehicle(props.data);
      };

      const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this vehicle?")) {
          try {
            await deleteVehicle(props.data.id);
            // Call the onDeleteVehicle callback to ensure proper refresh
            onDeleteVehicle(props.data.id);
          } catch (error) {
            console.error("Error deleting vehicle:", error);
          }
        }
      };

      return (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton size="small" onClick={handleView} color="primary">
            <ViewIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={handleDelete} color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      );
    },
    [onViewVehicle, deleteVehicle, onDeleteVehicle]
  );

  // Column definitions with responsive visibility
  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "ID",
        width: isMobile ? 60 : 80,
        sortable: true,
        filter: true,
      },
      {
        field: "brand",
        headerName: "Brand",
        width: isMobile ? 80 : 120,
        sortable: true,
        filter: true,
      },
      {
        field: "model",
        headerName: "Model",
        width: isMobile ? 100 : 150,
        sortable: true,
        filter: true,
      },
      {
        field: "accelSec",
        headerName: isMobile ? "Accel" : "Acceleration (s)",
        width: isMobile ? 70 : 130,
        sortable: true,
        filter: true,
        valueFormatter: (params) => `${params.value}s`,
      },
      {
        field: "topSpeedKm",
        headerName: isMobile ? "Speed" : "Top Speed (km/h)",
        width: isMobile ? 70 : 140,
        sortable: true,
        filter: true,
        valueFormatter: (params) => `${params.value} km/h`,
      },
      {
        field: "rangeKm",
        headerName: isMobile ? "Range" : "Range (km)",
        width: isMobile ? 70 : 120,
        sortable: true,
        filter: true,
        valueFormatter: (params) => `${params.value} km`,
      },
      {
        field: "efficiencyKwh100km",
        headerName: isMobile ? "Efficiency" : "Efficiency (kWh/100km)",
        width: isMobile ? 90 : 160,
        sortable: true,
        filter: true,
        valueFormatter: (params) => `${params.value} kWh/100km`,
      },
      {
        field: "fastChargKmh",
        headerName: isMobile ? "Fast Charge" : "Fast Charge (km/h)",
        width: isMobile ? 90 : 150,
        sortable: true,
        filter: true,
        valueFormatter: (params) => `${params.value} km/h`,
      },
      {
        field: "rapidChar",
        headerName: isMobile ? "Rapid" : "Rapid Charge",
        width: isMobile ? 70 : 120,
        sortable: true,
        filter: true,
        cellRenderer: (params: ICellRendererParams) => (
          <Chip
            label={params.value}
            color={params.value === "Yes" ? "success" : "default"}
            size="small"
            sx={{ fontSize: "0.7rem" }}
          />
        ),
      },
      {
        field: "powerTrain",
        headerName: isMobile ? "Train" : "Power Train",
        width: isMobile ? 80 : 120,
        sortable: true,
        filter: true,
      },
      {
        field: "plugType",
        headerName: isMobile ? "Plug" : "Plug Type",
        width: isMobile ? 70 : 130,
        sortable: true,
        filter: true,
      },
      {
        field: "bodyStyle",
        headerName: isMobile ? "Style" : "Body Style",
        width: isMobile ? 80 : 120,
        sortable: true,
        filter: true,
      },
      {
        field: "segment",
        headerName: "Segment",
        width: isMobile ? 70 : 100,
        sortable: true,
        filter: true,
      },
      {
        field: "seats",
        headerName: "Seats",
        width: isMobile ? 60 : 80,
        sortable: true,
        filter: true,
      },
      {
        field: "priceEuro",
        headerName: isMobile ? "Price" : "Price (€)",
        width: isMobile ? 80 : 120,
        sortable: true,
        filter: true,
        valueFormatter: (params) => `€${params.value?.toLocaleString()}`,
      },
      {
        field: "date",
        headerName: "Date",
        width: isMobile ? 70 : 100,
        sortable: true,
        filter: true,
      },
      {
        headerName: "Actions",
        width: isMobile ? 80 : 120,
        cellRenderer: ActionCellRenderer,
        sortable: false,
        filter: false,
        pinned: "right",
      },
    ],
    [ActionCellRenderer, isMobile]
  );

  const handleGridReady = (params: GridReadyEvent) => {
    // Grid API is available but not used in this implementation
    console.log(params);
  };

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    const newPageSize = event.target.value as number;
    onPageSizeChange(newPageSize);
  };

  return (
    <Box>
      <Paper
        sx={{ height: { xs: 400, sm: 500, md: 600 }, position: "relative" }}
      >
        <div
          className="ag-theme-quartz"
          style={{ height: "100%", width: "100%" }}
        >
          <AgGridReact
            columnDefs={columnDefs}
            rowData={vehicles}
            onGridReady={handleGridReady}
            pagination={false}
            domLayout="normal"
            overlayLoadingTemplate="<span class='ag-overlay-loading-center'>Loading electric vehicles...</span>"
            overlayNoRowsTemplate="<span class='ag-overlay-no-rows-center'>No electric vehicles found</span>"
            defaultColDef={{
              resizable: !isMobile,
              sortable: true,
              filter: true,
            }}
          />
        </div>

        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Paper>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          p: { xs: 1, sm: 2 },
          backgroundColor: "background.paper",
          borderRadius: 1,
          boxShadow: 1,
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1, sm: 0 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Rows per page:
          </Typography>
          <FormControl size="small" sx={{ minWidth: 80, maxWidth: 100 }}>
            <Select
              value={pagination.pageSize}
              onChange={handlePageSizeChange}
              displayEmpty
              disabled={loading}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" color="text.secondary">
            {`${(pagination.page - 1) * pagination.pageSize + 1}-${Math.min(
              pagination.page * pagination.pageSize,
              pagination.total
            )} of ${pagination.total}`}
          </Typography>
        </Box>

        <Pagination
          count={pagination.totalPages}
          page={pagination.page}
          onChange={(_, page) => onPageChange(page)}
          color="primary"
          showFirstButton={!isMobile}
          showLastButton={!isMobile}
          disabled={loading}
          size={isMobile ? "small" : "medium"}
          sx={{
            "& .MuiPaginationItem-root": {
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default VehicleGrid;
