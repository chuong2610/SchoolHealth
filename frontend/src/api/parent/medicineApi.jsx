import axiosInstance from "../axiosInstance";

export const sendMedicineApi = async (data) => {
  try {
    const res = await axiosInstance.post("/Medication", data);
    return res.data;
  } catch (error) {
    console.error("Send medicine failed:", error);
    throw error;
  }
};

export const getStudentListByParentId = async (parentId) => {
  try {
    const res = await axiosInstance.get(`/Students/by-parent/${parentId}`);
    if (res.data.success === true) {
      return res.data.data;
    } else {
      console.error("Error in getStudentListByParentId:", res.data.message);
      return [];
    }
  } catch (error) {
    console.error("Get StudentList failed:", error);
    throw error;
  }
}
