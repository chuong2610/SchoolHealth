// Login.jsx - Đăng nhập cho người dùng
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'antd/dist/reset.css';
import { Form, Input, Button, Alert, Typography, Spin, Card } from 'antd';
import html2pdf from 'html2pdf.js';
import { useAuth } from '../../context/AuthContext';
const { Title } = Typography;

const Login = () => {
    // State lưu thông tin nhập vào form đăng nhập
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    // State lưu thông báo lỗi
    const [error, setError] = useState('');
    // State loading khi submit
    const [loading, setLoading] = useState(false);
    // Hook điều hướng sau khi đăng nhập thành công
    const navigate = useNavigate();
    // Lấy hàm login từ context để lưu token, role, userId
    const { login } = useAuth();

    // Xử lý thay đổi input form đăng nhập
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý submit form đăng nhập
    const handleSubmit = async (values) => {
        const email = values.email.trim();
        const password = values.password.trim();
        if (!email || !password) {
            setError('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        setLoading(true);
        try {
            // Gửi request đăng nhập tới backend
            const response = await axios.post('http://localhost:5182/api/auth/login', { email, password });
            const { success, data } = response.data;
            if (!success || !data?.token || !data?.roleName) {
                setError('Đăng nhập thất bại hoặc dữ liệu phản hồi không hợp lệ!');
                setLoading(false);
                return;
            }
            // Sử dụng login từ AuthContext để lưu thông tin đăng nhập toàn cục
            const { token, userId, roleName } = data;
            if (!token || !roleName || typeof userId === 'undefined') {
                setError('Đăng nhập thất bại hoặc thiếu thông tin userId!');
                setLoading(false);
                return;
            }
            await login(token, roleName, Number(userId));
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại!');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        const element = document.getElementById('pdf-content');
        html2pdf().from(element).save('ket-qua.pdf');
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: `url('/src/assets/login-bg.png') center/cover no-repeat, #f5f7fa`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Card style={{ maxWidth: 400, width: '100%', borderRadius: 16, boxShadow: '0 4px 32px rgba(0,0,0,0.10)', background: 'rgba(255,255,255,0.95)' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Title level={2} style={{ marginBottom: 0 }}>
                        <i className="fas fa-heartbeat" style={{ color: '#1890ff', marginRight: 8 }}></i>
                        School Health
                    </Title>
                    <div style={{ color: '#888', fontSize: 18, marginTop: 8 }}>Đăng nhập hệ thống</div>
                </div>
                {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
                <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
                        <Input type="email" placeholder="Nhập email" size="large" />
                    </Form.Item>
                    <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                        <Input.Password placeholder="Nhập mật khẩu" size="large" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
