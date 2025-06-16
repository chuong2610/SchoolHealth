import axiosInstance from "../axiosInstance";

// export const getNotifications = async () => {
//     try {
//         const res = await axiosInstance.get("/Notification");
//         if(res.data.success === true) {
//             console.log(res.data.message);
//             return res.data.data;
//         } else {
//             console.log(res.data.message);
//             return [];
//         }
//     } catch(error) {
//         console.log("Loi getNotifications:", error);
//         throw error;
//     }
// }

export const getClassList = async () => {
  try {
    const res = await axiosInstance.get("/Class");
    if (res.data.success) {
      console.log(res.data.message);
      return res.data.data;
    } else {
      console.log(res.data.message);
      return [];
    }
  } catch (error) {
    console.log("Loi getClassList:", error);
    throw error;
  }
};

export const getNurseList = async () => {
  try {
    const res = await axiosInstance.get("/User/nurses");
    // if (res.data.success) {
    //   console.log(res.data.message);
    //   return res.data.data;
    // } else {
    //   console.log(res.data.message);
    //   return [];
    // }
    if (res.data) {
      return res.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log("Loi getNurseList:", error);
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
    console.log("Loi getNotifications:", error);
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
      console.log(res.data.message);
      return res.data.message;
    } else {
      console.log(res.data.message);
      return res.data.message;
    }
  } catch (error) {
    console.log("Loi postNotification:", error);
    throw error;
  }
};

export const getNotificationDetail = async (notificationId) => {
  try {
    const res = await axiosInstance.get(
      `/Notification/admin/${notificationId}`
    );
    if (res.data.success === true) {
      console.log(res.data.message);
      return res.data.data;
    } else {
      console.log(res.data.message);
      return {};
    }
  } catch (error) {
    console.log("Lỗi getNotificationDetail:", error);
    throw error;
  }
};

export const getHealthCheckResultDeltail = async (healthCheckId) => {
  try {
    const res = await axiosInstance.get(`/HealthCheck/${healthCheckId}`);
    if (res.data.success) {
      console.log(res.data.message);
      return res.data.data;
    } else {
      console.log(res.data.message);
      return {};
    }
  } catch (error) {
    console.log("Loi getHealthCheckResultDeltail:", error);
    throw error;
  }
};

export const getVaccinationResultDeltail = async (vaccinationId) => {
  try {
    const res = await axiosInstance.get(`/Vaccination/${vaccinationId}`);
    if (res.data.success) {
      console.log(res.data.message);
      return res.data.data;
    } else {
      console.log(res.data.message);
      return {};
    }
  } catch (error) {
    console.log("Loi getVaccinationResultDeltail:", error);
    throw error;
  }
};
