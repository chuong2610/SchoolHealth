<<<<<<< HEAD
import React, { useState } from "react";

const studentInfo = {
  class: "10A1",
  id: "HS001",
};

const checkupData = [
  {
    date: "15/03/2024",
    height: "170 cm",
    weight: "60 kg",
    vision: "10/10",
    result: "Bình thường",
    doctor: "BS. Nguyễn Văn A",
    detail: {
      bloodPressure: "120/80 mmHg",
      heartRate: "75 bpm",
      note: "Không phát hiện bất thường.",
      conclusion: "Sức khỏe tốt, không phát hiện bệnh lý.",
    },
  },
  {
    date: "15/09/2023",
    height: "168 cm",
    weight: "58 kg",
    vision: "10/10",
    result: "Bình thường",
    doctor: "BS. Trần Thị B",
    detail: {
      bloodPressure: "118/78 mmHg",
      heartRate: "76 bpm",
      note: "Sức khỏe tốt.",
      conclusion: "Không phát hiện bất thường.",
    },
  },
];

const vaccinationData = [
  {
    date: "20/03/2024",
    vaccine: "COVID-19",
    dose: "Mũi 4",
    place: "Phòng Y tế trường",
    doctor: "BS. Nguyễn Văn A",
    detail: {
      type: "Pfizer-BioNTech",
      time: "8:00 - 11:00",
      note: "Không có phản ứng phụ.",
      important: [
        "Học sinh cần ăn sáng đầy đủ trước khi tiêm",
        "Mang theo sổ khám bệnh và giấy tờ tùy thân",
        "Phụ huynh cần ký xác nhận đồng ý tiêm chủng",
        "Theo dõi sức khỏe sau tiêm 30 phút tại trường",
      ],
    },
  },
  {
    date: "15/09/2023",
    vaccine: "COVID-19",
    dose: "Mũi 3",
    place: "Phòng Y tế trường",
    doctor: "BS. Trần Thị B",
    detail: {
      type: "Pfizer-BioNTech",
      time: "8:00 - 11:00",
      note: "Không có phản ứng phụ.",
      important: [
        "Học sinh cần ăn sáng đầy đủ trước khi tiêm",
        "Mang theo sổ khám bệnh và giấy tờ tùy thân",
      ],
    },
  },
];

const medicineData = [
  {
    date: "18/03/2024",
    name: "Paracetamol",
    dosage: "1 viên",
    time: "8:00",
    nurse: "Y tá Nguyễn Thị C",
    detail: {
      reason: "Hạ sốt",
      note: "Uống sau ăn sáng.",
    },
  },
  {
    date: "17/03/2024",
    name: "Paracetamol",
    dosage: "1 viên",
    time: "13:00",
    nurse: "Y tá Nguyễn Thị C",
    detail: {
      reason: "Hạ sốt",
      note: "Uống sau ăn trưa.",
    },
  },
];

const tabList = [
  {
    key: "checkup",
    label: (
      <>
        <i className="fas fa-stethoscope me-2"></i>Khám sức khỏe
      </>
    ),
  },
  {
    key: "vaccination",
    label: (
      <>
        <i className="fas fa-syringe me-2"></i>Tiêm chủng
      </>
    ),
  },
  {
    key: "medicine",
    label: (
      <>
        <i className="fas fa-pills me-2"></i>Sử dụng thuốc
      </>
    ),
  },
  {
    key: "chart",
    label: (
      <>
        <i className="fas fa-chart-line me-2"></i>Theo dõi sức khỏe
      </>
    ),
  },
];

