import React from 'react'
import axiosInstance from '../axiosInstance';

export const getMedicineInventoryStatistics = async () => {
  try {
    const res = await axiosInstance.get(`/MedicalSupply/medical-supplies-count`);
    if(res.data.success === true) {
        return res.data.data;
    } else {
        console.log("error occured getMedicineInventoryStatistics", res.data.message);
    }
  } catch (error) {
    console.log("error occured getMedicineInventoryStatistics", error);
    throw error;
  }
}
