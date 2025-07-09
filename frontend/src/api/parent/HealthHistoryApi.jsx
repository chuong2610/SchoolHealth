import React from 'react'
import axiosInstance from '../axiosInstance';

export const getHealthHistoryStatistics = async (parentId) => {
  try {
    const res = await axiosInstance.get(`/HealthDeclareHistory/${parentId}/counts`);
    if (res.data.success === true) {
      return res.data.data;
    } else {
      throw new Error(res.data.message);
    }
  } catch (error) {
    throw error;
  }
}
