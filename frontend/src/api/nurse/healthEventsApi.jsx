import { ExportToExcel } from "../../utils/excelUtils";
import axiosInstance from "../axiosInstance";

export const getMedicalEvents = async () => {
  try {
    const res = await axiosInstance.get("/MedicalEvent");
    if (res.data.success === true) {
      console.log(res.data.message);
      return res.data.data;
    } else {
      console.log("Loi getMedicalEvents");
      return [];
    }
  } catch (error) {
    console.log("Loi getMedicalEvents");
    throw error;
  }
};

export const getMedicalEventDetail = async (eventId) => {
  try {
    const res = await axiosInstance.get(`/MedicalEvent/${eventId}`);
    if (res.data.success === true) {
      console.log(res.data.message);
      return res.data.data;
    } else {
      console.log("Loi getMedicalEventDetail");
      return {};
    }
  } catch (error) {
    console.log("Loi getMedicalEventDetail");
    throw error;
  }
};

export const postMedicalEvent = async (data) => {
  try {
    const res = await axiosInstance.post("/MedicalEvent", data);
    if (res.data.success === true) {
      console.log(res.data.message);
      return res.data.data;
    } else {
      console.log("Loi postMedicalEvent");
    }
  } catch (error) {
    console.log("Loi postMedicalEvent");
    throw error;
  }
};

export const getMedicalSupply = async () => {
  try {
    const res = await axiosInstance.get("/MedicalSupply");
    if (res.data.success === true) {
      console.log(res.data.message);
      return res.data.data;
    } else {
      console.log("Loi getMedicalSupply");
      return [];
    }
  } catch (error) {
    console.log("Loi getMedicalSupply");
    throw error;
  }
};
