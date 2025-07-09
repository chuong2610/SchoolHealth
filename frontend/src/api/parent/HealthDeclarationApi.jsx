import React from "react";
import axiosInstance from "../axiosInstance";

export const StudentProfileDeclarationHistory = async (
  studentId
) => {
  try {
    const res = await axiosInstance.get(
      `/StudentProfile/${studentId}`
    );
    if (res.data && res.data.success) {
      return res.data.data;
    } else {
      throw new Error(res.data.message || "Failed to fetch data");
    }
  } catch (error) {
    throw error;
  }
};
