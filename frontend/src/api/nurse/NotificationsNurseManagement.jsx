import axiosInstance from "../axiosInstance";

export const getNotificationsByNurseId = async (nurseId ,pageNumber = 1, pageSize = 10, search) => {
  try {
    const res = await axiosInstance.get(
      `/Notification/nurse/${nurseId}?pageNumber=${pageNumber}&pageSize=${pageSize}` + (search ? `&search=${search}` : "")
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

export const getOtherResultDeltail = async (otherId) => {
  try {
    const res = await axiosInstance.get(
      `/OtherCheck/${otherId}`
    );
    if (res.data.data) {
      return res.data.data;
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};