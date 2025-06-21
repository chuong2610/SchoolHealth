import { ExportToExcel } from "../../utils/excelUtils";
import axiosInstance from "../axiosInstance";

export const getMedicalEvents = async (pageNumber = 1, pageSize = 5, search) => {
  try {
    const res = await axiosInstance.get(`/MedicalEvent?pageNumber=${pageNumber}&pageSize=${pageSize}` + `${search ? `&search=${search}` : ""}`);
    if (res.data.success === true) {
      return res.data.data;
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};

export const getMedicalEventDetail = async (eventId) => {
  try {
    const res = await axiosInstance.get(`/MedicalEvent/${eventId}`);
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

export const getMedicalSupply = async () => {
  try {
    const res = await axiosInstance.get("/MedicalSupply?pageNumber=1&pageSize=1000");
    if (res.data.success === true) {
      return res.data.data;
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};
