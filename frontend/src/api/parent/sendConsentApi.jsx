import axiosInstance from "../axiosInstance";

export const sendConsentApi = async (data) => {
  try {
    const res = await axiosInstance.post("/NotificationStudent", data);
    if (res.data.success === true) {
      console.log(res.data.message);
      return res.data.data;
    } else {
      console.log("Gui du lieu that bai");
      return res.data.data;
    }
  } catch (error) {
    console.error("Send consent failed:", error);
    throw error;
  }
};
