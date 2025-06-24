import { ExportToExcel } from "../../utils/excelUtils";
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

export const getMedicalEventDetail = async (eventId) => {
  try {
    const res = await axiosInstance.get(`/MedicalEvent/${eventId}`);
    console.log("res.data.data:", res.data.data); // 👉 THÊM DÒNG NÀY
    if (res.data.success === true) {
      return res.data.data;
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

export const getMedicalSupply = async (pageNumber = 1, pageSize = 1) => {
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
