import axiosInstance from "../axiosInstance";

export const getStudentsByClassId = async (classId) => {
  try {
    const res = await axiosInstance.get(
      `/Students/${classId}?pageNumber=1&pageSize=100`
    );
    if (res.data.success === true) {
      return res.data.data;
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};

export const getConsultations = async (
  nurseId,
  pageSize = 10,
  pageNumber = 1,
  search,
  searchDate
) => {
  try {
    const res = await axiosInstance.get(
      `/ConsultationAppointment/nurse/${nurseId}?pageNumber=${pageNumber}&pageSize=${pageSize}` +
        `${search ? `&search=${search}` : ""}` +
        `${searchDate ? `&searchDate=${searchDate}` : ""}`
    );
    if (res.data.success === true) {
      return res.data.data;
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};
export const getConsultationById = async (id) => {
  try {
    const res = await axiosInstance.get(`/ConsultationAppointment/${id}`);
    if (res.data.success === true) {
      return res.data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const postConsultation = async (data) => {
  try {
    const res = await axiosInstance.post(`/ConsultationAppointment`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.data.success === true) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};
