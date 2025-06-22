import axiosInstance from "../axiosInstance";

export const sendConsentApi = async (data) => {
  try {
    // Validate required fields
    if (!data.notificationId || !data.studentId || !data.status) {
      throw new Error("Missing required fields: notificationId, studentId, or status");
    }

    const res = await axiosInstance.patch("/NotificationStudent", data);
    if (res.data.success === true) {
      return res.data.data;
    } else {
      console.error("❌ Error in sendConsentApi:", res.data.message);
      throw new Error(res.data.message || "Failed to send consent");
    }
  } catch (error) {
    console.error("❌ Send consent failed:", error);
    throw error;
  }
};
