import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';
import './AuthCallback.css';

// API Configuration từ biến môi trường
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback';

function AuthCallback() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

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
                // Simulate progress
                setProgress(20);

                const response = await axiosInstance.post('/auth/login-google', {
                    code: code,
                    redirectUri: GOOGLE_REDIRECT_URI
                });

                setProgress(60);

                const { success, data, message } = response.data;

                if (!success || !data) {
                    throw new Error(message || 'Đăng nhập thất bại!');
                }

                setProgress(80);

                // Đăng nhập với token nhận được
                await login(data.token, data.roleName, Number(data.userId), data.email || '');

                setProgress(100);

                // Small delay for smooth UX
                setTimeout(() => {
                    // Redirect đến dashboard của role tương ứng
                    const targetPath = `/${data.roleName.toLowerCase()}`;
                    navigate(targetPath, { replace: true });
                }, 800);

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

    // Progress simulation
    useEffect(() => {
        if (loading && progress < 100) {
            const timer = setTimeout(() => {
                setProgress(prev => Math.min(prev + Math.random() * 10, 95));
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [loading, progress]);

    // Tự động redirect về login sau 5 giây nếu có lỗi
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                navigate('/login', { replace: true });
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [error, navigate]);

    // Render loading state
    if (loading) {
        return (
            <div className="auth-callback-container">
                {/* Background Elements */}
                <div className="auth-background">
                    <div className="gradient-orb orb-1"></div>
                    <div className="gradient-orb orb-2"></div>
                    <div className="gradient-orb orb-3"></div>
                    <div className="floating-particles">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className={`particle particle-${i + 1}`}></div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="auth-content">
                    {/* Logo/Icon */}
                    <div className="auth-icon">
                        <div className="medical-cross">
                            <div className="cross-horizontal"></div>
                            <div className="cross-vertical"></div>
                        </div>
                    </div>

                    {/* Loading Animation */}
                    <div className="loading-container">
                        <div className="spinner-ring">
                            <div className="spinner-sector"></div>
                            <div className="spinner-sector"></div>
                            <div className="spinner-sector"></div>
                            <div className="spinner-sector"></div>
                        </div>
                        <div className="pulse-ring"></div>
                    </div>

                    {/* Text Content */}
                    <div className="auth-text">
                        <h1 className="auth-title">
                            <span className="text-line">Đang xử lý đăng nhập</span>
                            <span className="typing-dots">
                                <span>.</span>
                                <span>.</span>
                                <span>.</span>
                            </span>
                        </h1>
                        <p className="auth-subtitle">Vui lòng chờ trong giây lát</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="progress-container">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${progress}%` }}
                            ></div>
                            <div className="progress-glow"></div>
                        </div>
                        <div className="progress-text">{Math.round(progress)}%</div>
                    </div>

                    {/* Status Messages */}
                    <div className="status-messages">
                        {progress < 30 && <span className="status-item">🔐 Xác thực với Google...</span>}
                        {progress >= 30 && progress < 70 && <span className="status-item">📝 Xử lý thông tin...</span>}
                        {progress >= 70 && progress < 100 && <span className="status-item">✨ Hoàn tất đăng nhập...</span>}
                        {progress === 100 && <span className="status-item success">✅ Đăng nhập thành công!</span>}
                    </div>
                </div>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="auth-callback-container error-state">
                {/* Background Elements */}
                <div className="auth-background">
                    <div className="gradient-orb orb-1 error-orb"></div>
                    <div className="gradient-orb orb-2 error-orb"></div>
                    <div className="gradient-orb orb-3 error-orb"></div>
                </div>

                {/* Error Content */}
                <div className="auth-content">
                    <div className="error-container">
                        <div className="error-icon">
                            <div className="error-symbol">
                                <div className="error-line line-1"></div>
                                <div className="error-line line-2"></div>
                            </div>
                        </div>

                        <div className="error-content">
                            <h1 className="error-title">Đăng nhập thất bại</h1>
                            <p className="error-message">{error}</p>

                            <button
                                onClick={() => navigate('/login', { replace: true })}
                                className="retry-button"
                            >
                                <span className="button-text">Quay lại đăng nhập</span>
                                <div className="button-ripple"></div>
                            </button>

                            <p className="auto-redirect">
                                Tự động chuyển hướng sau <span className="countdown">5</span> giây...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

export default AuthCallback;