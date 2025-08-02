import { useState, useCallback } from "react";
import axios from "axios";
import { Vehicle, FilterState } from "../models/model";

const API_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export const useVehicleData = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<FilterState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const fetchVehicles = useCallback(
    async (page?: number, pageSize?: number) => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        // Use provided page/pageSize or current state
        const currentPage = page ?? pagination.page;
        const currentPageSize = pageSize ?? pagination.pageSize;

        params.append("page", currentPage.toString());
        params.append("limit", currentPageSize.toString());

        if (searchTerm) params.append("search", searchTerm);
        if (Object.keys(filters).length > 0) {
          params.append("filter", JSON.stringify(filters));
        }

        const response = await axios.get(
          `${API_URL}/vehicles?${params.toString()}`
        );

        const responseData = response.data;

        // Handle different response formats
        const vehiclesData = responseData.data || responseData;
        const total = responseData.total || vehiclesData.length || 0;
        const totalPages =
          responseData.totalPages || Math.ceil(total / currentPageSize) || 0;

        setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);

        // Update pagination state
        setPagination({
          page: responseData.page || currentPage,
          pageSize: currentPageSize,
          total: total,
          totalPages: totalPages,
        });
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        // Reset to empty state on error
        setVehicles([]);
        setPagination({
          page: 1,
          pageSize: pagination.pageSize,
          total: 0,
          totalPages: 0,
        });
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, filters, pagination.page, pagination.pageSize]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      fetchVehicles(newPage, pagination.pageSize);
    },
    [fetchVehicles, pagination.pageSize]
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      // Reset to first page when changing page size
      fetchVehicles(1, newPageSize);
    },
    [fetchVehicles]
  );

  const deleteVehicle = useCallback(
    async (vehicleId: number) => {
      try {
        await axios.delete(`${API_URL}/vehicles/${vehicleId}`);
        // Refresh current page data
        await fetchVehicles(pagination.page, pagination.pageSize);
      } catch (error) {
        console.error("Error deleting vehicle:", error);
      }
    },
    [fetchVehicles, pagination.page, pagination.pageSize]
  );

  const uploadCSV = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("csv", file);

      try {
        await axios.post(`${API_URL}/upload-csv`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        // Refresh data after CSV upload
        await fetchVehicles(1, pagination.pageSize);
      } catch (error) {
        console.error("Error uploading CSV:", error);
      }
    },
    [fetchVehicles, pagination.pageSize]
  );

  return {
    vehicles,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    pagination,
    loading,
    fetchVehicles,
    handlePageChange,
    handlePageSizeChange,
    deleteVehicle,
    uploadCSV,
  };
};
