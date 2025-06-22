import axiosInstance from "../axiosInstance"

export const getHealthCheckResultDeltail = async (healthCheckId) => {
    try {
        const res = await axiosInstance.get(`/HealthCheck/${healthCheckId}`);
        if (res.data.success) {
            return res.data.data;
        } else {
            return {};
        }
    } catch (error) {
        throw error;
    }
}

export const getVaccinationResultDeltail = async (vaccinationId) => {
    try {
        const res = await axiosInstance.get(`/Vaccination/${vaccinationId}`);
        if (res.data.success) {
            return res.data.data;
        } else {
            return {};
        }
    } catch (error) {
        throw error;
    }
}
