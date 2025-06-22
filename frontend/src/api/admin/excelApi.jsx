import axiosInstance from "../axiosInstance";

export const importExcelFile = async (id, file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axiosInstance.post(
      `/Excel/import-result/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.data.success === true) {
      //   return res.data.data;
    } else {
      //   return [];
    }
  } catch (error) {
    throw error;
  }
};

export const exportExcelFile = async (id) => {
  try {
    const res = await axiosInstance.get(`Excel/export-form-result/${id}`, {
      responseType: "blob", // Nhan ve file nhi phan
    });

    // Tao url tam cho blob
    const url = window.URL.createObjectURL(new Blob([res.data]));

    // Tao the link de nhan download
    const link = document.createElement("a");
    link.href = url;
    link.download = "FormDefault.xlsx"; // Dat ten file mac dinh
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    throw error;
  }
};
