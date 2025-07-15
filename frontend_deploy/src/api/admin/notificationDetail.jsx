import axiosInstance from "../axiosInstance";


export const getNotificationDetail = async (notificationId) => {
    try {
        const res = await axiosInstance.get(`/Notification/admin/${notificationId}`);
        if (res.data.success === true) {
            return res.data.data;
        } else {
            return {};
        }
    } catch (error) {
        throw error;
    }
}
