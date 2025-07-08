import React from 'react'
import axiosInstance from '../axiosInstance';

export const getMedicineInventoryStatistics = async () => {
  try {
    const res = await axiosInstance.get(`/MedicalSupply/medical-supplies-count`);
    if (res.data.success === true) {
      return res.data.data;
    } else {
    }
  } catch (error) {
    throw error;
  }
}
