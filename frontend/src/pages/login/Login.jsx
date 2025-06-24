// Login.jsx - Đăng nhập cho người dùng
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';
import axios from 'axios';
import './Login.css';
// Import ảnh medical mới
import medicalImage from '../../assets/anhlogin.jpg';

// API Configuration từ biến môi trường
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5182/api';
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
            const response = await axios.get(`${API_BASE_URL}/auth/is-verified/${phoneNumber}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    // Gửi OTP
    const sendOTP = async (phoneNumber) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/send-otp`, { phoneNumber });
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    // Xác thực OTP
    const verifyOTP = async (phoneNumber, otpCode) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, { phoneNumber, otp: otpCode });
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    // Cập nhật mật khẩu
    const updatePassword = async (phoneNumber, newPassword) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/User/update-password`, { phoneNumber, password: newPassword });
            return response.data;
        } catch (error) {
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
            } else {
                setError('Mã OTP không chính xác!');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra! Vui lòng thử lại.');
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
            const response = await axios.post(`${API_BASE_URL}/auth/login`, { phoneNumber, password });
            const { success, data } = response.data;
            if (!success || !data?.token || !data?.roleName) {
                setError('Đăng nhập thất bại hoặc dữ liệu phản hồi không hợp lệ!');
                return;
            }
            const { token, userId, roleName } = data;
            await login(token, roleName, Number(userId), '');
            setSuccessMsg('Đăng nhập thành công! Đang chuyển hướng...');
            setTimeout(() => navigate(`/${roleName.toLowerCase()}`), 1000);
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.');
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
                                <label className="form-label">Phone Number</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    placeholder="Enter your phone number"
                                    value={phoneNumber}
                                    onChange={handlePhoneInput}
                                    required
                                    pattern="[0-9]*"
                                    inputMode="numeric"
                                />
                            </div>
                            <button type="submit" className="login-btn" disabled={loading}>
                                {loading ? 'Processing...' : 'Continue'}
                            </button>
                        </form>
                        <div className="divider-text">OR SIGN IN</div>
                        <button onClick={handleGoogleLogin} className="google-signin-btn">
                            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" />
                            Sign in with Google
                        </button>
                    </>
                );
            case 'otp':
                return (
                    <>
                        <div className="brand-header">
                            <h2>Hệ thống quản lý y tế học đường</h2>
                            <p>Nhập mã OTP</p>
                        </div>

                        <form onSubmit={handleOTPSubmit} autoComplete="off">
                            <div className="form-group">
                                <label className="form-label">OTP Code</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter OTP code"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="btn-group">
                                <button type="button" className="back-btn" onClick={handlebacktoLogin}>
                                    Back
                                </button>
                                <button type="submit" className="login-btn" disabled={loading}>
                                    {loading ? 'Verifying...' : 'Verify'}
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
                            <p>Tạo mật khẩu</p>
                        </div>

                        <form onSubmit={handlePasswordSetup} autoComplete="off">
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Confirm Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="btn-group">
                                <button type="button" className="back-btn" onClick={handlebacktoLogin}>
                                    Back
                                </button>
                                <button type="submit" className="login-btn" disabled={loading}>
                                    {loading ? 'Creating...' : 'Create Password'}
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
{/* 
                        <button onClick={handleGoogleLogin} className="google-signin-btn">
                            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" />
                            Sign in with Google
                        </button>

                        <div className="divider-text">OR SIGN IN</div> */}

                        <form onSubmit={handleLogin} autoComplete="off">
                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    value={phoneNumber}
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="btn-group">
                                <button type="button" className="back-btn" onClick={handlebacktoLogin}>
                                    Back
                                </button>
                                <button type="submit" className="login-btn" disabled={loading}>
                                    {loading ? 'Signing in...' : 'Login'}
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
