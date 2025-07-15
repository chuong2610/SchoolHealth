import axiosInstance from "../axiosInstance";

export const sendMedicineApi = async (data) => {
  try {
    const res = await axiosInstance.post("/Medication", data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getStudentListByParentId = async (parentId) => {
  try {
    const res = await axiosInstance.get(`/Students/by-parent/${parentId}`);
    if (res.data.success === true) {
      return res.data.data;
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
}
