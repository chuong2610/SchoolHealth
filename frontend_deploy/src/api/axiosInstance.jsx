import axios from "axios";

// Tạo axios instance với base configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT || 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function để decode JWT token
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

// Helper function để check token có hợp lệ và chưa expired
export const hasValidToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded = decodeJWT(token);
    if (!decoded) return false;

    // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
    const currentTime = Date.now() / 1000;
    if (decoded.exp && decoded.exp < currentTime) {
      // Auto cleanup expired token
      clearAuthToken();
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

// Request interceptor - Tự động thêm token mới nhất vào mọi request
axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy token mới nhất từ localStorage
    const token = localStorage.getItem('token');

    if (token && hasValidToken()) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (token) {
      // Token exists but invalid - clear it
      clearAuthToken();
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses và errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response, config } = error;
    if (response) {
      if (response.status === 401) {
        // Đã xóa log debug 401
      }
    }
    return Promise.reject(error);
  }
);

// Helper function để set token manually (nếu cần)
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

// Helper function để clear token
export const clearAuthToken = () => {
  // Đã xóa log debug clearAuthToken
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  delete axiosInstance.defaults.headers.common['Authorization'];
};

export default axiosInstance;
