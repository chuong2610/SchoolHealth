// StudentHealthCheck.jsx - Lịch sử khám sức khỏe của học sinh
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import { Table, Card, Alert, Spin, Button, Badge, Space, Typography } from "antd";
import { FaEye, FaStethoscope, FaSyringe, FaPills, FaHeartbeat, FaUserMd } from "react-icons/fa";
import { Container, Row, Col } from 'react-bootstrap';
// Styles được import từ main.jsx

const { Title } = Typography;

const StudentHealthCheck = () => {
    // Lấy thông tin user từ context (để lấy parentId và thông tin học sinh)
    const { user } = useAuth();
    // State lưu dữ liệu lịch sử khám sức khỏe của học sinh
    const [data, setData] = useState([]);
    // State loading khi fetch dữ liệu
    const [loading, setLoading] = useState(true);
    // State lưu thông báo lỗi khi fetch dữ liệu
    const [error, setError] = useState("");

    // Lấy thông tin học sinh (giả lập hoặc lấy từ user context)
    const student = user?.children?.[0] || { name: "Emma Smith", class: "10A1", code: "HS001" };
    const parentId = user?.id; // Đảm bảo user context có id

    // useEffect: Tự động fetch dữ liệu khi parentId thay đổi
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!parentId) throw new Error('Không tìm thấy parentId');
                // Gửi request GET tới API lấy lịch sử khám sức khỏe của học sinh
                const res = await axiosInstance.get(`/api/HealthCheck/parent/${parentId}`);
                if (res.data.success) {
                    setData(res.data.data); // Lưu dữ liệu vào state
                } else {
                    setError("Không lấy được dữ liệu");
                }
            } catch (err) {
                setError("Failed to fetch health check data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [parentId]);

    // Cấu hình cột cho bảng lịch sử khám sức khỏe
    const columns = [
        { title: 'Ngày khám', dataIndex: 'date', key: 'date', render: v => v ? new Date(v).toLocaleDateString('vi-VN') : '' },
        { title: 'Chiều cao', dataIndex: 'height', key: 'height', render: v => v ? v + ' cm' : 'N/A' },
        { title: 'Cân nặng', dataIndex: 'weight', key: 'weight', render: v => v ? v + ' kg' : 'N/A' },
        { title: 'Thị lực', dataIndex: 'vision', key: 'vision', render: v => v || 'N/A' },
        { title: 'Kết luận', dataIndex: 'conclusion', key: 'conclusion', render: v => <Badge color={v?.toLowerCase().includes('bình thường') || v?.toLowerCase().includes('healthy') ? 'green' : 'gold'} text={v || 'N/A'} style={{ fontSize: 16, fontWeight: 500, borderRadius: 8 }} /> },
        { title: 'Bác sĩ', dataIndex: 'nurseName', key: 'nurseName', render: v => v ? `BS. ${v}` : '' },
        { title: 'Chi tiết', key: 'action', align: 'center', render: (_, record) => <Button icon={<FaEye size={22} />} style={{ borderRadius: 12, width: 44, height: 44 }} /> },
    ];

    return (
        <div className="parent-theme">
            <style>
                {`
                    .health-check-page {
                        background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%) !important;
                        min-height: 100vh !important;
                        padding: 2rem 0 !important;
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
                    }
                    
                    .health-check-header {
                        background: linear-gradient(135deg, #2563eb 0%, #38b6ff 100%) !important;
                        color: white !important;
                        padding: 3rem 0 !important;
                        margin-bottom: 3rem !important;
                        border-radius: 0 0 30px 30px !important;
                        position: relative !important;
                        overflow: hidden !important;
                    }
                    
                    .health-check-header::before {
                        content: '' !important;
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                        right: 0 !important;
                        bottom: 0 !important;
                        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="white" opacity="0.1"/><circle cx="80" cy="40" r="1.5" fill="white" opacity="0.08"/><circle cx="40" cy="80" r="2.5" fill="white" opacity="0.06"/></svg>') repeat !important;
                        pointer-events: none !important;
                    }
                    
                    .header-content {
                        position: relative !important;
                        z-index: 2 !important;
                        text-align: center !important;
                    }
                    
                    .page-title {
                        font-size: 2.5rem !important;
                        font-weight: 800 !important;
                        margin-bottom: 1rem !important;
                        text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2) !important;
                    }
                    
                    .page-subtitle {
                        font-size: 1.2rem !important;
                        opacity: 0.95 !important;
                        margin: 0 !important;
                        font-weight: 400 !important;
                    }
                    
                    .content-container {
                        margin: -2rem 1rem 0 1rem !important;
                        position: relative !important;
                        z-index: 10 !important;
                    }
                    
                    .content-card {
                        background: white !important;
                        border-radius: 25px !important;
                        box-shadow: 0 15px 50px rgba(37, 99, 235, 0.15) !important;
                        border: none !important;
                        overflow: hidden !important;
                        padding: 3rem 2rem !important;
                        text-align: center !important;
                    }
                    
                    .info-icon {
                        width: 120px !important;
                        height: 120px !important;
                        border-radius: 30px !important;
                        background: linear-gradient(135deg, #2563eb, #38b6ff) !important;
                        color: white !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        font-size: 3rem !important;
                        margin: 0 auto 2rem auto !important;
                    }
                    
                    .content-title {
                        font-size: 2rem !important;
                        font-weight: 700 !important;
                        color: #1f2937 !important;
                        margin-bottom: 1.5rem !important;
                    }
                    
                    .content-text {
                        font-size: 1.1rem !important;
                        color: #6b7280 !important;
                        line-height: 1.8 !important;
                        margin-bottom: 2rem !important;
                    }
                    
                    .features-list {
                        list-style: none !important;
                        padding: 0 !important;
                        margin: 2rem 0 !important;
                        text-align: left !important;
                        max-width: 600px !important;
                        margin-left: auto !important;
                        margin-right: auto !important;
                    }
                    
                    .features-list li {
                        padding: 1rem !important;
                        margin-bottom: 1rem !important;
                        background: linear-gradient(135deg, #f8f9fc 0%, #ffffff 100%) !important;
                        border-radius: 12px !important;
                        border: 2px solid #e5e7eb !important;
                        transition: all 0.3s ease !important;
                        display: flex !important;
                        align-items: center !important;
                        gap: 1rem !important;
                    }
                    
                    .features-list li:hover {
                        transform: translateY(-3px) !important;
                        box-shadow: 0 8px 25px rgba(37, 99, 235, 0.1) !important;
                        border-color: #3b82f6 !important;
                    }
                    
                    .feature-icon {
                        width: 40px !important;
                        height: 40px !important;
                        border-radius: 10px !important;
                        background: linear-gradient(135deg, #2563eb, #38b6ff) !important;
                        color: white !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        font-size: 1.2rem !important;
                        flex-shrink: 0 !important;
                    }
                    
                    .feature-text {
                        color: #374151 !important;
                        font-weight: 600 !important;
                        line-height: 1.6 !important;
                    }
                    
                    @media (max-width: 768px) {
                        .page-title {
                            font-size: 2rem !important;
                        }
                        
                        .page-subtitle {
                            font-size: 1rem !important;
                        }
                        
                        .content-container {
                            margin: -1rem 0.5rem 0 0.5rem !important;
                        }
                        
                        .content-card {
                            padding: 2rem 1.5rem !important;
                        }
                        
                        .info-icon {
                            width: 80px !important;
                            height: 80px !important;
                            font-size: 2rem !important;
                        }
                        
                        .content-title {
                            font-size: 1.5rem !important;
                        }
                    }
                `}
            </style>

            <div className="health-check-page">
                {/* Header */}
                <div className="health-check-header">
                    <Container>
                        <div className="header-content">
                            <h1 className="page-title">
                                Khám sức khỏe học sinh
                            </h1>
                            <p className="page-subtitle">
                                Chăm sóc và theo dõi sức khỏe toàn diện cho học sinh
                            </p>
                        </div>
                    </Container>
                </div>

                {/* Main Content */}
                <div className="content-container">
                    <Container>
                        <Card className="content-card">
                            <div className="info-icon">
                                <FaHeartbeat />
                            </div>

                            <h2 className="content-title">
                                Dịch vụ khám sức khỏe chuyên nghiệp
                            </h2>

                            <p className="content-text">
                                Hệ thống quản lý y tế học đường cung cấp dịch vụ khám sức khỏe định kỳ
                                và theo dõi tình trạng sức khỏe học sinh một cách toàn diện và chuyên nghiệp.
                            </p>

                            <ul className="features-list">
                                <li>
                                    <div className="feature-icon">
                                        <FaStethoscope />
                                    </div>
                                    <div className="feature-text">
                                        Khám sức khỏe định kỳ theo chương trình của Bộ Y tế
                                    </div>
                                </li>

                                <li>
                                    <div className="feature-icon">
                                        <FaUserMd />
                                    </div>
                                    <div className="feature-text">
                                        Đội ngũ y tá chuyên nghiệp với kinh nghiệm dày dặn
                                    </div>
                                </li>

                                <li>
                                    <div className="feature-icon">
                                        <FaHeartbeat />
                                    </div>
                                    <div className="feature-text">
                                        Theo dõi và cập nhật tình trạng sức khỏe liên tục
                                    </div>
                                </li>
                            </ul>

                            <p className="content-text">
                                Mọi thông tin về lịch khám và kết quả sẽ được thông báo kịp thời
                                đến phụ huynh qua hệ thống thông báo của chúng tôi.
                            </p>
                        </Card>
                    </Container>
                </div>
            </div>
        </div>
    );
};

export default StudentHealthCheck; 
