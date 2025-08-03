export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  accelSec: number;
  topSpeedKm: number;
  rangeKm: number;
  efficiencyKwh100km: number;
  fastChargKmh: number;
  rapidChar: string;
  powerTrain: string;
  plugType: string;
  bodyStyle: string;
  segment: string;
  seats: number;
  priceEuro: number;
  date: string;
}

export interface FilterState {
  [key: string]: {
    operator: string;
    value: string;
  };
}

export interface FilterData {
  field: string;
  operator: string;
  value: string;
}

export interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  onAddFilter: (filter: FilterData) => void;
}

export interface SearchAndFilterControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: FilterState;
  setFilters: (
    filters: FilterState | ((prev: FilterState) => FilterState)
  ) => void;
  onAddFilter: () => void;
  onRemoveFilter: (field: string) => void;
  onRefresh?: () => void;
  loading?: boolean;
}

export interface VehicleDetailDialogProps {
  open: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface VehicleGridProps {
  vehicles: Vehicle[];
  pagination: PaginationState;
  loading: boolean;
  onViewVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (vehicleId: number) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}
