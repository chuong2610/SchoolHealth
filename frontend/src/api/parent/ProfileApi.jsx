import React from "react";
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";

export const getParentInfo = async (parentId) => {
  try {
    const res = await axiosInstance.get(`/User/${parentId}`);
    if (res) {
      return res.data;
    } else {
    }
  } catch (error) {
  }
};

export const getChildrenInfo = async (parentId) => {
  try {
    const res = await axiosInstance.get(`/Students/by-parent/${parentId}`);
    if (res.data.success) {
      return res.data.data;
    } else {
    }
  } catch (error) {
  }
};

export const updateProfile = async (parentId, data) => {
  try {
    const res = await axiosInstance.patch(`/User/profile/${parentId}`, data);
    if (res.data.success) {
      return res.data;
    } else {
    }
  } catch (error) {
  }
};

export const uploadAvatar = async (file) => {

  if (!file) return null;
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

export const updatePassword = async (parentId, data) => {
  try {
    const res = await axiosInstance.patch(`/User/change-password/${parentId}`, data);
    if (res.data.success) {
      return res.data;
    } else if (res.data.success === false) {
      return res.data;
    }
  } catch (error) {
  }
};