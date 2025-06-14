import axiosInstance from "../axiosInstance";


export const getNotificationDetail = async (notificationId) => {
    try {
        const res = await axiosInstance.get(`/Notification/admin/${notificationId}`);
        if(res.data.success === true) {
            console.log(res.data.message);
            return res.data.data;
        } else {
            console.log(res.data.message);
            return {};
        }
    }catch(error) {
        console.log("Lỗi getNotificationDetail:", error);
        throw error;
    }
}