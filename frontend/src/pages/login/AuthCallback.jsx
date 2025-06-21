import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';

// API Configuration từ biến môi trường
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback';

function AuthCallback() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleGoogleCallback = async () => {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');
            const error_param = params.get('error');

            // Kiểm tra nếu user từ chối authorization
            if (error_param) {
                console.warn('❌ Google OAuth error:', error_param);
                setError('Đăng nhập bằng Google bị hủy');
                setLoading(false);
                return;
            }

            if (!code) {
                console.error('❌ No authorization code received');
                setError('Không nhận được mã xác thực từ Google');
                setLoading(false);
                return;
            }

            try {
                const response = await axiosInstance.post('/auth/login-google', {
                    code: code,
                    redirectUri: GOOGLE_REDIRECT_URI
                });

                const { success, data, message } = response.data;

                if (!success || !data) {
                    throw new Error(message || 'Đăng nhập thất bại!');
                }

                // Đăng nhập với token nhận được
                await login(data.token, data.roleName, Number(data.userId), data.email || '');

                // Redirect đến dashboard của role tương ứng
                const targetPath = `/${data.roleName.toLowerCase()}`;
                navigate(targetPath, { replace: true });

            } catch (err) {
                console.error('❌ Google login failed:', err);

                let errorMessage = 'Đăng nhập bằng Google thất bại!';

                if (err.response) {
                    // Server responded with error status
                    errorMessage = err.response.data?.message || 'Lỗi server!';
                } else if (err.request) {
                    // Network error
                    errorMessage = 'Không thể kết nối đến server';
                } else {
                    // Other error
                    errorMessage = err.message;
                }

                setError(errorMessage);
                setLoading(false);
            }
        };

        handleGoogleCallback();
    }, [navigate, login]);

    // Tự động redirect về login sau 5 giây nếu có lỗi
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                navigate('/login', { replace: true });
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [error, navigate]);

    // Render loading hoặc error state
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                fontFamily: 'Arial, sans-serif'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #F06292',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '20px'
                }}></div>
                <h2 style={{ color: '#333', marginBottom: '10px' }}>Đang xử lý đăng nhập...</h2>
                <p style={{ color: '#666', textAlign: 'center' }}>Vui lòng chờ trong giây lát</p>

                <style>
                    {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
                </style>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                fontFamily: 'Arial, sans-serif',
                padding: '20px'
            }}>
                <div style={{
                    background: '#ffebee',
                    border: '1px solid #ffcdd2',
                    borderRadius: '8px',
                    padding: '20px',
                    maxWidth: '400px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '15px' }}>❌</div>
                    <h2 style={{ color: '#c62828', marginBottom: '15px' }}>Đăng nhập thất bại</h2>
                    <p style={{ color: '#666', marginBottom: '20px' }}>{error}</p>
                    <button
                        onClick={() => navigate('/login', { replace: true })}
                        style={{
                            background: '#F06292',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Quay lại đăng nhập
                    </button>
                    <p style={{ color: '#999', fontSize: '14px', marginTop: '15px' }}>
                        Tự động chuyển hướng sau 5 giây...
                    </p>
                </div>
            </div>
        );
    }

    return null;
}

export default AuthCallback;