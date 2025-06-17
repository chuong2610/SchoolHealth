// Login.jsx - Đăng nhập cho người dùng
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'antd/dist/reset.css';
import { Form, Input, Button, Alert, Typography, Spin, Card } from 'antd';

import { useAuth } from '../../context/AuthContext';
import { auth, googleProvider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';
import loginBg from '../../assets/login-bg.png';
const { Title } = Typography;
import './Login.css';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Lấy giá trị từ form
        const email = e.target.email.value;
        const password = e.target.password.value;
        if (!email || !password) {
            setError('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5182/api/auth/login', {
                email: email.trim(),
                password: password.trim()
            });

            const { success, data } = response.data;

            if (!success || !data?.token || !data?.roleName) {
                setError('Đăng nhập thất bại hoặc dữ liệu phản hồi không hợp lệ!');
                return;
            }

            const { token, userId, roleName } = data;
            await login(token, roleName, Number(userId));

            // Chuyển hướng đến trang dashboard tương ứng với role
            navigate(`/${roleName.toLowerCase()}/dashboard`);

        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.');
        } finally {
            setLoading(false);
        }
    };

    // Thêm hàm đăng nhập bằng Google
    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const idToken = await user.getIdToken();
            // Gửi idToken về backend để xác thực và lấy token hệ thống
            const response = await axios.post('http://localhost:5182/api/auth/google-login', { idToken });
            const { success, data } = response.data;
            if (!success || !data?.token || !data?.roleName) {
                setError('Đăng nhập Google thất bại hoặc dữ liệu phản hồi không hợp lệ!');
                return;
            }
            // Nếu có context login, gọi login(token, roleName, userId) và chuyển hướng
            if (typeof login === 'function') {
                await login(data.token, data.roleName, Number(data.userId));
                navigate(`/${data.roleName.toLowerCase()}/dashboard`);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập Google thất bại!');
        } finally {
            setLoading(false);
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
                    <div className="fs-5" style={{ color: '#2563eb' }}>Đăng nhập hệ thống</div>
                </div>
                <div className="bg-white p-4 rounded-4 shadow-lg">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className="mb-3 position-relative">
                            <input
                                type="email"
                                name="email"
                                className="form-control form-control-lg ps-5"
                                placeholder="Nhập email"
                                autoComplete="email"
                                required
                            />
                            <span className="position-absolute top-50 translate-middle-y ms-3 text-secondary" style={{ left: 10 }}>
                                <i className="fas fa-envelope"></i>
                            </span>
                        </div>
                        <div className="mb-3 position-relative">
                            <input
                                type="password"
                                name="password"
                                className="form-control form-control-lg ps-5"
                                placeholder="Nhập mật khẩu"
                                autoComplete="current-password"
                                required
                            />
                            <span className="position-absolute top-50 translate-middle-y ms-3 text-secondary" style={{ left: 10 }}>
                                <i className="fas fa-lock"></i>
                            </span>
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg w-100 mb-3" disabled={loading}>
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                        <button type="button" className="btn btn-light btn-lg w-100 border d-flex align-items-center justify-content-center" style={{ fontWeight: 600 }} onClick={handleGoogleLogin} disabled={loading}>
                            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" style={{ width: 22, marginRight: 8 }} />
                            Đăng nhập với Google
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
