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
