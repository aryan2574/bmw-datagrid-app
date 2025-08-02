import { useState, useCallback } from "react";
import axios from "axios";
import { Vehicle, FilterState } from "../models/model";

const API_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

export const useVehicleData = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<FilterState>({});

  const fetchVehicles = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (Object.keys(filters).length > 0) {
        params.append("filter", JSON.stringify(filters));
      }

      const response = await axios.get(
        `${API_URL}/vehicles?${params.toString()}`
      );

      setVehicles(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  }, [searchTerm, filters]);

  const deleteVehicle = useCallback(
    async (vehicleId: number) => {
      try {
        await axios.delete(`${API_URL}/vehicles/${vehicleId}`);
        await fetchVehicles();
      } catch (error) {
        console.error("Error deleting vehicle:", error);
      }
    },
    [fetchVehicles]
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
        await fetchVehicles();
      } catch (error) {
        console.error("Error uploading CSV:", error);
      }
    },
    [fetchVehicles]
  );

  return {
    vehicles,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    fetchVehicles,
    deleteVehicle,
    uploadCSV,
  };
};
