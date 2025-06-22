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

export const getNotifications = async () => {
  try {
    const res = await axiosInstance.get("/Notification");
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

export const getNotificationDetail = async (notificationId) => {
  try {
    const res = await axiosInstance.get(
      `/Notification/admin/${notificationId}`
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
