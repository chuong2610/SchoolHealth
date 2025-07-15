import React from 'react'
import axiosInstance from '../axiosInstance';

export const getNurseInfo = async (nurseId) => {
  try {
    const res = await axiosInstance.get(`/User/${nurseId}`);
    if (res) {
      return res.data;
    } else {
    }
  } catch (error) {
  }
}

export const updateProfile = async (nurseId, data) => {
  try {
    const res = await axiosInstance.patch(`/User/profile/${nurseId}`, data);
    if (res.data.success) {
      return res.data;
    } else {
    }
  } catch (error) {
  }
};

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post("/Upload/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (response.data.success === false) throw new Error("Upload ảnh thất bại!");

  return response.data.fileName; // hoặc data.filePath nếu backend yêu cầu
};

export const updatePassword = async (nurseId, data) => {
  try {
    const res = await axiosInstance.patch(`/User/change-password/${nurseId}`, data);
    if (res.data.success) {
      return res.data;
    } else {
      return res.data;
    }
  } catch (error) {
  }
};




