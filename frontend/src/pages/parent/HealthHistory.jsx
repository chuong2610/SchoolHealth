import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import 'antd/dist/reset.css';
import { Table, Button, Modal, Spin, Alert, Badge, Typography, Row, Col, Space, Card } from 'antd';
import { Bar } from '@ant-design/charts';
import { FaEye } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import styled, { keyframes } from 'styled-components';
const { Title } = Typography;

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled components
const StyledContainer = styled.div`
  padding: 32px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
  animation: ${fadeIn} 0.5s ease-out;
`;

const StyledTitle = styled(Title)`
  text-align: center;
  margin-bottom: 40px !important;
  color: #1a365d !important;
  font-weight: 700 !important;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  animation: ${pulse} 2s infinite;
  
  &:hover {
    color: #1890ff !important;
    transition: color 0.3s ease;
  }
`;

const TabButton = styled(Button)`
  margin: 0 8px;
  padding: 12px 24px;
  height: auto;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-weight: 600;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  &.ant-btn-primary {
    background: linear-gradient(45deg, #1890ff, #096dd9, #1890ff);
    background-size: 200% 200%;
    animation: ${gradientAnimation} 3s ease infinite;
    border: none;
    
    &:hover {
      background: linear-gradient(45deg, #096dd9, #1890ff, #096dd9);
      background-size: 200% 200%;
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s;
  }
  
  &:hover::after {
    transform: translateX(100%);
  }
`;

const ContentCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  margin-top: 24px;
  background: white;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease-out;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }
  
  .ant-card-body {
    padding: 24px;
  }
