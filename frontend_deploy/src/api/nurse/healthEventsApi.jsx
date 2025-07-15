import axiosInstance from "../axiosInstance";

// export const getMedicalEvents = async () => {
//   try {
//     const res = await axiosInstance.get("/MedicalEvent");
//     if (res.data.success === true) {
//       return res.data.data;
//     } else {
//       return [];
//     }
//   } catch (error) {
//     throw error;
//   }
// };

export const getMedicalEvents = async (
  pageNumber = 1,
  pageSize = 10,
  search = ""
) => {
  let url = `/MedicalEvent?pageNumber=${pageNumber}&pageSize=${pageSize}`;
  if (search && search.trim() !== "") {
    url += `&search=${encodeURIComponent(search)}`;
  }
  try {
    const res = await axiosInstance.get(url);
    const { data } = res.data;

    if (data && Array.isArray(data.items)) {
      return {
        items: data.items,
        totalPages: data.totalPages || 1,
        currentPage: data.currentPage || pageNumber,
      };
    } else {
      return { items: [], totalPages: 1, currentPage: 1 };
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

export const getMedicalSupply = async (pageNumber = 1, pageSize = 100) => {
  try {
    const res = await axiosInstance.get(
      `/MedicalSupply?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    if (res.data.success === true) {
      return res.data.data.items || [];
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};

export const getHealthEventStatistics = async () => {
  try {
    const res = await axiosInstance.get("/MedicalEvent/medical-event-count");
    if (res.data.success === true) {
      return res.data.data;
    } else {
    }
  } catch (error) {
    throw error;
  }
}

