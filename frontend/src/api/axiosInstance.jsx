import axios from "axios";

// Tạo axios instance với base configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5182/api",
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
    console.error('❌ Token decode error:', error);
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
      console.warn('🕐 Token has expired');
      // Auto cleanup expired token
      clearAuthToken();
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Token validation error:', error);
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
      console.warn('🔒 Invalid token detected - clearing auth data');
      clearAuthToken();
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses và errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    // Log error for debugging
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: response?.status,
      message: response?.data?.message || error.message
    });

    // Handle different error scenarios
    if (response) {
      switch (response.status) {
        case 401:
          // Token expired hoặc invalid - Auto logout
          console.warn('🔒 Unauthorized - Clearing auth data');
          clearAuthToken();

          // Redirect to login if not already there
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;

        case 403:
          // Forbidden - User không có quyền
          console.warn('🚫 Forbidden - Access denied');
          break;

        case 404:
          // Not found
          console.warn('🔍 Not Found - Resource does not exist');
          break;

        case 500:
          // Server error
          console.error('🔥 Server Error - Internal server error');
          break;

        default:
          console.error(`🚨 HTTP Error ${response.status}:`, response.data?.message);
      }
    } else if (error.request) {
      // Network error - không nhận được response
      console.error('🌐 Network Error - No response received');
    } else {
      // Lỗi khác
      console.error('⚠️ Request Setup Error:', error.message);
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
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  delete axiosInstance.defaults.headers.common['Authorization'];
};

export default axiosInstance;
