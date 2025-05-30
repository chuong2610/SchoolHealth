import axiosInstance from "../axiosInstance";

export const sendConsentApi = async (data) => {
  try {
    const res = await axiosInstance.post("/products", data);
    return res.data;
  } catch (error) {
    console.error("Send consent failed:", error);
    throw error;
  }
};
