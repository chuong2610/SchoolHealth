// Login.jsx - Đăng nhập cho người dùng
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';
import './Login.css';
// Import ảnh medical mới
import medicalImage from '../../assets/LoginImage3.png';

// Google Configuration từ biến môi trường
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1059017246677-b4j4rqlgqvog2dnssqcn41ch8741npet.apps.googleusercontent.com';
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [step, setStep] = useState('phone'); // 'phone', 'otp', 'password-setup', 'login'
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    // Nếu đã đăng nhập thì tự động chuyển hướng về dashboard đúng role
    useEffect(() => {
        if (isAuthenticated()) {
            const role = localStorage.getItem('role');
            if (role) {
                navigate(`/${role}`, { replace: true });
            }
        }
    }, [isAuthenticated, navigate]);

    // Countdown timer cho resend OTP
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    // Kiểm tra số điện thoại đã verify chưa
    const checkPhoneVerification = async (phoneNumber) => {
        try {
            const response = await axiosInstance.get(`/auth/is-verified/${phoneNumber}`);
            return response.data;
        } catch (error) {
            console.error('❌ Check phone verification error:', error);
            throw error;
        }
    };

    // Gửi OTP
    const sendOTP = async (phoneNumber) => {
        try {
            const response = await axiosInstance.post('/auth/send-otp', { phoneNumber });
            return response.data;
        } catch (error) {
            console.error('❌ Send OTP error:', error);
            throw error;
        }
    };

    // Xác thực OTP
    const verifyOTP = async (phoneNumber, otpCode) => {
        try {
            const response = await axiosInstance.post('/auth/verify-otp', { phoneNumber, otp: otpCode });
            return response.data;
        } catch (error) {
            console.error('❌ Verify OTP error:', error);
            throw error;
        }
    };

    // Cập nhật mật khẩu
    const updatePassword = async (phoneNumber, newPassword) => {
        try {
            const response = await axiosInstance.post('/User/update-password', { phoneNumber, password: newPassword });
            return response.data;
        } catch (error) {
            console.error('❌ Update password error:', error);
            throw error;
        }
    };

    // Validation chỉ nhận số cho số điện thoại
    const handlePhoneInput = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setPhoneNumber(value);
    };

    // Xử lý submit số điện thoại
    const handlePhoneSubmit = async (e) => {
        e.preventDefault();
        if (!phoneNumber) {
            setError('Vui lòng nhập số điện thoại!');
            return;
        }
        setLoading(true);
        setError('');
        setSuccessMsg('');
        try {
            const verificationStatus = await checkPhoneVerification(phoneNumber);

            if (verificationStatus.success && verificationStatus.data) {
                // Nếu đã verify thì chuyển sang form đăng nhập
                setStep('login');
            } else {
                await sendOTP(phoneNumber);
                setStep('otp');
                setSuccessMsg('Mã OTP đã được gửi đến email của bạn!');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra! Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý submit OTP
    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        if (!otp) {
            setError('Vui lòng nhập mã OTP!');
            return;
        }
        setLoading(true);
        setError('');
        setSuccessMsg('');
        try {
            const verificationResult = await verifyOTP(phoneNumber, otp);
            if (verificationResult.success) {
                setStep('password-setup');
                setSuccessMsg('Xác thực OTP thành công!');
            } else {
                setError('Mã OTP không chính xác!');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Mã OTP không chính xác! Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý submit mật khẩu mới
    const handlePasswordSetup = async (e) => {
        e.preventDefault();
        if (!password || !confirmPassword) {
            setError('Vui lòng nhập đầy đủ mật khẩu!');
            return;
        }
        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            return;
        }
        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }
        setLoading(true);
        setError('');
        setSuccessMsg('');
        try {
            await updatePassword(phoneNumber, password);
            setStep('login');
            setPassword('');
            setConfirmPassword('');
            setSuccessMsg('Tạo mật khẩu thành công! Vui lòng đăng nhập.');
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra! Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý đăng nhập
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!password) {
            setError('Vui lòng nhập mật khẩu!');
            return;
        }
        setLoading(true);
        setError('');
        setSuccessMsg('');
        try {
            console.log('🔐 Attempting login for:', phoneNumber);
            const response = await axiosInstance.post('/auth/login', { phoneNumber, password });

            console.log('📨 Login response:', response.data);

            // Improved response validation
            const responseData = response.data;
            if (!responseData) {
                setError('Phản hồi từ server không hợp lệ!');
                return;
            }

            // Handle different response structures
            let authData;
            if (responseData.success && responseData.data) {
                // Structure: { success: true, data: { token, userId, roleName } }
                authData = responseData.data;
            } else if (responseData.token && responseData.userId && responseData.roleName) {
                // Direct structure: { token, userId, roleName }
                authData = responseData;
            } else {
                console.error('❌ Invalid response structure:', responseData);
                setError('Đăng nhập thất bại! Dữ liệu phản hồi không hợp lệ.');
                return;
            }

            const { token, userId, roleName } = authData;

            if (!token || !userId || !roleName) {
                console.error('❌ Missing auth data:', { token: !!token, userId: !!userId, roleName: !!roleName });
                setError('Đăng nhập thất bại! Thiếu thông tin xác thực.');
                return;
            }

            console.log('✅ Auth data validated:', { userId, roleName });

            await login(token, roleName, Number(userId), '');
            setSuccessMsg('Đăng nhập thành công! Đang chuyển hướng...');

            // Navigate after a short delay to show success message
            setTimeout(() => {
                navigate(`/${roleName.toLowerCase()}`, { replace: true });
            }, 1000);

        } catch (err) {
            console.error('❌ Login error:', err);
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                'Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handlebacktoLogin = () => {
        setStep('phone');
        setError('');
        setSuccessMsg('');
        setOtp('');
        setPassword('');
        setConfirmPassword('');
    };

    const handleGoogleLogin = () => {
        const scope = 'email profile';
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline`;

        window.location.href = googleAuthUrl;
    };

    const renderForm = () => {
        switch (step) {
            case 'phone':
                return (
                    <>
                        <div className="brand-header">
                            <h2>Hệ thống quản lý y tế học đường</h2>
                            <p>Đăng nhập</p>
                        </div>

                        <form onSubmit={handlePhoneSubmit} autoComplete="off">
                            <div className="form-group">
                                <label className="form-label">Số Điện Thoại</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    placeholder="Vui lòng nhập số điện thoại"
                                    value={phoneNumber}
                                    onChange={handlePhoneInput}
                                    required
                                    pattern="[0-9]*"
                                    inputMode="numeric"
                                />
                            </div>
                            <button type="submit" className="login-btn" disabled={loading}>
                                {loading ? 'Đang xử lý...' : 'Tiếp tục'}
                            </button>
                        </form>
                        <div className="divider-text">HOẶC ĐĂNG NHẬP VỚI</div>
                        <button onClick={handleGoogleLogin} className="google-signin-btn">
                            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" />
                            Đăng nhập với Google
                        </button>
                    </>
                );
            case 'otp':
                return (
                    <>
                        <div className="brand-header">
                            <h2>Hệ thống quản lý y tế học đường</h2>
                            <p>Nhập mã OTP đã được gửi đến email của bạn</p>
                        </div>

                        <form onSubmit={handleOTPSubmit} autoComplete="off">
                            <div className="form-group">
                                <label className="form-label">OTP Code</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Nhập mã OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="btn-group">
                                <button type="button" className="back-btn" onClick={handlebacktoLogin}>
                                    Quay lại
                                </button>
                                <button type="submit" className="login-btn" disabled={loading}>
                                    {loading ? 'Đang xác thực...' : 'Xác thực'}
                                </button>
                            </div>
                        </form>
                    </>
                );
            case 'password-setup':
                return (
                    <>
                        <div className="brand-header">
                            <h2>Hệ thống quản lý y tế học đường</h2>
                            <p>Tạo mật khẩu mới</p>
                        </div>

                        <form onSubmit={handlePasswordSetup} autoComplete="off">
                            <div className="form-group">
                                <label className="form-label">Mật Khẩu</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Nhập mật khẩu mới"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Xác Nhận Mật Khẩu</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Xác nhận mật khẩu"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="btn-group">
                                <button type="button" className="back-btn" onClick={handlebacktoLogin}>
                                    Quay lại
                                </button>
                                <button type="submit" className="login-btn" disabled={loading}>
                                    {loading ? 'Đang tạo...' : 'Tạo mật khẩu'}
                                </button>
                            </div>
                        </form>
                    </>
                );
            case 'login':
                return (
                    <>
                        <div className="brand-header">
                            <h2>Hệ thống quản lý y tế học đường</h2>
                            <p>Đăng nhập</p>
                        </div>

                        <form onSubmit={handleLogin} autoComplete="off">
                            <div className="form-group">
                                <label className="form-label">Số Điện Thoại</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    value={phoneNumber}
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Mật Khẩu</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Nhập mật khẩu"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="btn-group">
                                <button type="button" className="back-btn" onClick={handlebacktoLogin}>
                                    Quay lại
                                </button>
                                <button type="submit" className="login-btn" disabled={loading}>
                                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                                </button>
                            </div>
                        </form>
                    </>
                );
        }
    };

    return (
        <div className="template-login-container">
            {/* Left Side - Image */}
            <div
                className="template-left-side"
                style={{
                    backgroundImage: `url(${medicalImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="template-image-overlay"></div>
            </div>

            {/* Right Side - Login Form */}
            <div className="template-right-side">
                <div className="template-form-container">
                    {error && <div className="error-message">{error}</div>}
                    {successMsg && <div className="success-message">{successMsg}</div>}
                    {renderForm()}
                </div>
            </div>
        </div>
    );
};

export default Login;
