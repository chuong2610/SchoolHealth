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

    // Handle different response formats
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

    // Transform backend field names to frontend expected format
    if (classData && Array.isArray(classData) && classData.length > 0) {
      const transformedData = classData.map((cls) => ({
        id: cls.classId || cls.id, // Backend sends 'classId', frontend expects 'id'
        name: cls.className || cls.name, // Backend sends 'className', frontend expects 'name'
        className: cls.className || cls.name, // Keep both for compatibility
        classId: cls.classId || cls.id, // Keep original for reference
      }));

      return transformedData;
    }

    // If no data from API, return sample data for development
    if (!classData || classData.length === 0) {
      return [
        { id: 1, name: "Lớp 10A1", className: "10A1" },
        { id: 2, name: "Lớp 10A2", className: "10A2" },
        { id: 3, name: "Lớp 11B1", className: "11B1" },
        { id: 4, name: "Lớp 12C1", className: "12C1" },
      ];
    }

    return classData;
  } catch (error) {
    // Return sample data on API error
    return [
      { id: 1, name: "Lớp 10A1", className: "10A1" },
      { id: 2, name: "Lớp 10A2", className: "10A2" },
      { id: 3, name: "Lớp 11B1", className: "11B1" },
      { id: 4, name: "Lớp 12C1", className: "12C1" },
    ];
  }
};

export const getNurseList = async () => {
  try {
    const res = await axiosInstance.get("/User/nurses");

    let nurseData = null;

    // UserController returns direct array (no BaseResponse wrapper)
    if (res.data && Array.isArray(res.data)) {
      nurseData = res.data;
    } else if (res.data && res.data.success && res.data.data) {
      nurseData = res.data.data;
    } else if (res.data && res.data.success === false) {
      nurseData = [];
    } else if (res.data && typeof res.data === "object") {
      // Try to extract array from object
      nurseData =
        Object.values(res.data).find((val) => Array.isArray(val)) || [];
    } else {
      nurseData = [];
    }

    // Transform backend field names to frontend expected format
    if (nurseData && Array.isArray(nurseData) && nurseData.length > 0) {
      const transformedData = nurseData.map((nurse) => ({
        id: nurse.id, // Backend sends 'id' correctly
        fullName: nurse.nurseName || nurse.fullName || nurse.name, // Backend sends 'nurseName', frontend expects 'fullName'
        name: nurse.nurseName || nurse.fullName || nurse.name, // Keep both for compatibility
        nurseName: nurse.nurseName || nurse.name, // Keep original for reference
        role: nurse.role || "Nurse",
      }));

      return transformedData;
    }

    // If no data from API, return sample data for development
    if (!nurseData || nurseData.length === 0) {
      return [
        {
          id: 1,
          fullName: "Nguyễn Thị Hạnh",
          name: "Nguyễn Thị Hạnh",
          role: "Nurse",
        },
        {
          id: 2,
          fullName: "Trần Văn Minh",
          name: "Trần Văn Minh",
          role: "Nurse",
        },
        { id: 3, fullName: "Lê Thị Mai", name: "Lê Thị Mai", role: "Nurse" },
        {
          id: 4,
          fullName: "Phạm Văn Hùng",
          name: "Phạm Văn Hùng",
          role: "Nurse",
        },
      ];
    }

    return nurseData;
  } catch (error) {
    // Return sample data on API error
    return [
      {
        id: 1,
        fullName: "Nguyễn Thị Hạnh",
        name: "Nguyễn Thị Hạnh",
        role: "Nurse",
      },
      {
        id: 2,
        fullName: "Trần Văn Minh",
        name: "Trần Văn Minh",
        role: "Nurse",
      },
      { id: 3, fullName: "Lê Thị Mai", name: "Lê Thị Mai", role: "Nurse" },
      {
        id: 4,
        fullName: "Phạm Văn Hùng",
        name: "Phạm Văn Hùng",
        role: "Nurse",
      },
    ];
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
  console.log("checkListJson:", notificationData.checkList);
  console.log(Array.isArray(notificationData.checkList)); // nên là true

  try {
    // Validate and clean data before transformation
    const classId = notificationData.classId;
    const assignedToId = notificationData.assignedToId;

    // Check for invalid values
    if (!classId || classId === "" || isNaN(parseInt(classId))) {
      throw new Error(`Invalid classId: "${classId}". Expected a numeric ID.`);
    }

    if (!assignedToId || assignedToId === "" || isNaN(parseInt(assignedToId))) {
      throw new Error(
        `Invalid assignedToId: "${assignedToId}". Expected a numeric ID.`
      );
    }

    // Transform camelCase to PascalCase for backend
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
      CheckList: notificationData.checkList || [], // ✔️ đúng theo DTO trong backend
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

{/**Lấy ra chi tiết thông báo dựa vào id */}
export const getNotificationDetail = async (notificationId) => {
  try {
    const res = await axiosInstance.get(
      // `/Notification/admin/${notificationId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
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
