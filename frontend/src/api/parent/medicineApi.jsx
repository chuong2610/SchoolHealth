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
  try{
    // fake parentId
    const parentId = "3";
    const res = await axiosInstance.get(`/Students/by-parent/${parentId}`);
    if(res.data.success === true) {
      console.log(res.data.message);
      return res.data.data;
    } else {
      console.log("Loi roi");
      return [];
    }
  } catch(error) {
    console.error("Get StudentList failed:", error);
    throw error;
  }
}
