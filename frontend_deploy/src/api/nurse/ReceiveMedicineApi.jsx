import React from "react";
import axiosInstance from "../axiosInstance";

export const getMedicineStatistics = async () => {
  try {
    const res = await axiosInstance.get(`/Medication/medication-count`);
    if (res.data.success === true) {
      return res.data.data;
    } else {
    }
  } catch (error) {
    throw error;
  }
};
