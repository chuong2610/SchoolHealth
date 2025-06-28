import React from "react";
import axiosInstance from "../axiosInstance";

export const getMedicineStatistics = async () => {
  try {
    const res = await axiosInstance.get(`/Medication/medication-count`);
    if (res.data.success === true) {
      console.log("getMedicineStatistics success", res.data.data);
      return res.data.data;
    } else {
      console.log("getMedicineStatistics failed", res.data.message);
    }
  } catch (error) {
    console.log("getMedicineStatistics error", error);
    throw error;
  }
};
