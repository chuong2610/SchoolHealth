import axiosInstance from "../axiosInstance";

export const getClassList = async () => {
  try {
    const res = await axiosInstance.get("/Class");
    let classData = null;
    if (res.data && res.data.success && res.data.data) {
      classData = res.data.data;
    } else if (res.data && Array.isArray(res.data)) {
      classData = res.data;
    } else if (res.data && res.data.success === false) {
      classData = [];
    } else {
      classData = [];
    }
    if (classData && Array.isArray(classData) && classData.length > 0) {
      const transformedData = classData.map((cls) => ({
        id: cls.classId || cls.id,
        name: cls.className || cls.name,
        className: cls.className || cls.name,
        classId: cls.classId || cls.id,
      }));
      return transformedData;
    }
    return classData;
  } catch (error) {
    return [];
  }
};

export const getNurseList = async () => {
  try {
    const res = await axiosInstance.get("/User/nurses");
    let nurseData = null;
    if (res.data && Array.isArray(res.data)) {
      nurseData = res.data;
    } else if (res.data && res.data.success && res.data.data) {
      nurseData = res.data.data;
    } else if (res.data && res.data.success === false) {
      nurseData = [];
    } else if (res.data && typeof res.data === "object") {
      nurseData = Object.values(res.data).find((val) => Array.isArray(val)) || [];
    } else {
      nurseData = [];
    }
    if (nurseData && Array.isArray(nurseData) && nurseData.length > 0) {
      const transformedData = nurseData.map((nurse) => ({
        id: nurse.id,
        fullName: nurse.nurseName || nurse.fullName || nurse.name,
        name: nurse.nurseName || nurse.fullName || nurse.name,
        nurseName: nurse.nurseName || nurse.name,
        role: nurse.role || "Nurse",
      }));
      return transformedData;
    }
    return nurseData;
  } catch (error) {
    return [];
  }
};

export const getNotifications = async (
  pageNumber = 1,
  pageSize = 10,
  search
) => {
  try {
    const res = await axiosInstance.get(
      `/Notification?pageNumber=${pageNumber}&pageSize=${pageSize}` +
      (search ? `&search=${search}` : "")
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
    const classId = notificationData.classId;
    const assignedToId = notificationData.assignedToId;
    if (!classId || classId === "" || isNaN(parseInt(classId))) {
      throw new Error(`Invalid classId: "${classId}". Expected a numeric ID.`);
    }
    if (!assignedToId || assignedToId === "" || isNaN(parseInt(assignedToId))) {
      throw new Error(
        `Invalid assignedToId: "${assignedToId}". Expected a numeric ID.`
      );
    }
    const transformedData = {
      VaccineName: notificationData.vaccineName || "",
      Title: notificationData.title || "",
      Type: notificationData.type || "",
      Message: notificationData.message || "",
      Note: notificationData.note || "",
      Location: notificationData.location || "",
      Date: notificationData.date
        ? new Date(notificationData.date).toISOString()
        : new Date().toISOString(),
      ClassId: parseInt(classId),
      CheckList: notificationData.checkList || [],
      AssignedToId: parseInt(assignedToId),
    };
    const res = await axiosInstance.post(
      "/Notification/notification",
      transformedData
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
    }
  } catch (error) {
    throw error;
  }
};
