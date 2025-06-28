import React from 'react'
import axiosInstance from '../axiosInstance';

export const getHealthHistoryStatistics = async (parentId) => {
  try {
    const res = await axiosInstance.get(`/HealthDeclareHistory/${parentId}/counts`);
    if( res.data.success === true ) {
        console.log("Health history statistics fetched successfully:", res.data.data);
      return res.data.data;
    }else {
      console.error("Failed to fetch health history statistics:", res.data.message);
      throw new Error(res.data.message);
    }
  } catch (error) {
    console.error("Error fetching health history statistics:", error);
    throw error;
  }
}
