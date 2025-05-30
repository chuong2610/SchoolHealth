import axiosInstance from "../axiosInstance";


export const getNotifications = async () => {
    try {
        const res = await axiosInstance.get("/products");
        console.log("Get data success");
        return res.data;
    } catch(error) {
        console.log("Loi getNotification");
        throw error;
    }
}