`;

const StyledTable = styled(Table)`
  .ant-table {
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .ant-table-thead > tr > th {
    background: linear-gradient(45deg, #f0f5ff, #e6f7ff);
    color: #1a365d;
    font-weight: 600;
    transition: all 0.3s ease;
    
    &:hover {
      background: linear-gradient(45deg, #e6f7ff, #f0f5ff);
    }
  }
  
  .ant-table-tbody > tr {
    transition: all  0.3s ease;
    
    &:hover > td {
      background: #e6f7ff;
      transform: scale(1.01);
    }
  }
  
  .ant-pagination-item {
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
    }
  }
`;

const ChartContainer = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  margin-bottom: 24px;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease-out;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }
`;

const SearchInput = styled.input`
  padding: 12px 20px;
  border-radius: 12px;
  border: 2px solid #e6f7ff;
  width: 100%;
  max-width: 300px;
  transition: all 0.3s ease;
  background: white;
  
  &:focus {
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24,144,255,0.2);
    outline: none;
    transform: translateY(-2px);
  }
  
  &::placeholder {
    color: #bfbfbf;
    transition: all 0.3s ease;
  }
  
  &:focus::placeholder {
    opacity: 0.7;
    transform: translateX(10px);
  }
`;

const StatusBadge = styled(Badge)`
  .ant-badge-status-dot {
    box-shadow: 0 0 0 2px rgba(24,144,255,0.2);
  }
  
  .ant-badge-status-text {
    font-weight: 500;
  }
`;

const DetailButton = styled(Button)`
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
`;

const TABS = [
  { key: 'checkup', label: <><i className="fas fa-stethoscope me-2"></i>Khám sức khỏe</> },
  { key: 'vaccination', label: <><i className="fas fa-syringe me-2"></i>Tiêm chủng</> },
  { key: 'chart', label: <><i className="fas fa-chart-line me-2"></i>Theo dõi sức khỏe</> },
  { key: 'medication', label: <><i className="fas fa-pills me-2"></i>Lịch sử gửi thuốc</> },
];

const HealthHistory = () => {
  // State quản lý tab hiện tại (khám sức khỏe, tiêm chủng, theo dõi sức khỏe)
  const [activeTab, setActiveTab] = useState('checkup');
  // State lưu dữ liệu bảng hiện tại
  const [data, setData] = useState([]);
  // State loading và lỗi khi fetch dữ liệu
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Lấy user từ context để lấy parentId
  const { user } = useAuth();
  const parentId = user?.id ? Number(user.id) : undefined;

  // State cho modal chi tiết (dùng chung cho các tab)
  const [showModal, setShowModal] = useState(false);
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState('');

  // State cho hiển thị biểu đồ
  const [showChart, setShowChart] = useState(false);

  const [medicationHistory, setMedicationHistory] = useState([]);
  const [searchMedication, setSearchMedication] = useState("");

  // State cho modal chi tiết gửi thuốc
  const [showMedicationDetail, setShowMedicationDetail] = useState(false);
  const [medicationDetail, setMedicationDetail] = useState(null);
  const [loadingMedicationDetail, setLoadingMedicationDetail] = useState(false);

  // useEffect: Tự động fetch dữ liệu khi đổi tab hoặc parentId
  useEffect(() => {
    // Xác định URL API theo tab
    // Gửi request GET tới API, truyền token
    // Lưu dữ liệu vào state, xử lý lỗi nếu có
    if (!parentId) return;
    setLoading(true);
    setError('');
    let url = '';
    if (activeTab === 'checkup' || activeTab === 'chart') {
      url = `http://localhost:5182/api/HealthCheck/parent/${parentId}`;
    } else if (activeTab === 'vaccination') {
      url = `http://localhost:5182/api/Vaccination/parent/${parentId}`;
    } else if (activeTab === 'medication') {
      url = `http://localhost:5182/api/Medication/parent/${parentId}`;
    }
    if (!url) return;
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(url, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setData(response.data.data || []);
      } catch (err) {
        setError('Không thể tải dữ liệu!');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [parentId, activeTab]);

  useEffect(() => {
    if (activeTab === 'medication' && parentId) {
      const fetchMedicationHistory = async () => {
        try {
          const res = await fetch(`http://localhost:5182/api/Medication/parent/${parentId}`);
          const data = await res.json();
          setMedicationHistory(data.data || []);
        } catch (e) {
          setMedicationHistory([]);
        }
      };
      fetchMedicationHistory();
    }
  }, [activeTab, parentId]);

  // Hàm lấy chi tiết khám sức khỏe (dùng cho tab checkup, vaccination, medicine)
  // Khi bấm nút "Chi tiết" sẽ gọi hàm này để lấy dữ liệu chi tiết và mở modal
  const handleShowDetail = async (id, type = 'checkup') => {
    setShowModal(true);
    setLoadingDetail(true);
    setErrorDetail('');
    setDetail(null);
    let url = '';
    if (type === 'checkup') url = `http://localhost:5182/api/HealthCheck/${id}`;
    else if (type === 'vaccination') url = `http://localhost:5182/api/Vaccination/${id}`;
    else if (type === 'medicine') url = `http://localhost:5182/api/MedicineUsage/${id}`;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setDetail(res.data.data);
      } else {
        setErrorDetail('Không lấy được chi tiết');
      }
    } catch (err) {
      setErrorDetail('Lỗi khi lấy chi tiết');
    } finally {
      setLoadingDetail(false);
    }
  };

  // Hàm lấy chi tiết gửi thuốc
  const handleShowMedicationDetail = async (id) => {
    setShowMedicationDetail(true);
    setLoadingMedicationDetail(true);
    setMedicationDetail(null);
    try {
      const res = await fetch(`http://localhost:5182/api/Medication/${id}`);
      const data = await res.json();
      setMedicationDetail(data.data);
    } catch (e) {
      setMedicationDetail(null);
    } finally {
      setLoadingMedicationDetail(false);
    }
  };

  // Cột cho bảng checkup
  const columnsCheckup = [
    { title: 'Ngày khám', dataIndex: 'date', key: 'date', render: v => v ? new Date(v).toLocaleDateString('vi-VN') : '' },
    { title: 'Tên học sinh', dataIndex: 'studentName', key: 'studentName' },
    { title: 'Chiều cao', dataIndex: 'height', key: 'height', render: v => v ? v + ' cm' : 'N/A' },
    { title: 'Cân nặng', dataIndex: 'weight', key: 'weight', render: v => v ? v + ' kg' : 'N/A' },
    { title: 'BMI', dataIndex: 'bmi', key: 'bmi', render: v => v ?? 'N/A', align: 'center' },
    { title: 'Kết luận', dataIndex: 'conclusion', key: 'conclusion', align: 'center', render: v => <Badge color={v?.toLowerCase().includes('healthy') ? 'green' : 'gold'} text={v} /> },
    { title: 'Bác sĩ', dataIndex: 'nurseName', key: 'nurseName' },
    { title: 'Chi tiết', key: 'action', align: 'center', render: (_, record) => <Button icon={<FaEye size={22} />} style={{ borderRadius: 12, width: 44, height: 44 }} onClick={() => handleShowDetail(record.id, 'checkup')} /> },
  ];

  // Cột cho bảng vaccination
  const columnsVaccination = [
    { title: 'Ngày tiêm', dataIndex: 'date', key: 'date' },
    { title: 'Tên học sinh', dataIndex: 'studentName', key: 'studentName' },
    { title: 'Loại vắc-xin', dataIndex: 'vaccineName', key: 'vaccineName' },
    { title: 'Địa điểm', dataIndex: 'location', key: 'location' },
    { title: 'Bác sĩ', dataIndex: 'nurseName', key: 'nurseName' },
    { title: 'Chi tiết', key: 'action', align: 'center', render: (_, record) => <Button icon={<FaEye size={22} />} style={{ borderRadius: 12, width: 44, height: 44 }} onClick={() => handleShowDetail(record.id, 'vaccination')} /> },
  ];

  // Cột cho bảng chart (theo dõi chiều cao)
  const columnsChart = [
    { title: 'Tên học sinh', dataIndex: 'studentName', key: 'studentName' },
    { title: 'Ngày đo', dataIndex: 'date', key: 'date', render: v => v ? new Date(v).toLocaleDateString('vi-VN') : '' },
    { title: 'Chiều cao (cm)', dataIndex: 'height', key: 'height', align: 'center' },
  ];

  // Lọc tìm kiếm lịch sử gửi thuốc
  const filteredMedication = medicationHistory.filter((item) =>
    item.id.toString().toLowerCase().includes(searchMedication.toLowerCase()) ||
    (item.studentClassName || item.studentClass || "").toLowerCase().includes(searchMedication.toLowerCase()) ||
    (item.studentName || "").toLowerCase().includes(searchMedication.toLowerCase()) ||
    (item.status || "").toLowerCase().includes(searchMedication.toLowerCase()) ||
    (item.createdDate || "").toLowerCase().includes(searchMedication.toLowerCase()) ||
    (item.medications || []).some(med =>
      (med.medicationName || "").toLowerCase().includes(searchMedication.toLowerCase()) ||
      (med.dosage || "").toLowerCase().includes(searchMedication.toLowerCase()) ||
      (med.note || "").toLowerCase().includes(searchMedication.toLowerCase())
    )
  );

  return (
    <StyledContainer>
      <StyledTitle level={1}>Lịch sử sức khỏe</StyledTitle>

      <Space style={{ marginBottom: 32, justifyContent: 'center', width: '100%' }}>
        {TABS.map(tab => (
          <TabButton
            key={tab.key}
            type={activeTab === tab.key ? 'primary' : 'default'}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </TabButton>
        ))}
      </Space>

      <ContentCard>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Spin size="large" tip="Đang tải dữ liệu..." />
          </div>
        ) : error ? (
          <Alert type="error" message={error} showIcon style={{ margin: '24px 0' }} />
        ) : (
          <>
            {activeTab === 'checkup' && (
              <StyledTable
                columns={columnsCheckup}
                dataSource={data}
                rowKey="id"
                pagination={{ pageSize: 8 }}
                bordered
                locale={{ emptyText: 'Không có dữ liệu' }}
              />
            )}

            {activeTab === 'vaccination' && (
              <StyledTable
                columns={columnsVaccination}
                dataSource={data}
                rowKey="id"
                pagination={{ pageSize: 8 }}
                bordered
                locale={{ emptyText: 'Không có dữ liệu' }}
              />
            )}

            {activeTab === 'chart' && (
              <>
                <Button
                  type={showChart ? 'default' : 'primary'}
                  onClick={() => setShowChart(v => !v)}
                  style={{
                    marginBottom: 24,
                    borderRadius: 12,
                    padding: '8px 24px',
                    height: 'auto'
                  }}
                >
                  {showChart ? 'Ẩn biểu đồ' : 'Hiển thị biểu đồ'}
                </Button>

                {showChart && (
                  <ChartContainer>
                    <Bar
                      data={data}
                      xField="date"
                      yField="height"
                      seriesField="studentName"
                      colorField="studentName"
                      xAxis={{
                        title: { text: 'Ngày đo' }
                      }}
                      yAxis={{
                        title: { text: 'Chiều cao (cm)' }
                      }}
                      height={320}
                      legend={{ position: 'top' }}
                      barStyle={{
                        stroke: '#333',
                        lineWidth: 1,
                        radius: [4, 4, 0, 0]
                      }}
                    />
                  </ChartContainer>
                )}

                <StyledTable
                  columns={columnsChart}
                  dataSource={data}
                  rowKey="id"
                  pagination={{ pageSize: 8 }}
                  bordered
                  locale={{ emptyText: 'Không có dữ liệu' }}
                />
              </>
            )}

            {activeTab === 'medication' && (
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 24
                }}>
                  <h5 style={{ margin: 0, color: '#1a365d' }}>Lịch sử gửi thuốc</h5>
                  <SearchInput
                    placeholder="Tìm kiếm theo mã đơn, học sinh, thuốc, ghi chú..."
                    value={searchMedication}
                    onChange={e => setSearchMedication(e.target.value)}
                  />
                </div>

                <StyledTable

                  dataSource={filteredMedication}
                  rowKey="id"
                  pagination={{ pageSize: 4 }}
                  bordered
                  locale={{ emptyText: 'Không có dữ liệu' }}
                  columns={[
                    { title: 'Mã đơn', dataIndex: 'id' },
                    { title: 'Mã lớp', dataIndex: 'studentClassName', render: v => v || '-' },
                    { title: 'Học sinh', dataIndex: 'studentName' },
                    {
                      title: 'Danh sách thuốc',
                      dataIndex: 'medications',
                      render: medications => (
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                          {medications?.map((med, idx) => (
                            <li key={idx}>
                              <b>{med.medicationName}</b> - {med.dosage}
                              {med.note && <><br /><span style={{ color: '#666' }}>{med.note}</span></>}
                            </li>
                          ))}
                        </ul>
                      )
                    },
                    {
                      title: 'Ngày gửi',
                      dataIndex: 'createdDate',
                      render: v => v ? v.split("T")[0] : '-'
                    },
                    {
                      title: 'Trạng thái',
                      dataIndex: 'status',
                      render: status => (
                        <StatusBadge
                          status={status === "Active" ? "success" : status === "Pending" ? "processing" : "default"}
                          text={status === "Active" ? "Đang sử dụng" : status === "Pending" ? "Chờ xác nhận" : status}
                        />
                      )
                    },
                    {
                      title: 'Chi tiết',
                      key: 'action',
                      render: (_, record) => (
                        <DetailButton
                          
                          icon={<FaEye />}
                          onClick={() => handleShowMedicationDetail(record.id)}
                        />
                      )
                    }
                  ]}
                />
              </div>
            )}
          </>
        )}
      </ContentCard>

      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        title={activeTab === 'checkup' ? 'Chi tiết khám sức khỏe' : 'Chi tiết tiêm chủng'}
        footer={[
          <Button key="close" onClick={() => setShowModal(false)}>Đóng</Button>,
          <Button key="download" onClick={() => handleDownload(detail)} icon={<i className="fas fa-download" />}>Tải kết quả</Button>
        ]}
        width={600}
      >
        {loadingDetail ? (
          <Spin tip="Đang tải chi tiết..." />
        ) : errorDetail ? (
          <Alert type="error" message={errorDetail} showIcon />
        ) : detail ? (
          activeTab === 'checkup' ? (
            <Row gutter={30}>
              <Col span={40}>
                <div className="fw-bold mb-2">Thông tin chung</div>
                <div className="mb-2"><i className="fas fa-calendar-alt me-2"></i>Ngày khám: {detail.date ? new Date(detail.date).toLocaleDateString('vi-VN') : ''}</div>
                <div className="mb-2"><i className="fas fa-user-md me-2"></i>Bác sĩ: {detail.nurseName}</div>
                <div className="mb-2"><i className="fas fa-building me-2"></i>Địa điểm: {detail.location}</div>
              </Col>
              <Col span={20}>
                <div className="fw-bold mb-2">Kết quả khám</div>
                <div className="mb-2"><i className="fas fa-ruler-vertical me-2"></i>Chiều cao: {detail.height != null && detail.height !== '' ? detail.height + ' cm' : 'N/A'}</div>
                <div className="mb-2"><i className="fas fa-weight me-2"></i>Cân nặng: {detail.weight != null && detail.weight !== '' ? detail.weight + ' kg' : 'N/A'}</div>
                <div className="mb-2"><i className="fas fa-eye me-2"></i>Thị lực: {(detail.visionLeft != null && detail.visionRight != null)
                  ? `${detail.visionLeft}/${detail.visionRight}`
                  : (detail.visionLeft != null
                    ? `${detail.visionLeft}/-`
                    : (detail.visionRight != null
                      ? `-/${detail.visionRight}`
                      : 'N/A'))}</div>
                <div className="mb-2"><i className="fas fa-calculator me-2"></i>BMI: {detail.bmi != null && detail.bmi !== '' ? detail.bmi : 'N/A'}</div>
                <div className="mb-2"><i className="fas fa-tint me-2"></i>Huyết áp: {detail.bloodPressure ? detail.bloodPressure : 'N/A'}</div>
                <div className="mb-2"><i className="fas fa-heartbeat me-2"></i>Nhịp tim: {detail.heartRate ? detail.heartRate : 'N/A'}</div>
              </Col>
              <Col span={24}>
                <div className="mb-3">
                  <div className="fw-bold mb-1">Kết luận</div>
                  <div>{detail.conclusion}</div>
                </div>
                {detail.suggestions && Array.isArray(detail.suggestions) && detail.suggestions.length > 0 && (
                  <div className="mb-3">
                    <div className="fw-bold mb-1">Đề xuất</div>
                    <ul className="mb-0">
                      {detail.suggestions.map((s, idx) => <li key={idx}>{s}</li>)}
                    </ul>
                  </div>
                )}
                {detail.description && (
                  <div className="mb-2">
                    <b>Ghi chú:</b>
                    <div>{detail.description}</div>
                  </div>
                )}
              </Col>
            </Row>
          ) : (
            // Chi tiết tiêm chủng
            <Row gutter={16}>
              <Col span={12}>
                <div className="fw-bold mb-2">Thông tin chung</div>
                <div className="mb-2"><i className="fas fa-calendar-alt me-2"></i>Ngày tiêm: {detail.date ? new Date(detail.date).toLocaleDateString('vi-VN') : ''}</div>
                <div className="mb-2"><i className="fas fa-user me-2"></i>Học sinh: {detail.studentName}</div>
                <div className="mb-2"><i className="fas fa-building me-2"></i>Địa điểm: {detail.location}</div>
              </Col>
              <Col span={12}>
                <div className="fw-bold mb-2">Kết quả tiêm</div>
                <div className="mb-2"><i className="fas fa-syringe me-2"></i>Vắc-xin: {detail.vaccineName}</div>
                <div className="mb-2"><i className="fas fa-check-circle me-2"></i>Kết quả: {detail.result}</div>
                <div className="mb-2"><i className="fas fa-user-md me-2"></i>Y tá/Bác sĩ: {detail.nurseName}</div>
              </Col>
              <Col span={24}>
                {detail.description && (
                  <div className="mb-2">
                    <b>Ghi chú:</b>
                    <div>{detail.description}</div>
                  </div>
                )}
                {detail.status && (
                  <div className="mb-2">
                    <b>Trạng thái:</b> {detail.status}
                  </div>
                )}
                {detail.message && (
                  <div className="mb-2">
                    <b>Thông báo:</b> {detail.message}
                  </div>
                )}
              </Col>
            </Row>
          )
        ) : null}
      </Modal>
      <Modal
        open={showMedicationDetail}
        onCancel={() => setShowMedicationDetail(false)}
        title="Chi tiết gửi thuốc"
        footer={<Button onClick={() => setShowMedicationDetail(false)}>Đóng</Button>}
        width={600}
      >
        {loadingMedicationDetail ? (
          <Spin tip="Đang tải chi tiết..." />
        ) : medicationDetail ? (
          <>
            <div className="row mb-3">

              <div className="col-md-6" >
                <label className="form-label fw-bold">Mã lớp:</label>
                <p>{medicationDetail.studentClass || medicationDetail.studentClassName || ""}</p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Học sinh:</label>
                <p>{medicationDetail.studentName}</p>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Phụ huynh:</label>
                <p>{medicationDetail.parentName}</p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Y tá phụ trách:</label>
                <p>{medicationDetail.nurseName || "-"}</p>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Trạng thái:</label>
                <p>{medicationDetail.status === "Active" ? "Đang sử dụng" : medicationDetail.status === "Pending" ? "Chờ xác nhận" : medicationDetail.status}</p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Ngày gửi:</label>
                <p>{medicationDetail.createdDate ? medicationDetail.createdDate.split("T")[0] : ""}</p>
              </div>
              {medicationDetail.status === "Active" && (
                <div className="col-md-6">
                  <label className="form-label fw-bold">Ngày nhận:</label>
                  <p>{medicationDetail.receivedDate ? medicationDetail.receivedDate.split("T")[0] : medicationDetail.createdDate ? medicationDetail.createdDate.split("T")[0] : ""}</p>
                </div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold" >Danh sách thuốc:</label>
              <ul>
                {medicationDetail.medications && medicationDetail.medications.map((med, idx) => (
                  <li key={idx}>
                    <b>{med.medicationName}</b> - {med.dosage} <br />
                    <span className="text-muted">{med.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="text-danger">Không lấy được chi tiết gửi thuốc.</div>
        )}
      </Modal>
    </StyledContainer>
  );
};

export default HealthHistory;
