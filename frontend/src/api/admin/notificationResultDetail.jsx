import axiosInstance from "../axiosInstance"

export const getHealthCheckResultDeltail = async (healthCheckId) => {
    try{
        const res = await axiosInstance.get(`/HealthCheck/${healthCheckId}`);
        if(res.data.success) {
            console.log(res.data.message);
            return res.data.data;
        } else {
            console.log(res.data.message);
            return {};
        }
    }catch(error) {
        console.log("Loi getHealthCheckResultDeltail:", error);
        throw error;
    }
}

export const getVaccinationResultDeltail = async (vaccinationId) => {
    try{
        const res = await axiosInstance.get(`/Vaccination/${vaccinationId}`);
        if(res.data.success) {
            console.log(res.data.message);
            return res.data.data;
        } else {
            console.log(res.data.message);
            return {};
        }
    }catch(error) {
        console.log("Loi getVaccinationResultDeltail:", error);
        throw error;
    }
}