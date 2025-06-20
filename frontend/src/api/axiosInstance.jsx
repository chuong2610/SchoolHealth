import axios from "axios";

// Tạo axios instance với base configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5182/api",
  timeout: import.meta.env.VITE_API_TIMEOUT || 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Tự động thêm token mới nhất vào mọi request
axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy token mới nhất từ localStorage
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request for debugging (chỉ trong development)
    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.log('🚀 API Request:', {
        url: config.url,
        method: config.method?.toUpperCase(),
        headers: config.headers,
        data: config.data
      });
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
    // Log successful response for debugging
    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.log('✅ API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data
      });
    }

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
          console.warn('🔒 Unauthorized - Redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('userId');

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
  delete axiosInstance.defaults.headers.common['Authorization'];
};

// Helper function để check nếu có token
export const hasValidToken = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export default axiosInstance;
