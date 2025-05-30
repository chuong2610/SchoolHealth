import axiosInstance from "../axiosInstance";

export const sendMedicineApi = async (data) => {
  try {
    const res = await axiosInstance.post("/products", data);
    return res.data;
  } catch (error) {
    console.error("Send medicine failed:", error);
    throw error;
  }
};
