import { ExportToExcel } from "../../utils/excelUtils";
import axiosInstance from "../axiosInstance";

export const getMedicalEvents = async () => {
  try {
    const res = await axiosInstance.get("/MedicalEvent");
    if (res.data.success === true) {
      return res.data.data;
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy chi tiết sự kiện y tế theo ID
 * API: GET /api/MedicalEvent/{id}
 * Response: BaseResponse<MedicalEventDetailDTO>
 * 
 * MedicalEventDetailDTO structure:
 * - eventType: string
 * - location: string
 * - date: DateTime
 * - description: string
 * - studentName: string
 * - nurseName: string
 * - supplies: List<MedicationEventSupplyDetailDTO>
 */
export const getMedicalEventDetail = async (eventId) => {
  try {
    const res = await axiosInstance.get(`/MedicalEvent/${eventId}`);
    if (res.data.success === true) {
      // Map response để đảm bảo tương thích với frontend
      const data = res.data.data;
      return {
        ...data,
        id: eventId, // Thêm id để component có thể check
        // Map supplies từ backend format sang frontend format để backward compatibility
        medicalEventSupplys: data.supplies ? data.supplies.map(supply => ({
          medicalSupplyName: supply.medicalSupplyName,
          quantity: supply.quantity
        })) : []
      };
    } else {
      return {};
    }
  } catch (error) {
    console.error('Error fetching medical event detail:', error);
    throw error;
  }
};

export const postMedicalEvent = async (data) => {
  try {
    const res = await axiosInstance.post("/MedicalEvent", data);
    if (res.data.success === true) {
      return res.data.data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const getMedicalSupply = async () => {
  try {
    const res = await axiosInstance.get("/MedicalSupply");
    if (res.data.success === true) {
      return res.data.data;
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};
