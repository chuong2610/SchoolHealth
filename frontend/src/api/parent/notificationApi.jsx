import axiosInstance from "../axiosInstance";

export const getNotifications = async (
  parentId,
  pageNumber,
  pageSize,
  search
) => {
  try {
    console.log("🔍 API Call - getNotifications:", {
      parentId,
      pageNumber,
      pageSize,
      search,
      url: `/Notification/parent/${parentId}`,
    });
    const params = search
      ? { pageNumber, pageSize, search }
      : { pageNumber, pageSize };
    const res = await axiosInstance.get(`/Notification/parent/${parentId}`, {
      params,
    });

    console.log("✅ API Response - getNotifications:", {
      success: res.data.success,
      message: res.data.message,
      data: res.data.data,
    });

    if (res.data.success === true) {
      return res.data.data;
    } else {
      console.error("❌ Error in getNotifications:", res.data.message);
      return { items: [], totalPages: 0 };
    }
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    console.error("❌ Error response:", error.response?.data);
    throw error;
  }
};

export const getNotificationDetailById = async (data) => {
    try {
        // Validate request data
        if (!data.notificationId || !data.studentId) {
            console.error("❌ Missing required fields:", { notificationId: data.notificationId, studentId: data.studentId });
            throw new Error("Missing required fields: notificationId or studentId");
        }

        console.log("📡 Sending notification detail request:", data);

        // Call the actual backend endpoint (with typo) that exists
        const res = await axiosInstance.post("/Notification/notificationDeatil", data);
        if (res.data.success === true) {
            return res.data.data;
        } else {
            console.error("❌ Error in getNotificationDetailById:", res.data.message);
            throw new Error(res.data.message || "Failed to fetch notification detail");
        }
    } catch (error) {
        console.error("❌ Error fetching notification detail:", error);
        throw error;
    }
};

export const getHealthCheckNotifications = async (
  parentId,
  pageNumber,
  pageSize,
  search
) => {
  try {
    const res = await axiosInstance.get(
      `/Notification/parent/${parentId}/HealthCheck`,
      {
        params: { pageNumber, pageSize, search },
      }
    );
    if (res.data.success === true) {
      return res.data.data;
    } else {
      console.error("Error in getHealthCheckNotifications:", res.data.message);
      return { items: [], totalPages: 0 };
    }
  } catch (error) {
    console.error("Error fetching health check notifications:", error);
    throw error;
  }
};

export const getVaccinationNotifications = async (
  parentId,
  pageNumber,
  pageSize,
  search
) => {
  try {
    const res = await axiosInstance.get(
      `/Notification/parent/${parentId}/Vaccination`,
      {
        params: { pageNumber, pageSize, search },
      }
    );
    if (res.data.success === true) {
      return res.data.data;
    } else {
      console.error("Error in getVaccinationNotifications:", res.data.message);
      return { items: [], totalPages: 0 };
    }
  } catch (error) {
    console.error("Error fetching vaccination notifications:", error);
    throw error;
  }
};
