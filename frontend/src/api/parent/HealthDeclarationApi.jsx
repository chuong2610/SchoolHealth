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
      console.log(
        "Student profile declaration history fetched successfully:",
        res.data.data
      );
      return res.data.data;
    } else {
      console.error(
        "Failed to fetch student profile declaration history:",
        res.data.message
      );
      throw new Error(res.data.message || "Failed to fetch data");
    }
  } catch (error) {
    console.error("Error fetching student profile declaration history:", error);
    throw error;
  }
};
