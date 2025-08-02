import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { ColDef, GridReadyEvent, ICellRendererParams } from "ag-grid-community";
import { Paper, Box, IconButton, Chip } from "@mui/material";
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Vehicle } from "../../models/model";
import { useVehicleData } from "../../hooks/useVehicleData";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface VehicleGridProps {
  vehicles: Vehicle[];
  onViewVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (vehicleId: number) => void;
}

const VehicleGrid: React.FC<VehicleGridProps> = ({
  vehicles,
  onViewVehicle,
  onDeleteVehicle,
}) => {
  const { deleteVehicle } = useVehicleData();

  // Action cell renderer
  const ActionCellRenderer = useMemo(
    () => (props: ICellRendererParams) => {
      const handleView = () => {
        onViewVehicle(props.data);
      };

      const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this vehicle?")) {
          await deleteVehicle(props.data.id);
          onDeleteVehicle(props.data.id);
        }
      };

      return (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton size="small" onClick={handleView} color="primary">
            <ViewIcon />
          </IconButton>
          <IconButton size="small" onClick={handleDelete} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      );
    },
    [onViewVehicle, onDeleteVehicle, deleteVehicle]
  );

  // Column definitions
  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "ID",
        width: 80,
        sortable: true,
        filter: true,
      },
      {
        field: "brand",
        headerName: "Brand",
        width: 120,
        sortable: true,
        filter: true,
      },
      {
        field: "model",
        headerName: "Model",
        width: 150,
        sortable: true,
        filter: true,
      },
      {
        field: "accelSec",
        headerName: "Acceleration (s)",
        width: 130,
        sortable: true,
        filter: true,
        valueFormatter: (params) => `${params.value}s`,
      },
      {
        field: "topSpeedKm",
        headerName: "Top Speed (km/h)",
        width: 140,
        sortable: true,
        filter: true,
        valueFormatter: (params) => `${params.value} km/h`,
      },
      {
        field: "rangeKm",
        headerName: "Range (km)",
        width: 120,
        sortable: true,
        filter: true,
        valueFormatter: (params) => `${params.value} km`,
      },
      {
        field: "efficiencyKwh100km",
        headerName: "Efficiency (kWh/100km)",
        width: 160,
        sortable: true,
        filter: true,
        valueFormatter: (params) => `${params.value} kWh/100km`,
      },
      {
        field: "fastChargKmh",
        headerName: "Fast Charge (km/h)",
        width: 150,
        sortable: true,
        filter: true,
        valueFormatter: (params) => `${params.value} km/h`,
      },
      {
        field: "rapidChar",
        headerName: "Rapid Charge",
        width: 120,
        sortable: true,
        filter: true,
        cellRenderer: (params: ICellRendererParams) => (
          <Chip
            label={params.value}
            color={params.value === "Yes" ? "success" : "default"}
            size="small"
          />
        ),
      },
      {
        field: "powerTrain",
        headerName: "Power Train",
        width: 120,
        sortable: true,
        filter: true,
      },
      {
        field: "plugType",
        headerName: "Plug Type",
        width: 130,
        sortable: true,
        filter: true,
      },
      {
        field: "bodyStyle",
        headerName: "Body Style",
        width: 120,
        sortable: true,
        filter: true,
      },
      {
        field: "segment",
        headerName: "Segment",
        width: 100,
        sortable: true,
        filter: true,
      },
      {
        field: "seats",
        headerName: "Seats",
        width: 80,
        sortable: true,
        filter: true,
      },
      {
        field: "priceEuro",
        headerName: "Price (€)",
        width: 120,
        sortable: true,
        filter: true,
        valueFormatter: (params) => `€${params.value?.toLocaleString()}`,
      },
      {
        field: "date",
        headerName: "Date",
        width: 100,
        sortable: true,
        filter: true,
      },
      {
        headerName: "Actions",
        width: 120,
        cellRenderer: ActionCellRenderer,
        sortable: false,
        filter: false,
        pinned: "right",
      },
    ],
    [ActionCellRenderer]
  );

  const handleGridReady = (params: GridReadyEvent) => {
    // Grid API is available but not used in this implementation
  };

  return (
    <Paper sx={{ height: 600 }}>
      <div
        className="ag-theme-quartz"
        style={{ height: "100%", width: "100%" }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          rowData={vehicles}
          onGridReady={handleGridReady}
          pagination={true}
          paginationPageSize={20}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          domLayout="normal"
          overlayLoadingTemplate="<span class='ag-overlay-loading-center'>Loading electric vehicles...</span>"
          overlayNoRowsTemplate="<span class='ag-overlay-no-rows-center'>No electric vehicles found</span>"
        />
      </div>
    </Paper>
  );
};

export default VehicleGrid;
