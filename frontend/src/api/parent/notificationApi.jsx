import axiosInstance from "../axiosInstance";

export const getNotifications = async (
  parentId,
  pageNumber = 1,
  pageSize = 5,
  search
) => {
  try {
    const res = await axiosInstance.get(
      `/Notification/parent/${parentId}?pageNumber=${pageNumber}&pageSize=${pageSize}` +
        `${search ? `&search=${search}` : ""}`
    );
    if (res.data.success === true) {
      return res.data.data;
    } else {
      console.error("Error in getNotifications:", res.data.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const getNotificationDetailById = async (data) => {
  try {
    // Validate request data
    if (!data.notificationId || !data.studentId) {
      throw new Error("Missing required fields: notificationId or studentId");
    }

    const res = await axiosInstance.post(
      "/Notification/notificationDeatil",
      data
    );
    if (res.data.success === true) {
      return res.data.data;
    } else {
      console.error("❌ Error in getNotificationDetailById:", res.data.message);
      return {};
    }
  } catch (error) {
    console.error("❌ Error fetching notification detail:", error);
    throw error;
  }
};

export const getHealthCheckNotifications = async (
  parentId,
  pageNumber = 1,
  pageSize = 5,
  search
) => {
  try {
    const res = await axiosInstance.get(
      `/Notification/parent/${parentId}/HealthCheck?pageNumber=${pageNumber}&pageSize=${pageSize}` +
        `${search ? `&search=${search}` : ""}`
    );
    if (res.data.success === true) {
      return res.data.data;
    } else {
      console.error("Error in getHealthCheckNotifications:", res.data.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching health check notifications:", error);
    throw error;
  }
};

export const getVaccinationNotifications = async (
  parentId,
  pageNumber = 1,
  pageSize = 5,
  search
) => {
  try {
    const res = await axiosInstance.get(
      `/Notification/parent/${parentId}/Vaccination?pageNumber=${pageNumber}&pageSize=${pageSize}` +
        `${search ? `&search=${search}` : ""}`
    );
    if (res.data.success === true) {
      return res.data.data;
    } else {
      console.error("Error in getVaccinationNotifications:", res.data.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching vaccination notifications:", error);
    throw error;
  }
};
