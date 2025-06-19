// Login.jsx - Đăng nhập cho người dùng
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'antd/dist/reset.css';
import { Form, Input, Button, Alert, Typography, Spin } from 'antd';
import { useAuth } from '../../context/AuthContext';
import loginBg from '../../assets/login-bg.png';
const { Title } = Typography;
import './Login.css';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState('phone'); // 'phone', 'otp', 'password-setup', 'login'
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const { login, user } = useAuth();

    // Nếu đã đăng nhập thì tự động chuyển hướng về dashboard đúng role
    useEffect(() => {
        if (user && user.role) {
            navigate(`/${user.role}/dashboard`, { replace: true });
        }
    }, [user, navigate]);

    // Kiểm tra số điện thoại đã verify chưa
    const checkPhoneVerification = async (phoneNumber) => {
        try {
            const response = await axios.get(`http://localhost:5182/api/auth/is-verified/${phoneNumber}`);
            return response.data;
        } catch (error) {
            console.error('Error checking phone verification:', error);
            throw error;
        }
    };

    // Gửi OTP
    const sendOTP = async (phoneNumber) => {
        try {
            const response = await axios.post('http://localhost:5182/api/auth/send-otp', {
                phoneNumber: phoneNumber
            });
            return response.data;
        } catch (error) {
            console.error('Error sending OTP:', error);
            throw error;
        }
    };

    // Xác thực OTP
    const verifyOTP = async (phoneNumber, otpCode) => {
        try {
            const response = await axios.post('http://localhost:5182/api/auth/verify-otp', {
                phoneNumber: phoneNumber,
                otp: otpCode
            });
            return response.data;
        } catch (error) {
            console.error('Error verifying OTP:', error);
            throw error;
        }
    };

    // Cập nhật mật khẩu
    const updatePassword = async (phoneNumber, newPassword) => {
        try {
            const response = await axios.post('http://localhost:5182/api/User/update-password', {
                phoneNumber: phoneNumber,
                password: newPassword
            });
            return response.data;
        } catch (error) {
            console.error('Error updating password:', error);
            throw error;
        }
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

        try {
            const verificationStatus = await checkPhoneVerification(phoneNumber);

            if (verificationStatus.success) {
                // Nếu đã verify thì chuyển sang form đăng nhập
                setStep('login');
            } else {
                // Nếu chưa verify thì gửi OTP
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

        try {
            await updatePassword(phoneNumber, password);
            setStep('login');
            setPassword(''); // Reset password field for login
            setConfirmPassword('');
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

        try {
            const response = await axios.post('http://localhost:5182/api/auth/login', {
                phoneNumber: phoneNumber,
                password: password
            });

            const { success, data } = response.data;

            if (!success || !data?.token || !data?.roleName) {
                setError('Đăng nhập thất bại hoặc dữ liệu phản hồi không hợp lệ!');
                return;
            }

            const { token, userId, roleName } = data;
            await login(token, roleName, Number(userId));
            navigate(`/${roleName.toLowerCase()}/dashboard`);

        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.');
        } finally {
            setLoading(false);
        }
    };
    const handlebacktoLogin = () => {
        setStep('phone');
        setError('');
        setOtp('');
        setPassword('');
        setConfirmPassword('');
    };
    const handleGoogleLogin = () => {
        const clientId = '1059017246677-b4j4rqlgqvog2dnssqcn41ch8741npet.apps.googleusercontent.com';
        const redirectUri = 'http://localhost:3000/auth/google/callback';
        const scope = 'email profile';

        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline`;

        window.location.href = googleAuthUrl;
    };

    const renderForm = () => {
        switch (step) {
            case 'phone':
                return (
                    <>
                        <form onSubmit={handlePhoneSubmit} autoComplete="off">
                            <div className="mb-3 position-relative">
                                <input
                                    type="tel"
                                    className="form-control form-control-lg ps-5"
                                    placeholder="Nhập số điện thoại"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    required
                                />
                                <span className="position-absolute top-50 translate-middle-y ms-3 text-secondary" style={{ left: 10 }}>
                                    <i className="fas fa-phone"></i>
                                </span>
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg w-100 text-center" style={{ marginTop: '5px' }} disabled={loading}>
                                {loading ? 'Đang xử lý...' : 'Tiếp tục'}
                            </button>
                        </form>
                        <div className="text-center mt-3">
                            <div className="text-muted mb-3">Hoặc đăng nhập bằng</div>
                            <button
                                onClick={handleGoogleLogin}
                                className="btn btn-outline-primary btn-lg d-flex align-items-center justify-content-center gap-2 w-100"
                            >
                                <i className="fab fa-google"></i>
                                Đăng nhập bằng Google
                            </button>
                        </div>
                    </>
                );

            case 'otp':
                return (
                    <form onSubmit={handleOTPSubmit} autoComplete="off">
                        <div className="mb-3 position-relative">
                            <input
                                type="text"
                                className="form-control form-control-lg ps-5"
                                placeholder="Nhập mã OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                            <span className="position-absolute top-50 translate-middle-y ms-3 text-secondary" style={{ left: 10 }}>
                                <i className="fas fa-key"></i>
                            </span>
                        </div>
                        <div className="d-flex justify-content-between gap-2">
                            <button type="button" className="btn btn-secondary btn-lg flex-grow-1" onClick={handlebacktoLogin}>
                                Quay lại
                            </button>
                            <button type="submit" className="btn btn-primary btn-lg flex-grow-1" disabled={loading}>
                                {loading ? 'Đang xác thực...' : 'Xác thực OTP'}
                            </button>
                        </div>
                    </form>
                );

            case 'password-setup':
                return (
                    <form onSubmit={handlePasswordSetup} autoComplete="off">
                        <div className="mb-3 position-relative">
                            <input
                                type="password"
                                className="form-control form-control-lg ps-5"
                                placeholder="Nhập mật khẩu mới"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span className="position-absolute top-50 translate-middle-y ms-3 text-secondary" style={{ left: 10 }}>
                                <i className="fas fa-lock"></i>
                            </span>
                        </div>
                        <div className="mb-3 position-relative">
                            <input
                                type="password"
                                className="form-control form-control-lg ps-5"
                                placeholder="Xác nhận mật khẩu mới"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <span className="position-absolute top-50 translate-middle-y ms-3 text-secondary" style={{ left: 10 }}>
                                <i className="fas fa-lock"></i>
                            </span>
                        </div>
                        <div className="d-flex justify-content-between gap-2">
                            <button type="button" className="btn btn-secondary btn-lg flex-grow-1" onClick={handlebacktoLogin}>
                                Quay lại
                            </button>
                            <button type="submit" className="btn btn-primary btn-lg flex-grow-1" disabled={loading}>
                                {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                            </button>
                        </div>
                    </form>
                );

            case 'login':
                return (
                    <form onSubmit={handleLogin} autoComplete="off" >
                        <div className="mb-3 position-relative">
                            <input
                                type="tel"
                                className="form-control form-control-lg ps-5"
                                value={phoneNumber}
                                disabled
                            />
                            <span className="position-absolute top-50 translate-middle-y ms-3 text-secondary" style={{ left: 10 }}>
                                <i className="fas fa-phone"></i>
                            </span>
                        </div>
                        <div className="mb-3 position-relative">
                            <input
                                type="password"
                                className="form-control form-control-lg ps-5"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span className="position-absolute top-50 translate-middle-y ms-3 text-secondary" style={{ left: 10 }}>
                                <i className="fas fa-lock"></i>
                            </span>
                        </div>
                        <div className="d-flex justify-content-between gap-2">
                            <button type="button" className="btn btn-secondary btn-lg flex-grow-1" onClick={handlebacktoLogin}>
                                Quay lại
                            </button>
                            <button type="submit" className="btn btn-primary btn-lg flex-grow-1" disabled={loading}>
                                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </button>
                        </div>
                    </form>
                );
        }
    };

    return (
        <div
            className="login-bg d-flex align-items-center justify-content-center"
            style={{
                background: `url(${loginBg}) center/cover no-repeat`,
                minHeight: '100vh',
                width: '100vw',
            }}
        >
            <div className="container" style={{ maxWidth: 620, maxHeight: 800, zIndex: 2 }}>
                <div className="text-center mb-3">
                    <i className="fas fa-heartbeat" style={{ color: '#2563eb', fontSize: 40 }}></i>
                    <div className="fw-bold fs-2" style={{ color: '#2563eb' }}>School Health</div>
                    <div className="fs-5" style={{ color: '#2563eb' }}>
                        {step === 'phone' && 'Đăng nhập với số điện thoại'}
                        {step === 'otp' && 'Xác thực OTP'}
                        {step === 'password-setup' && 'Tạo mật khẩu mới'}
                        {step === 'login' && 'Đăng nhập'}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-4 shadow-lg">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {renderForm()}
                </div>
            </div>
        </div>
    );
};

export default Login;
