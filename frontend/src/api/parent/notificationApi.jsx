import axiosInstance from "../axiosInstance";

const parentId = "3";

export const getNotifications = async () => {
    try {
        const res = await axiosInstance.get(`/Notification/parent/${parentId}`);
        if(res.data.success === true) {
            console.log(res.data.message);
            return res.data.data;
        } else {
            console.log("Lay du lieu Notifications that bai");
            console.log(res.data.message);
            return [];
        }
    } catch(error) {
        console.log("Loi getNotification");
        throw error;
    }
}

export const getNotificationDetailById = async (data) => {
    try {
        const res = await axiosInstance.post("/Notification/notificationDeatil", data);
        if(res.data.success === true) {
            console.log(res.data.message);
            return res.data.data;
        } else {
            console.log("Gui du lieu that bai");
            console.log(res.data.message);
            return {};
        }
    } catch(error) {
        console.log("Loi getNotification");
        throw error;
    }
}