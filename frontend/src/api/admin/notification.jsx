import axiosInstance from "../axiosInstance";

// export const getNotifications = async () => {
//     try {
//         const res = await axiosInstance.get("/Notification");
//         if(res.data.success === true) {
//             return res.data.data;
//         } else {
//             return [];
//         }
//     } catch(error) {
//         throw error;
//     }
// }

export const getClassList = async () => {
  try {
    const res = await axiosInstance.get("/Class");
    if (res.data.success) {
      return res.data.data;
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};

export const getNurseList = async () => {
  try {
    const res = await axiosInstance.get("/User/nurses");
    // if (res.data.success) {
    //   return res.data.data;
    // } else {
    //   return [];
    // }
    if (res.data) {
      return res.data;
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};

export const getNotifications = async (pageNumber = 1, pageSize = 10, search) => {
  try {
    const res = await axiosInstance.get(
      `/Notification?pageNumber=${pageNumber}&pageSize=${pageSize}` + (search ? `&search=${search}` : "")
    );
    if (res.data) {
      return res.data;
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};

export const postNotification = async (notificationData) => {
  try {
    const res = await axiosInstance.post(
      "/Notification/notification",
      notificationData
    );
    if (res.data.success === true) {
      return res.data.message;
    } else {
      return res.data.message;
    }
  } catch (error) {
    throw error;
  }
};

export const getNotificationDetail = async (notificationId, pageNumber = 1, pageSize = 10) => {
  try {
    const res = await axiosInstance.get(
      // `/Notification/admin/${notificationId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
      `/Notification/admin/${notificationId}?pageNumber=1&pageSize=1000`
    );
    if (res.data.success === true) {
      return res.data.data;
    } else {
      return {};
    }
  } catch (error) {
    throw error;
  }
};

export const getHealthCheckResultDeltail = async (healthCheckId) => {
  try {
    const res = await axiosInstance.get(`/HealthCheck/${healthCheckId}`);
    if (res.data.success) {
      return res.data.data;
    } else {
      return {};
    }
  } catch (error) {
    throw error;
  }
};

export const getVaccinationResultDeltail = async (vaccinationId) => {
  try {
    const res = await axiosInstance.get(`/Vaccination/${vaccinationId}`);
    if (res.data.success) {
      return res.data.data;
    } else {
      return {};
    }
  } catch (error) {
    throw error;
  }
};

export const getNotiManagementStats = async () => {
  try {
    const res = await axiosInstance.get(
      "/Notification/notification-admin-count"
    );
    if (res.data.success) {
      return res.data.data;
    } else {
      console.log("Loi getNotiManagementStats", res.data.message);
    }
  } catch (error) {
    console.log("error getNotiManagementStats", error);
    throw error;
  }
};
