import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

function AuthCallback() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleGoogleCallback = async () => {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');

            if (code) {
                try {
                    const response = await axios.post('http://localhost:5182/api/auth/login-google', {
                        code: code,
                        redirectUri: 'http://localhost:3000/auth/google/callback'
                    });

                    const { success, data, message } = response.data;

                    if (!success || !data) {
                        throw new Error(message || 'Đăng nhập thất bại!');
                    }

                    await login(data.token, data.roleName, Number(data.userId));
                    navigate(`/${data.roleName.toLowerCase()}/dashboard`, { replace: true });
                    return;

                } catch (err) {
                    let errorMessage = 'Đăng nhập bằng Google thất bại!';
                    if (err.response) {
                        errorMessage = err.response.data?.message || 'Lỗi server!';
                    } else if (err.request) {
                        errorMessage = 'Không thể kết nối đến server';
                    } else {
                        errorMessage = err.message;
                    }
                    setError(errorMessage);
                }
            } else {
                setError('Không nhận được mã xác thực từ Google');
            }
        };

        handleGoogleCallback();
    }, [navigate, login]);

    if (error) {
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <div className="container">
                    <div className="alert alert-danger" role="alert">
                        <h4 className="alert-heading">Đăng nhập thất bại!</h4>
                        <p>{error}</p>
                    </div>
                    <div className="text-center mt-3">
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/login')}
                        >
                            Quay lại trang đăng nhập
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang xử lý...</span>
                </div>
                <p className="mt-2">Đang xử lý đăng nhập...</p>
            </div>
        </div>
    );
}

export default AuthCallback;