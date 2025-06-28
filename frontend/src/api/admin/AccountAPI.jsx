import React from "react";
import axiosInstance from "../axiosInstance";

export const deleteStudentById = async (studentId) => {
  try {
    const res = await axiosInstance.delete(`/Students/${studentId}`);
    if (res.data.success) {
      console.log("Student deleted successfully", res.data.message);
      return true;
    }
  } catch (error) {
    console.error("Error deleting student:", error);
  }
};

export const getClasses = async () => {
  try {
    const res = await axiosInstance.get(`/Class`);
    if (res.data.success) {
      console.log("Get classes successfully", res.data.message);
      return res.data.data;
    }
  } catch (error) {
    console.error("Error Get classes: ", error);
  }
};

export const getStudentsByClassId = async (
  classId,
  pageNumber = 1,
  pageSize = 5,
  search
) => {
  try {
    const res = await axiosInstance.get(
      `/Students/${classId}?pageNumber=${pageNumber}&pageSize=${pageSize}` +
        `${search ? `&search=${search}` : ""}`
    );
    if (res.data.success) {
      console.log("Get students by classId successfully", res.data.message);
      return res.data.data;
    }
  } catch (error) {
    console.error("Error Get students by classId: ", error);
  }
};

export const addStudentAndParent = async (newStudent) => {
  try {
    const res = await axiosInstance.post(`/Students`, newStudent);
    if (res.data.success) {
      console.log("Post student successfully", res.data.message);
      return res.data.data;
    }
  } catch (error) {
    console.error("Error post student: ", error);
  }
};

export const updateStudent = async (newStudent, studentId) => {
  try {
    const res = await axiosInstance.patch(`/Students/${studentId}`, newStudent);
    if (res.data.success) {
      console.log("Patch student successfully", res.data.message);
      return res.data.data;
    }
  } catch (error) {
    console.error("Error patch student: ", error);
  }
};

export const importExcelFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axiosInstance.post(
      `/Excel/import-students-and-parents`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.data.success === true) {
      //   return res.data.data;
    } else {
      //   return [];
    }
  } catch (error) {
    throw error;
  }
};

export const exportExcelFile = async () => {
  try {
    const res = await axiosInstance.get(
      `/Excel/export-form-students-and-parents`,
      {
        responseType: "blob", // Nhan ve file nhi phan
      }
    );

    // Tao url tam cho blob
    const url = window.URL.createObjectURL(new Blob([res.data]));

    // Tao the link de nhan download
    const link = document.createElement("a");
    link.href = url;
    link.download = "Mau_them_hoc_sinh_va_phu_huynh.xlsx"; // Dat ten file mac dinh
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    throw error;
  }
};
