// StudentHealthCheck.jsx - Lịch sử khám sức khỏe của học sinh
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import { Table, Card, Alert, Spin, Button, Badge, Space, Typography } from "antd";
import { FaEye, FaStethoscope, FaSyringe, FaPills, FaHeartbeat, FaUserMd } from "react-icons/fa";
import { Container, Row, Col } from 'react-bootstrap';

const { Title } = Typography;

const StudentHealthCheck = () => {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const parentId = user?.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!parentId) throw new Error('Không tìm thấy parentId');
                const res = await axiosInstance.get(`/api/HealthCheck/parent/${parentId}`);
                if (res.data.success) {
                    setData(res.data.data);
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

    const columns = [
        { title: 'Ngày khám', dataIndex: 'date', key: 'date', render: v => v ? new Date(v).toLocaleDateString('vi-VN') : '' },
        { title: 'Chiều cao', dataIndex: 'height', key: 'height', render: v => v ? v + ' cm' : 'N/A' },
        { title: 'Cân nặng', dataIndex: 'weight', key: 'weight', render: v => v ? v + ' kg' : 'N/A' },
        { title: 'Thị lực', dataIndex: 'vision', key: 'vision', render: v => v || 'N/A' },
        { title: 'Kết luận', dataIndex: 'conclusion', key: 'conclusion', render: v => <Badge color={v?.toLowerCase().includes('bình thường') || v?.toLowerCase().includes('healthy') ? 'green' : 'gold'} text={v || 'N/A'} /> },
        { title: 'Bác sĩ', dataIndex: 'nurseName', key: 'nurseName', render: v => v ? `BS. ${v}` : '' },
        { title: 'Chi tiết', key: 'action', align: 'center', render: (_, record) => <Button icon={<FaEye size={22} />} /> },
    ];

    return (
        <div>
            <div>
                <Container>
                    <div>
                        <h1>
                            Khám sức khỏe học sinh
                        </h1>
                        <p>
                            Chăm sóc và theo dõi sức khỏe toàn diện cho học sinh
                        </p>
                    </div>
                </Container>
            </div>

            <div>
                <Container>
                    <Card>
                        <div>
                            <FaHeartbeat />
                        </div>

                        <h2>
                            Dịch vụ khám sức khỏe chuyên nghiệp
                        </h2>

                        <p>
                            Hệ thống quản lý y tế học đường cung cấp dịch vụ khám sức khỏe định kỳ
                            và theo dõi tình trạng sức khỏe học sinh một cách toàn diện và chuyên nghiệp.
                        </p>

                        <ul>
                            <li>
                                <div>
                                    <FaStethoscope />
                                </div>
                                <div>
                                    Khám sức khỏe định kỳ theo chương trình của Bộ Y tế
                                </div>
                            </li>

                            <li>
                                <div>
                                    <FaUserMd />
                                </div>
                                <div>
                                    Đội ngũ y tá chuyên nghiệp với kinh nghiệm dày dặn
                                </div>
                            </li>

                            <li>
                                <div>
                                    <FaHeartbeat />
                                </div>
                                <div>
                                    Theo dõi và cập nhật tình trạng sức khỏe liên tục
                                </div>
                            </li>
                        </ul>

                        <p>
                            Mọi thông tin về lịch khám và kết quả sẽ được thông báo kịp thời
                            đến phụ huynh qua hệ thống thông báo của chúng tôi.
                        </p>
                    </Card>
                </Container>
            </div>
        </div>
    );
};

export default StudentHealthCheck; 
