import axiosInstance from "../axiosInstance";

export const getNotifications = async (
  parentId,
  pageNumber,
  pageSize,
  search
) => {
  try {
    const params = search
      ? { pageNumber, pageSize, search }
      : { pageNumber, pageSize };
    const res = await axiosInstance.get(`/Notification/parent/${parentId}`, {
      params,
    });



    if (res.data.success === true) {
      return res.data.data;
    } else {
      return { items: [], totalPages: 0 };
    }
  } catch (error) {
    throw error;
  }
};

export const getNotificationDetailById = async (data) => {
  try {
    // Validate request data
    if (!data.notificationId || !data.studentId) {
      throw new Error("Missing required fields: notificationId or studentId");
    }

    // Call the actual backend endpoint (with typo) that exists
    const res = await axiosInstance.post("/Notification/notificationDeatil", data);
    if (res.data.success === true) {
      return res.data.data;
    } else {
      throw new Error(res.data.message || "Failed to fetch notification detail");
    }
  } catch (error) {
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
      return { items: [], totalPages: 0 };
    }
  } catch (error) {
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
      return { items: [], totalPages: 0 };
    }
  } catch (error) {
    throw error;
  }
};

export const getNotificationsStatistics = async (parentId) => {
  try {
    const res = await axiosInstance.get(
      `/Notification/notification-count?parentId=${parentId}`
    );
    if (res.data.success === true) {
      return res.data.data;
    } else {
      console.error("Error in getNotificationsStatistics:", res.data.message);
      return {};
    }
  } catch (error) {
    console.error("Error fetching notifications statistics:", error);
    throw error;
  }
};

export const getOtherNotifications = async (
  parentId,
  pageNumber,
  pageSize,
  search
) => {
  try {
    const res = await axiosInstance.get(
      `/Notification/parent/${parentId}/OtherCheck`,
      {
        params: { pageNumber, pageSize, search },
      }
    );
    if (res.data.success === true) {
      return res.data.data;
    } else {
      return { items: [], totalPages: 0 };
    }
  } catch (error) {
    throw error;
  }
};