const HealthHistory = () => {
  const [activeTab, setActiveTab] = useState("checkup");
  const [modal, setModal] = useState({ show: false, type: null, data: null });

  // Chart data (demo)
  const chartData = {
    labels: ["09/2023", "03/2024"],
    height: [168, 170],
    weight: [58, 60],
  };

  return (
    <div
      style={{ background: "#f5f7fa", minHeight: "100vh", padding: "32px 0" }}
    >
      <div className="container" style={{ maxWidth: 1000 }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <h1 className="fw-bold mb-3 mb-md-0" style={{ fontSize: 40 }}>
            Lịch sử sức khỏe
          </h1>
          <div className="d-flex gap-2">
            <span
              className="badge bg-primary"
              style={{ fontSize: 18, padding: "10px 20px", borderRadius: 10 }}
            >
              Lớp: {studentInfo.class}
            </span>
            <span
              className="badge bg-info text-white"
              style={{ fontSize: 18, padding: "10px 20px", borderRadius: 10 }}
            >
              Mã học sinh: {studentInfo.id}
            </span>
          </div>
        </div>
        {/* Tabs */}
        <ul className="nav nav-pills mb-4 justify-content-start gap-2">
          {tabList.map((tab) => (
            <li className="nav-item" key={tab.key}>
              <button
                className={`nav-link${activeTab === tab.key ? " active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
                type="button"
                style={{ fontSize: 18, borderRadius: 16, padding: "8px 24px" }}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
        {/* Tab Content */}
        <div className="tab-content">
          {/* Khám sức khỏe */}
          {activeTab === "checkup" && (
            <div className="tab-pane fade show active">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Ngày khám</th>
                          <th>Chiều cao</th>
                          <th>Cân nặng</th>
                          <th>Thị lực</th>
                          <th>Kết luận</th>
                          <th>Bác sĩ</th>
                          <th className="text-center">Chi tiết</th>
                        </tr>
                      </thead>
                      <tbody>
                        {checkupData.map((row, idx) => (
                          <tr key={idx}>
                            <td>{row.date}</td>
                            <td>{row.height}</td>
                            <td>{row.weight}</td>
                            <td>{row.vision}</td>
                            <td>
                              <span
                                className="badge bg-success"
                                style={{ fontSize: 15 }}
                              >
                                {row.result}
                              </span>
                            </td>
                            <td>{row.doctor}</td>
                            <td className="text-center">
                              <button
                                className="btn btn-primary rounded-3"
                                style={{ width: 40, height: 40 }}
                                onClick={() =>
                                  setModal({
                                    show: true,
                                    type: "checkup",
                                    data: row,
                                  })
                                }
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Tiêm chủng */}
          {activeTab === "vaccination" && (
            <div className="tab-pane fade show active">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Ngày tiêm</th>
                          <th>Loại vắc-xin</th>
                          <th>Mũi số</th>
                          <th>Địa điểm</th>
                          <th>Bác sĩ</th>
                          <th className="text-center">Chi tiết</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vaccinationData.map((row, idx) => (
                          <tr key={idx}>
                            <td>{row.date}</td>
                            <td>{row.vaccine}</td>
                            <td>{row.dose}</td>
                            <td>{row.place}</td>
                            <td>{row.doctor}</td>
                            <td className="text-center">
                              <button
                                className="btn btn-primary rounded-3"
                                style={{ width: 40, height: 40 }}
                                onClick={() =>
                                  setModal({
                                    show: true,
                                    type: "vaccination",
                                    data: row,
                                  })
                                }
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Sử dụng thuốc */}
          {activeTab === "medicine" && (
            <div className="tab-pane fade show active">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Ngày sử dụng</th>
                          <th>Tên thuốc</th>
                          <th>Liều dùng</th>
                          <th>Thời gian</th>
                          <th>Người cho thuốc</th>
                          <th className="text-center">Chi tiết</th>
                        </tr>
                      </thead>
                      <tbody>
                        {medicineData.map((row, idx) => (
                          <tr key={idx}>
                            <td>{row.date}</td>
                            <td>{row.name}</td>
                            <td>{row.dosage}</td>
                            <td>{row.time}</td>
                            <td>{row.nurse}</td>
                            <td className="text-center">
                              <button
                                className="btn btn-primary rounded-3"
                                style={{ width: 40, height: 40 }}
                                onClick={() =>
                                  setModal({
                                    show: true,
                                    type: "medicine",
                                    data: row,
                                  })
                                }
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Theo dõi sức khỏe */}
          {activeTab === "chart" && (
            <div className="tab-pane fade show active">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <h5 className="mb-4">
                    Biểu đồ theo dõi chiều cao & cân nặng
                  </h5>
                  <div className="row">
                    <div className="col-md-6">
                      <h6>Chiều cao (cm)</h6>
                      <ul className="list-group mb-3">
                        {chartData.labels.map((label, idx) => (
                          <li
                            className="list-group-item d-flex justify-content-between align-items-center"
                            key={label}
                          >
                            {label}
                            <span className="fw-bold">
                              {chartData.height[idx]}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <h6>Cân nặng (kg)</h6>
                      <ul className="list-group mb-3">
                        {chartData.labels.map((label, idx) => (
                          <li
                            className="list-group-item d-flex justify-content-between align-items-center"
                            key={label}
                          >
                            {label}
                            <span className="fw-bold">
                              {chartData.weight[idx]}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {/* Có thể tích hợp thêm biểu đồ Chart.js ở đây nếu muốn */}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal chi tiết */}
        {modal.show && (
          <div
            className="modal fade show"
            style={{ display: "block", background: "rgba(0,0,0,0.3)" }}
            tabIndex={-1}
          >
            <div className="modal-dialog" style={{ maxWidth: 700 }}>
              <div
                className="modal-content rounded-4"
                style={{ fontSize: 18, padding: 0 }}
              >
                <div
                  className="modal-header align-items-start"
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                    padding: "24px 32px 16px 32px",
                  }}
                >
                  <div>
                    <h2 className="fw-bold mb-0" style={{ fontSize: 28 }}>
                      {modal.type === "checkup" && "Chi tiết khám sức khỏe"}
                      {modal.type === "vaccination" && "Chi tiết tiêm chủng"}
                      {modal.type === "medicine" && "Chi tiết sử dụng thuốc"}
                    </h2>
                  </div>
                  <button
                    type="button"
                    className="btn p-0 ms-auto"
                    style={{ fontSize: 28, lineHeight: 1, color: "#888" }}
                    onClick={() =>
                      setModal({ show: false, type: null, data: null })
                    }
                    aria-label="Đóng"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="modal-body" style={{ padding: "24px 32px" }}>
                  {/* Khám sức khỏe */}
                  {modal.type === "checkup" && (
                    <>
                      <div className="row mb-4">
                        <div className="col-md-6 mb-3 mb-md-0">
                          <div
                            className="fw-bold mb-2"
                            style={{ fontSize: 20 }}
                          >
                            Thông tin chung
                          </div>
                          <div className="mb-2">
                            <i className="fas fa-calendar-alt me-2 text-secondary"></i>
                            Ngày khám: {modal.data.date}
                          </div>
                          <div className="mb-2">
                            <i className="fas fa-user-md me-2 text-secondary"></i>
                            Bác sĩ: {modal.data.doctor}
                          </div>
                          <div className="mb-2">
                            <i className="fas fa-hospital me-2 text-secondary"></i>
                            Địa điểm: Phòng Y tế trường
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div
                            className="fw-bold mb-2"
                            style={{ fontSize: 20 }}
                          >
                            Kết quả khám
                          </div>
                          <div className="mb-2">
                            <i className="fas fa-ruler-vertical me-2 text-secondary"></i>
                            Chiều cao: {modal.data.height}
                          </div>
                          <div className="mb-2">
                            <i className="fas fa-weight me-2 text-secondary"></i>
                            Cân nặng: {modal.data.weight}
                          </div>
                          <div className="mb-2">
                            <i className="fas fa-eye me-2 text-secondary"></i>
                            Thị lực: {modal.data.vision}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="fw-bold mb-1" style={{ fontSize: 20 }}>
                          Kết luận
                        </div>
                        <div>
                          Sức khỏe bình thường, phát triển tốt. Khuyến nghị duy
                          trì chế độ ăn uống và tập luyện hiện tại.
                        </div>
                      </div>
                      <div className="mb-0">
                        <div className="fw-bold mb-1" style={{ fontSize: 20 }}>
                          Đề xuất
                        </div>
                        <ul className="mb-0 ps-3">
                          <li>Tăng cường vận động thể dục thể thao</li>
                          <li>Bổ sung canxi và vitamin D</li>
                          <li>Khám lại sau 6 tháng</li>
                        </ul>
                      </div>
                    </>
                  )}
                  {/* Tiêm chủng */}
                  {modal.type === "vaccination" && (
                    <>
                      <div className="row mb-4">
                        <div className="col-md-6 mb-3 mb-md-0">
                          <div
                            className="fw-bold mb-2"
                            style={{ fontSize: 20 }}
                          >
                            Thông tin chung
                          </div>
                          <div className="mb-2">
                            <i className="fas fa-calendar-alt me-2 text-secondary"></i>
                            Ngày tiêm: {modal.data.date}
                          </div>
                          <div className="mb-2">
                            <i className="fas fa-user-md me-2 text-secondary"></i>
                            Bác sĩ: {modal.data.doctor}
                          </div>
                          <div className="mb-2">
                            <i className="fas fa-hospital me-2 text-secondary"></i>
                            Địa điểm: {modal.data.place}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div
                            className="fw-bold mb-2"
                            style={{ fontSize: 20 }}
                          >
                            Chi tiết tiêm
                          </div>
                          <div className="mb-2">
                            <i className="fas fa-syringe me-2 text-secondary"></i>
                            Loại vắc-xin: {modal.data.detail.type}
                          </div>
                          <div className="mb-2">
                            <i className="fas fa-clock me-2 text-secondary"></i>
                            Thời gian: {modal.data.detail.time}
                          </div>
                          <div className="mb-2">
                            <i className="fas fa-info-circle me-2 text-secondary"></i>
                            Ghi chú: {modal.data.detail.note}
                          </div>
                        </div>
                      </div>
                      <div className="mb-0">
                        <div className="fw-bold mb-1" style={{ fontSize: 20 }}>
                          Lưu ý quan trọng
                        </div>
                        <ul className="mb-0 ps-3">
                          {modal.data.detail.important &&
                            modal.data.detail.important.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                        </ul>
                      </div>
                    </>
                  )}
                  {/* Sử dụng thuốc */}
                  {modal.type === "medicine" && (
                    <>
                      <div className="row mb-4">
                        <div className="col-md-6 mb-3 mb-md-0">
                          <div
                            className="fw-bold mb-2"
                            style={{ fontSize: 20 }}
                          >
                            Thông tin chung
                          </div>
                          <div className="mb-2">
                            <i className="fas fa-calendar-alt me-2 text-secondary"></i>
                            Ngày sử dụng: {modal.data.date}
                          </div>
                          <div className="mb-2">
                            <i className="fas fa-user-nurse me-2 text-secondary"></i>
                            Người cho thuốc: {modal.data.nurse}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div
                            className="fw-bold mb-2"
                            style={{ fontSize: 20 }}
                          >
                            Chi tiết thuốc
                          </div>
                          <div className="mb-2">
                            <i className="fas fa-pills me-2 text-secondary"></i>
                            Tên thuốc: {modal.data.name}
                          </div>
                          <div className="mb-2">
                            <i className="fas fa-capsules me-2 text-secondary"></i>
                            Liều dùng: {modal.data.dosage}
                          </div>
                          <div className="mb-2">
                            <i className="fas fa-clock me-2 text-secondary"></i>
                            Thời gian: {modal.data.time}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="fw-bold mb-1" style={{ fontSize: 20 }}>
                          Lý do sử dụng
                        </div>
                        <div>{modal.data.detail.reason}</div>
                      </div>
                      <div className="mb-0">
                        <div className="fw-bold mb-1" style={{ fontSize: 20 }}>
                          Ghi chú
                        </div>
                        <div>{modal.data.detail.note}</div>
                      </div>
                    </>
                  )}
                </div>
                <div
                  className="modal-footer justify-content-end"
                  style={{ borderTop: "none", padding: "16px 32px 32px 32px" }}
                >
                  <button
                    type="button"
                    className="btn btn-primary px-4 me-2"
                    style={{ fontSize: 18, borderRadius: 8 }}
                    onClick={() =>
                      setModal({ show: false, type: null, data: null })
                    }
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary px-4"
                    style={{ fontSize: 18, borderRadius: 8 }}
                  >
                    <i className="fas fa-download me-2"></i>Tải kết quả
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
=======
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import 'antd/dist/reset.css';
import { Table, Button, Modal, Spin, Alert, Badge, Typography, Row, Col, Space } from 'antd';
import { Bar } from '@ant-design/charts';
import { FaEye } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
const { Title } = Typography;

const TABS = [
  { key: 'checkup', label: <><i className="fas fa-stethoscope me-2"></i>Khám sức khỏe</> },
  { key: 'vaccination', label: <><i className="fas fa-syringe me-2"></i>Tiêm chủng</> },
  { key: 'chart', label: <><i className="fas fa-chart-line me-2"></i>Theo dõi sức khỏe</> },
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

  // Hàm xuất PDF kết quả chi tiết
  const handleDownload = () => {
    if (!detail) return;
    const doc = new jsPDF();
    if (activeTab === 'checkup') {
      doc.setFontSize(18);
      doc.text('KẾT QUẢ KHÁM SỨC KHỎE', 20, 20);
      doc.setFontSize(12);
      doc.text(`Ngày khám: ${detail.date ? new Date(detail.date).toLocaleDateString('vi-VN') : ''}`, 20, 35);
      doc.text(`Học sinh: ${detail.studentName || ''}`, 20, 45);
      doc.text(`Bác sĩ: ${detail.nurseName || ''}`, 20, 55);
      doc.text(`Địa điểm: ${detail.location || ''}`, 20, 65);
      doc.text(`Chiều cao: ${detail.height != null ? detail.height + ' cm' : 'N/A'}`, 20, 75);
      doc.text(`Cân nặng: ${detail.weight != null ? detail.weight + ' kg' : 'N/A'}`, 20, 85);
      doc.text(`Thị lực: ${detail.visionLeft != null && detail.visionRight != null ? detail.visionLeft + '/' + detail.visionRight : 'N/A'}`, 20, 95);
      doc.text(`BMI: ${detail.bmi != null ? detail.bmi : 'N/A'}`, 20, 105);
      doc.text(`Huyết áp: ${detail.bloodPressure || 'N/A'}`, 20, 115);
      doc.text(`Nhịp tim: ${detail.heartRate || 'N/A'}`, 20, 125);
      doc.text('Kết luận:', 20, 135);
      doc.text(detail.conclusion || '', 35, 145);
      if (detail.suggestions && Array.isArray(detail.suggestions) && detail.suggestions.length > 0) {
        doc.text('Đề xuất:', 20, 155);
        detail.suggestions.forEach((s, idx) => {
          doc.text(`- ${s}`, 35, 165 + idx * 10);
        });
      }
      if (detail.description) {
        doc.text('Ghi chú:', 20, 185);
        doc.text(detail.description, 35, 195);
      }
    } else if (activeTab === 'vaccination') {
      doc.setFontSize(18);
      doc.text('KẾT QUẢ TIÊM CHỦNG', 20, 20);
      doc.setFontSize(12);
      doc.text(`Ngày tiêm: ${detail.date ? new Date(detail.date).toLocaleDateString('vi-VN') : ''}`, 20, 35);
      doc.text(`Học sinh: ${detail.studentName || ''}`, 20, 45);
      doc.text(`Vắc-xin: ${detail.vaccineName || ''}`, 20, 55);
      doc.text(`Kết quả: ${detail.result || ''}`, 20, 65);
      doc.text(`Y tá/Bác sĩ: ${detail.nurseName || ''}`, 20, 75);
      doc.text(`Địa điểm: ${detail.location || ''}`, 20, 85);
      if (detail.description) {
        doc.text('Ghi chú:', 20, 95);
        doc.text(detail.description, 35, 105);
      }
      if (detail.status) {
        doc.text(`Trạng thái: ${detail.status}`, 20, 115);
      }
      if (detail.message) {
        doc.text('Thông báo:', 20, 125);
        doc.text(detail.message, 35, 135);
      }
    }
    doc.save(`${activeTab === 'checkup' ? 'kham-suc-khoe' : 'tiem-chung'}-${detail.studentName || ''}.pdf`);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={1} style={{ textAlign: 'center', marginBottom: 32 }}>Lịch sử sức khỏe</Title>
      <Space style={{ marginBottom: 24 }}>
        {TABS.map(tab => (
          <Button
            key={tab.key}
            type={activeTab === tab.key ? 'primary' : 'default'}
            onClick={() => setActiveTab(tab.key)}
            style={{ fontWeight: 600 }}
          >
            {tab.label}
          </Button>
        ))}
      </Space>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {loading ? (
          <Spin tip="Đang tải dữ liệu..." style={{ width: '100%', margin: '48px 0' }} />
        ) : error ? (
          <Alert type="error" message={error} showIcon style={{ margin: '48px 0' }} />
        ) : (
          <>
            {activeTab === 'checkup' && (
              <Table
                columns={columnsCheckup}
                dataSource={data}
                rowKey="id"
                pagination={{ pageSize: 8 }}
                bordered
                locale={{ emptyText: 'Không có dữ liệu' }}
              />
            )}
            {activeTab === 'vaccination' && (
              <Table
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
                <Button type={showChart ? 'default' : 'primary'} onClick={() => setShowChart(v => !v)} style={{ marginBottom: 16 }}>
                  {showChart ? 'Ẩn biểu đồ' : 'Hiển thị biểu đồ'}
                </Button>
                {showChart && (
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
                    barStyle={{ stroke: '#333', lineWidth: 1 }}
                    style={{ background: '#f5f7fa', borderRadius: 12, padding: 16 }}
                  />
                )}
                <Table
                  columns={columnsChart}
                  dataSource={data}
                  rowKey="id"
                  pagination={{ pageSize: 8 }}
                  bordered
                  locale={{ emptyText: 'Không có dữ liệu' }}
                />
              </>
            )}
          </>
        )}
      </div>
      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        title={activeTab === 'checkup' ? 'Chi tiết khám sức khỏe' : 'Chi tiết tiêm chủng'}
        footer={[
          <Button key="close" onClick={() => setShowModal(false)}>Đóng</Button>,
          <Button key="download" onClick={handleDownload} icon={<i className="fas fa-download" />}>Tải kết quả</Button>
        ]}
        width={600}
      >
        {loadingDetail ? (
          <Spin tip="Đang tải chi tiết..." />
        ) : errorDetail ? (
          <Alert type="error" message={errorDetail} showIcon />
        ) : detail ? (
          activeTab === 'checkup' ? (
            <Row gutter={16}>
              <Col span={12}>
                <div className="fw-bold mb-2">Thông tin chung</div>
                <div className="mb-2"><i className="fas fa-calendar-alt me-2"></i>Ngày khám: {detail.date ? new Date(detail.date).toLocaleDateString('vi-VN') : ''}</div>
                <div className="mb-2"><i className="fas fa-user-md me-2"></i>Bác sĩ: {detail.nurseName}</div>
                <div className="mb-2"><i className="fas fa-building me-2"></i>Địa điểm: {detail.location}</div>
              </Col>
              <Col span={12}>
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
>>>>>>> LoginHistory
    </div>
  );
};

export default HealthHistory;
