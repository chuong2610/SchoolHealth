// StudentHealthCheck.jsx - Lịch sử khám sức khỏe của học sinh
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import 'antd/dist/reset.css';
import { Table, Card, Alert, Spin, Button, Badge, Space, Typography } from "antd";
import { FaEye, FaStethoscope, FaSyringe, FaPills, FaHeartbeat } from "react-icons/fa";
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
                const token = localStorage.getItem('token');
                if (!parentId) throw new Error('Không tìm thấy parentId');
                // Gửi request GET tới API lấy lịch sử khám sức khỏe của học sinh
                const res = await axios.get(`http://localhost:5182/api/HealthCheck/parent/${parentId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setData(res.data.data); // Lưu dữ liệu vào state
                } else {
                    setError("Không lấy được dữ liệu");
                }
            } catch (err) {
                setError("Lỗi khi lấy dữ liệu");
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

    // Giao diện: tiêu đề, các nút tab, badge thông tin học sinh, bảng dữ liệu
    return (
        <div style={{ padding: 24 }}>
            {/* Tiêu đề, các nút tab, badge lớp/mã học sinh, bảng dữ liệu, loading/lỗi */}
            <Title level={1} style={{ textAlign: 'center', marginBottom: 32 }}>Lịch sử sức khỏe</Title>
            <Space style={{ marginBottom: 24 }}>
                <Button type="primary" icon={<FaStethoscope />} style={{ fontWeight: 600 }}>Khám sức khỏe</Button>
                <Button type="default" icon={<FaSyringe />} style={{ fontWeight: 600 }}>Tiêm chủng</Button>
                <Button type="default" icon={<FaPills />} style={{ fontWeight: 600 }}>Sử dụng thuốc</Button>
                <Button type="default" icon={<FaHeartbeat />} style={{ fontWeight: 600 }}>Theo dõi sức khỏe</Button>
            </Space>
            <Space style={{ marginBottom: 16 }}>
                <Badge color="blue" text={`Lớp: ${student.class}`} style={{ fontSize: 16, borderRadius: 8 }} />
                <Badge color="cyan" text={`Mã học sinh: ${student.code}`} style={{ fontSize: 16, borderRadius: 8 }} />
            </Space>
            <Card style={{ borderRadius: 20, maxWidth: 900, margin: '0 auto' }}>
                {loading ? (
                    <Spin tip="Đang tải dữ liệu..." style={{ width: '100%', margin: '48px 0' }} />
                ) : error ? (
                    <Alert type="error" message={error} showIcon style={{ margin: '48px 0' }} />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={data}
                        rowKey="id"
                        pagination={{ pageSize: 8 }}
                        bordered
                        locale={{ emptyText: 'Không có dữ liệu khám sức khỏe cho học sinh của bạn.' }}
                    />
                )}
            </Card>
        </div>
    );
};

export default StudentHealthCheck; 