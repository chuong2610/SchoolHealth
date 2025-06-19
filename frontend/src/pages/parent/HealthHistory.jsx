import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "antd/dist/reset.css";
import {
  Table,
  Button,
  Modal,
  Spin,
  Alert,
  Badge,
  Typography,
  Row,
  Col,
  Space,
  Card,
  Skeleton,
  Tooltip,
} from "antd";
import { Bar } from "@ant-design/charts";
import {
  FaEye,
  FaUser,
  FaRulerVertical,
  FaWeight,
  FaCalendarAlt,
  FaUserMd,
  FaSyringe,
  FaBuilding,
  FaCheckCircle,
  FaExclamationCircle,
  FaPills,
  FaHeartbeat,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import styled, { keyframes } from "styled-components";
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
  background: .parent-bg-img;
  min-height: 100vh;
  animation: ${fadeIn} 0.5s ease-out;
`;

const StyledTitle = styled(Title)`
  text-align: center;
  margin-bottom: 40px !important;
  color: #1a365d !important;
  font-weight: 700 !important;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  animation: ${pulse} 2s infinite;

  &:hover {
    color: #1890ff !important;
    transition: color 0.3s ease;
  }
`;

const TabButton = styled.button`
  margin: 0 8px;
  padding: 12px 24px;
  height: auto;
  border-radius: 12px;
  font-weight: 600;
  position: relative;
  overflow: hidden;
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(90deg, #3498DB 60%, #5DADE2 100%)"
      : "transparent"};
  color: ${({ $active }) => ($active ? "#fff" : "#3498DB")};
  border: ${({ $active }) => ($active ? "none" : "2px solid #5DADE2")};
  box-shadow: ${({ $active }) =>
    $active ? "0 4px 16px rgba(52,152,219,0.12)" : "none"};
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  z-index: ${({ $active }) => ($active ? 2 : 1)};
  &:hover {
    background: linear-gradient(90deg, #5dade2 0%, #3498db 100%);
    color: #fff;
    box-shadow: 0 6px 24px rgba(52, 152, 219, 0.18);
    transform: scale(1.09);
  }
`;

const ContentCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-top: 24px;
  background: white;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease-out;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
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
    transition: all 0.3s ease;

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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease-out;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
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
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
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
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
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
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const FadeInDiv = styled.div`
  animation: ${fadeIn} 0.7s ease;
`;

const DetailBox = styled.div`
  background: linear-gradient(120deg, #e6f7ff 60%, #f0f5ff 100%);
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(56, 182, 255, 0.1);
  border: 2px solid #38b6ff22;
  padding: 28px 32px 18px 32px;
  margin-bottom: 18px;
  animation: ${fadeIn} 0.6s;
`;

const DetailLabel = styled.div`
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 6px;
  font-size: 1.08rem;
`;

const DetailValue = styled.div`
  font-size: 1.08rem;
  color: #1a365d;
  margin-bottom: 10px;
`;

const DetailBadge = styled.span`
  display: inline-block;
  background: linear-gradient(90deg, #38b6ff 60%, #2563eb 100%);
  color: #fff;
  border-radius: 8px;
  padding: 2px 12px;
  font-size: 1rem;
  font-weight: 600;
  margin-left: 8px;
`;

const VaccinationTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 12px;
  margin-top: 16px;
`;
const VaccinationThead = styled.thead`
  background: #f0f5ff;
`;
const VaccinationTh = styled.th`
  padding: 12px 8px;
  font-weight: 700;
  color: #2563eb;
  font-size: 1.05rem;
  text-align: left;
`;
const VaccinationTr = styled.tr`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(56, 182, 255, 0.08);
  transition: box-shadow 0.2s, transform 0.2s;
  &:hover {
    box-shadow: 0 8px 24px rgba(56, 182, 255, 0.15);
    transform: scale(1.01);
  }
`;
const VaccinationTd = styled.td`
  padding: 14px 8px;
  font-size: 1rem;
  color: #2d3436;
  vertical-align: middle;
`;
const VaccinationActionButton = styled.button`
  background: linear-gradient(90deg, #2980b9 60%, #38b6ff 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 8px 18px;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
  box-shadow: 0 2px 8px rgba(56, 182, 255, 0.1);
  &:hover {
    background: linear-gradient(90deg, #38b6ff 0%, #2980b9 100%);
    box-shadow: 0 6px 24px rgba(56, 182, 255, 0.18);
    transform: scale(1.05);
  }
`;
const VaccinationPagination = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
`;
const VaccinationPageBtn = styled.button`
  background: #f0f5ff;
  color: #2563eb;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover,
  &[aria-current="true"] {
    background: linear-gradient(90deg, #2980b9 60%, #38b6ff 100%);
    color: #fff;
  }
`;
const VaccinationStatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  border-radius: 12px;
  padding: 4px 16px;
  font-size: 1rem;
  background: #e8f8f5;
  color: #27ae60;
`;

const CheckupTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 12px;
  margin-top: 16px;
`;
const CheckupThead = styled.thead`
  background: #f0f5ff;
`;
const CheckupTh = styled.th`
  padding: 12px 8px;
  font-weight: 700;
  color: #2563eb;
  font-size: 1.05rem;
  text-align: left;
`;
const CheckupTr = styled.tr`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(56, 182, 255, 0.08);
  transition: box-shadow 0.2s, transform 0.2s;
  &:hover {
    box-shadow: 0 8px 24px rgba(56, 182, 255, 0.15);
    transform: scale(1.01);
  }
`;
const CheckupTd = styled.td`
  padding: 14px 8px;
  font-size: 1rem;
  color: #2d3436;
  vertical-align: middle;
`;
const CheckupActionButton = styled.button`
  background: linear-gradient(90deg, #2980b9 60%, #38b6ff 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 8px 18px;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
  box-shadow: 0 2px 8px rgba(56, 182, 255, 0.1);
  &:hover {
    background: linear-gradient(90deg, #38b6ff 0%, #2980b9 100%);
    box-shadow: 0 6px 24px rgba(56, 182, 255, 0.18);
    transform: scale(1.05);
  }
`;
const CheckupStatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  border-radius: 12px;
  padding: 4px 16px;
  font-size: 1rem;
  background: #e8f8f5;
  color: #27ae60;
`;

const ChartTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 12px;
  margin-top: 16px;
`;
const ChartThead = styled.thead`
  background: #f0f5ff;
`;
const ChartTh = styled.th`
  padding: 12px 8px;
  font-weight: 700;
  color: #2563eb;
  font-size: 1.05rem;
  text-align: left;
`;
const ChartTr = styled.tr`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(56, 182, 255, 0.08);
  transition: box-shadow 0.2s, transform 0.2s;
  &:hover {
    box-shadow: 0 8px 24px rgba(56, 182, 255, 0.15);
    transform: scale(1.01);
  }
`;
const ChartTd = styled.td`
  padding: 14px 8px;
  font-size: 1rem;
  color: #2d3436;
  vertical-align: middle;
`;
const ChartActionButton = styled.button`
  background: linear-gradient(90deg, #2980b9 60%, #38b6ff 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 8px 18px;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
  box-shadow: 0 2px 8px rgba(56, 182, 255, 0.1);
  &:hover {
    background: linear-gradient(90deg, #38b6ff 0%, #2980b9 100%);
    box-shadow: 0 6px 24px rgba(56, 182, 255, 0.18);
    transform: scale(1.05);
  }
`;

const MedicationTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 12px;
  margin-top: 16px;
`;
const MedicationThead = styled.thead`
  background: #f0f5ff;
`;
const MedicationTh = styled.th`
  padding: 12px 8px;
  font-weight: 700;
  color: #2563eb;
  font-size: 1.05rem;
  text-align: left;
`;
const MedicationTr = styled.tr`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(56, 182, 255, 0.08);
  transition: box-shadow 0.2s, transform 0.2s;
  &:hover {
    box-shadow: 0 8px 24px rgba(56, 182, 255, 0.15);
    transform: scale(1.01);
  }
`;
const MedicationTd = styled.td`
  padding: 14px 8px;
  font-size: 1rem;
  color: #2d3436;
  vertical-align: middle;
`;
const MedicationActionButton = styled.button`
  background: linear-gradient(90deg, #2980b9 60%, #38b6ff 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 8px 18px;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
  box-shadow: 0 2px 8px rgba(56, 182, 255, 0.1);
  &:hover {
    background: linear-gradient(90deg, #38b6ff 0%, #2980b9 100%);
    box-shadow: 0 6px 24px rgba(56, 182, 255, 0.18);
    transform: scale(1.05);
  }
`;
const HealthBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  border-radius: 12px;
  padding: 4px 16px;
  font-size: 1rem;
  background: ${({ conclusion }) =>
    conclusion === "Healthy"
      ? "#green"
      : conclusion === "Sick"
        ? "#eaee00"
        : ""};
`;



const CardHeader = styled.div`
  background: #f4f6f8;
  border-radius: 16px 16px 0 0;
  padding: 18px 28px;
  font-size: 1.15rem;
  font-weight: 600;
  color: #2563eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OutlineButton = styled.button`
  background: transparent;
  color: #3498db;
  border: 2px solid #5dade2;
  border-radius: 10px;
  padding: 8px 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #eaf6fb;
    color: #217dbb;
  }
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
  justify-content: flex-end;
`;
const PageBtn = styled.button`
  background: #f0f5ff;
  color: #2563eb;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover,
  &[aria-current="true"] {
    background: linear-gradient(90deg, #3498db 60%, #5dade2 100%);
    color: #fff;
  }
`;

const CheckupTableWrapper = styled.div`
  background: #fafafa;
  border-radius: 18px;
  box-shadow: 0 4px 16px rgba(52, 152, 219, 0.06);
  padding: 0 0 24px 0;
`;

const TABS = [
  {
    key: "checkup",
    label: (
      <>
        <i className="fas fa-stethoscope me-2" style={{ color: "#27AE60" }} ></i>Khám sức khỏe
      </>
    ),
  },
  {
    key: "vaccination",
    label: (
      <>
        <i className="fas fa-syringe me-2" style={{ color: "#2980B9" }}></i>Tiêm chủng
      </>
    ),
  },
  {
    key: "chart",
    label: (
      <>
        <i className="fas fa-chart-line me-2" style={{ color: "#2563eb" }}></i>Theo dõi sức khỏe
      </>
    ),
  },
  {
    key: "medication",
    label: (
      <>
        <i className="fas fa-pills me-2" style={{ color: "#2563eb" }}></i>Gửi thuốc
      </>
    ),
  },
];

const HealthHistory = () => {
  // State quản lý tab hiện tại (khám sức khỏe, tiêm chủng, theo dõi sức khỏe)
  const [activeTab, setActiveTab] = useState("checkup");
  // State lưu dữ liệu bảng hiện tại
  const [data, setData] = useState([]);
  // State loading và lỗi khi fetch dữ liệu
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Lấy user từ context để lấy parentId
  const { user, logout } = useAuth();
  const parentId = user?.id ? Number(user.id) : undefined;
  const navigate = useNavigate ? useNavigate() : () => { };

  // State cho modal chi tiết (dùng chung cho các tab)
  const [showModal, setShowModal] = useState(false);
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState("");

  // State cho hiển thị biểu đồ
  const [showChart, setShowChart] = useState(false);

  const [medicationHistory, setMedicationHistory] = useState([]);
  const [searchMedication, setSearchMedication] = useState("");

  // State cho modal chi tiết gửi thuốc
  const [showMedicationDetail, setShowMedicationDetail] = useState(false);
  const [medicationDetail, setMedicationDetail] = useState(null);
  const [loadingMedicationDetail, setLoadingMedicationDetail] = useState(false);

  // State cho modal xác nhận đăng xuất
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // State phân trang cho checkup
  const [checkupPage, setCheckupPage] = useState(1);
  const checkupPageSize = 4;
  const checkupTotalPage = Math.ceil(data.length / checkupPageSize);
  const checkupPaged = data.slice(
    (checkupPage - 1) * checkupPageSize,
    checkupPage * checkupPageSize
  );

  // State phân trang cho vaccination
  const [vaccinationPage, setVaccinationPage] = useState(1);
  const vaccinationPageSize = 4;
  const vaccinationTotalPage = Math.ceil(data.length / vaccinationPageSize);
  const vaccinationPaged = data.slice(
    (vaccinationPage - 1) * vaccinationPageSize,
    vaccinationPage * vaccinationPageSize
  );

  // State phân trang cho medication
  const [medicationPage, setMedicationPage] = useState(1);
  const medicationPageSize = 4;
  const medicationTotalPage = Math.ceil(data.length / medicationPageSize);
  const medicationPaged = data.slice(
    (medicationPage - 1) * medicationPageSize,
    medicationPage * medicationPageSize
  );

  // useEffect: Tự động fetch dữ liệu khi đổi tab hoặc parentId
  useEffect(() => {
    // Xác định URL API theo tab
    // Gửi request GET tới API, truyền token
    // Lưu dữ liệu vào state, xử lý lỗi nếu có
    if (!parentId) return;
    setLoading(true);
    setError("");
    let url = "";
    if (activeTab === "checkup" || activeTab === "chart") {
      url = `http://localhost:5182/api/HealthCheck/parent/${parentId}`;
    } else if (activeTab === "vaccination") {
      url = `http://localhost:5182/api/Vaccination/parent/${parentId}`;
    } else if (activeTab === "medication") {
      url = `http://localhost:5182/api/Medication/parent/${parentId}`;
    }
    if (!url) return;
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data.data || []);
      } catch (err) {
        setError("Không thể tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [parentId, activeTab]);

  useEffect(() => {
    if (activeTab === "medication" && parentId) {
      const fetchMedicationHistory = async () => {
        try {
          const res = await fetch(
            `http://localhost:5182/api/Medication/parent/${parentId}`
          );
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
  const handleShowDetail = async (id, type = "checkup") => {
    setShowModal(true);
    setLoadingDetail(true);
    setErrorDetail("");
    setDetail(null);
    let url = "";
    if (type === "checkup") url = `http://localhost:5182/api/HealthCheck/${id}`;
    else if (type === "vaccination")
      url = `http://localhost:5182/api/Vaccination/${id}`;
    else if (type === "medicine")
      url = `http://localhost:5182/api/MedicineUsage/${id}`;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setDetail(res.data.data);
      } else {
        setErrorDetail("Không lấy được chi tiết");
      }
    } catch (err) {
      setErrorDetail("Lỗi khi lấy chi tiết");
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
  function getStatusConclusion(conclusion) {
    if (!conclusion) return "badge-status";
    const c = conclusion.toLowerCase();
    if (c === "healthy" || c === "Khỏe mạnh") return "badge-status healthy";
    if (c === "sick" || c === "Bệnh") return "badge-status sick";
    return "badge-status";
  } function getStatusVaccine(result) {
    if (!result) return "badge-status";
    const r = result.toLowerCase();
    if (r === "successful" || r === "đã tiêm") return "badge-status successful";
    if (r === "pending" || r === "chờ tiêm") return "badge-status pending";
    if (r === "rejected" || r === "đã từ chối") return "badge-status rejected";
  }
  // Hàm xác định class cho badge trạng thái
  function getStatusClass(status) {
    if (!status) return "badge-status";

    const s = status.toLowerCase();
    if (s === "completed" || s === "đã hoàn thành") return "badge-status completed";
    if (s === "active" || s === "đang sử dụng") return "badge-status active";
    if (s === "pending" || s === "chờ xác nhận") return "badge-status pending";
    if (s === "rejected" || s === "đã từ chối") return "badge-status rejected";

    return "badge-status";
  }

  return (
    <div className="parent-bg-img parent-theme parent-bg">
      <StyledContainer>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <StyledTitle
            level={8}
            style={{ marginBottom: -2, marginLeft: 440, marginTop: 30, fontSize: "4rem", fontWeight: "bold" }}
          >
            Lịch sử sức khỏe
          </StyledTitle>
        </div>
        <div style={{ backgroundColor: "white", borderRadius: 16, padding: 20, marginBottom: 10, width: "70%", marginLeft: "16%" }}>

          <Space
            style={{ marginBottom: 5, marginTop: 5, justifyContent: "center", width: "100%" }}
          >
            {TABS.map((tab) => (
              <TabButton
                key={tab.key}
                $active={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </TabButton>
            ))}
          </Space>
        </div>
        <ContentCard>
          {loading ? (
            <Skeleton
              active
              paragraph={{ rows: 6 }}
              title={false}
              style={{ margin: 32 }}
            />
          ) : error ? (
            <Alert
              type="error"
              message={error}
              showIcon
              style={{ margin: "24px 0" }}
            />
          ) : (
            <FadeInDiv>
              {activeTab === "checkup" && (
                <CheckupTableWrapper>
                  <CardHeader>
                    Lần khám gần nhất:{" "}
                    {data[0]?.date
                      ? new Date(data[0].date).toLocaleDateString("vi-VN")
                      : "---"}
                    <span>Tổng cộng: {data.length} lượt khám</span>
                  </CardHeader>
                  <CheckupTable >
                    <CheckupThead>
                      <tr>
                        <CheckupTh style={{ textAlign: "center" }}>
                          <FaCalendarAlt
                            style={{ color: "#38b6ff", marginRight: 4 }}
                          />
                          Ngày khám
                        </CheckupTh>
                        <CheckupTh style={{ textAlign: "center" }}>
                          <FaUser style={{ color: "#2563eb", marginRight: 4 }} />
                          Tên học sinh
                        </CheckupTh>
                        <CheckupTh style={{ textAlign: "center" }}>
                          <FaRulerVertical
                            style={{ color: "#38b6ff", marginRight: 4 }}
                          />
                          Chiều cao
                        </CheckupTh>
                        <CheckupTh style={{ textAlign: "center" }}>
                          <FaWeight
                            style={{ color: "#38b6ff", marginRight: 4 }}
                          />
                          Cân nặng
                        </CheckupTh>
                        <CheckupTh style={{ textAlign: "center" }}>BMI</CheckupTh>
                        <CheckupTh style={{ textAlign: "center" }}>
                          <FaCheckCircle
                            style={{ color: "#38b6ff", marginRight: 4 }}
                          />
                          Kết luận
                        </CheckupTh>
                        <CheckupTh style={{ textAlign: "center" }}>
                          <FaUserMd
                            style={{ color: "#2563eb", marginRight: 4 }}
                          />
                          Bác sĩ
                        </CheckupTh>
                        <CheckupTh style={{ textAlign: "center" }}>Chi tiết</CheckupTh>
                      </tr>
                    </CheckupThead>
                    <tbody>
                      {checkupPaged.length === 0 ? (
                        <tr>
                          <CheckupTd
                            colSpan="8"
                            style={{ textAlign: "center", color: "#999" }}
                          >
                            Không có dữ liệu khám sức khỏe
                          </CheckupTd>
                        </tr>
                      ) : (
                        checkupPaged.map((row) => (
                          <CheckupTr key={row.id} style={{ textAlign: "center" }}  >
                            <CheckupTd style={{ textAlign: "center" }}>
                              {new Date(row.date).toLocaleDateString("vi-VN")}
                            </CheckupTd>
                            <CheckupTd>{row.studentName}</CheckupTd>
                            <CheckupTd style={{ textAlign: "center" }}>{row.height} cm</CheckupTd>
                            <CheckupTd style={{ textAlign: "center" }}>{row.weight} kg</CheckupTd>
                            <CheckupTd style={{ textAlign: "center" }}>{row.bmi}</CheckupTd>
                            <CheckupTd style={{ textAlign: "center" }}>
                              <span className={getStatusConclusion(row.conclusion)}>
                                {row.conclusion === "Healthy"
                                  ? "Khỏe mạnh"
                                  : row.conclusion === "Sick"
                                    ? "Bệnh"
                                    : "Cần chú ý"}
                              </span>
                            </CheckupTd>
                            <CheckupTd style={{ textAlign: "center" }}>{row.nurseName}</CheckupTd>
                            <CheckupTd style={{ textAlign: "center" }}>
                              <Tooltip title="Xem chi tiết hồ sơ khám sức khỏe" style={{ textAlign: "center", }}>
                                <OutlineButton style={{ textAlign: "center", marginLeft: "16%" }}
                                  onClick={() =>
                                    handleShowDetail(row.id, "checkup")
                                  }
                                >
                                  <FaEye /> Xem hồ sơ
                                </OutlineButton>
                              </Tooltip>
                            </CheckupTd>
                          </CheckupTr>
                        ))
                      )}
                    </tbody>
                  </CheckupTable>
                  {checkupTotalPage > 1 && (
                    <Pagination>
                      <PageBtn
                        onClick={() => setCheckupPage((p) => Math.max(1, p - 1))}
                        disabled={checkupPage === 1}
                      >
                        <FaChevronLeft />
                      </PageBtn>
                      <span>
                        Trang {checkupPage}/{checkupTotalPage}
                      </span>
                      <PageBtn
                        onClick={() =>
                          setCheckupPage((p) => Math.min(checkupTotalPage, p + 1))
                        }
                        disabled={checkupPage === checkupTotalPage}
                      >
                        <FaChevronRight />
                      </PageBtn>
                    </Pagination>
                  )}
                </CheckupTableWrapper>
              )}

              {activeTab === "vaccination" && (
                <>
                  <VaccinationTable>
                    <VaccinationThead>
                      <tr>
                        <VaccinationTh style={{ textAlign: "center" }}>
                          <FaCalendarAlt
                            style={{ color: "#38b6ff", marginRight: 4 }}
                          />
                          Ngày tiêm
                        </VaccinationTh>
                        <VaccinationTh style={{ textAlign: "center" }}>
                          <FaUser style={{ color: "#2563eb", marginRight: 4 }} />
                          Tên học sinh
                        </VaccinationTh>
                        <VaccinationTh style={{ textAlign: "center" }}>
                          <FaSyringe
                            style={{ color: "#38b6ff", marginRight: 4 }}
                          />
                          Loại vắc-xin
                        </VaccinationTh>
                        <VaccinationTh style={{ textAlign: "center" }}>
                          <FaBuilding
                            style={{ color: "#2563eb", marginRight: 4 }}
                          />
                          Địa điểm
                        </VaccinationTh>
                        <VaccinationTh style={{ textAlign: "center" }}>
                          <FaUserMd
                            style={{ color: "#2563eb", marginRight: 4 }}
                          />
                          Bác sĩ
                        </VaccinationTh>
                        <VaccinationTh style={{ textAlign: "center" }}>Chi tiết</VaccinationTh>
                      </tr>
                    </VaccinationThead>
                    <tbody>
                      {vaccinationPaged.length === 0 ? (
                        <tr>
                          <VaccinationTd
                            colSpan="6"
                            style={{ textAlign: "center", color: "#999" }}
                          >
                            Không có dữ liệu tiêm chủng
                          </VaccinationTd>
                        </tr>
                      ) : (
                        vaccinationPaged.map((row) => (
                          <VaccinationTr key={row.id} style={{ textAlign: "center" }}>
                            <VaccinationTd style={{ textAlign: "center" }}>{row.date}</VaccinationTd>
                            <VaccinationTd style={{ textAlign: "center" }}>{row.studentName}</VaccinationTd>
                            <VaccinationTd style={{ textAlign: "center" }}>{row.vaccineName}</VaccinationTd>
                            <VaccinationTd>{row.location}</VaccinationTd>
                            <VaccinationTd>{row.nurseName}</VaccinationTd>
                            <VaccinationTd>
                              <Tooltip title="Xem chi tiết hồ sơ tiêm chủng" style={{ textAlign: "center" }}>
                                <OutlineButton style={{ textAlign: "center", marginLeft: "16%" }}
                                  onClick={() =>
                                    handleShowDetail(row.id, "vaccination")
                                  }
                                >
                                  <FaEye /> Xem hồ sơ
                                </OutlineButton>
                              </Tooltip>
                            </VaccinationTd>
                          </VaccinationTr>
                        ))
                      )}
                    </tbody>
                  </VaccinationTable>
                  {vaccinationTotalPage > 1 && (
                    <Pagination>
                      <PageBtn
                        onClick={() =>
                          setVaccinationPage((p) => Math.max(1, p - 1))
                        }
                        disabled={vaccinationPage === 1}
                      >
                        <FaChevronLeft />
                      </PageBtn>
                      <span>
                        Trang {vaccinationPage}/{vaccinationTotalPage}
                      </span>
                      <PageBtn
                        onClick={() =>
                          setVaccinationPage((p) =>
                            Math.min(vaccinationTotalPage, p + 1)
                          )
                        }
                        disabled={vaccinationPage === vaccinationTotalPage}
                      >
                        <FaChevronRight />
                      </PageBtn>
                    </Pagination>
                  )}
                </>
              )}

              {activeTab === "chart" && (
                <>
                  <Button
                    type={showChart ? "default" : "primary"}
                    onClick={() => setShowChart((v) => !v)}
                    style={{
                      marginBottom: 5,
                      borderRadius: 12,
                      padding: "8px 10px",
                      height: "auto",
                    }}
                  >
                    {showChart ? "Ẩn biểu đồ" : "Hiển thị biểu đồ"}
                  </Button>
                  {showChart && (
                    <ChartContainer>
                      {data.length > 0 ? (
                        <Bar
                          data={data}
                          xField="date"
                          yField="height"
                          seriesField="studentName"
                          colorField="studentName"
                          xAxis={{
                            title: { text: "Ngày đo" },
                          }}
                          yAxis={{
                            title: { text: "Chiều cao (cm)" },
                          }}
                          height={320}
                          legend={{ position: "top" }}
                          barStyle={{
                            stroke: "#333",
                            lineWidth: 1,
                            radius: [4, 4, 0, 0],

                          }}
                        />
                      ) : (
                        <div style={{
                          textAlign: 'center',
                          padding: '40px 20px',
                          color: '#999',
                          fontSize: '16px'
                        }}>
                          Không có dữ liệu để hiển thị biểu đồ
                        </div>
                      )}
                    </ChartContainer>
                  )}
                  <ChartTable>
                    <ChartThead>
                      <tr>
                        <ChartTh style={{ textAlign: "center" }}>
                          <FaUser style={{ color: "#2563eb", textAlign: "center" }} />
                          Tên học sinh
                        </ChartTh>
                        <ChartTh style={{ textAlign: "center" }}>
                          <FaCalendarAlt
                            style={{ color: "#38b6ff", textAlign: "center" }}
                          />
                          Ngày đo
                        </ChartTh>
                        <ChartTh style={{ textAlign: "center" }}>
                          <FaRulerVertical
                            style={{ color: "#38b6ff", textAlign: "center" }}
                          />
                          Chiều cao (cm)
                        </ChartTh>
                      </tr>
                    </ChartThead>
                    <tbody>
                      {data.length === 0 ? (
                        <tr>
                          <ChartTd
                            colSpan="3"
                            style={{ textAlign: "center", color: "#999" }}
                          >
                            Không có dữ liệu theo dõi sức khỏe
                          </ChartTd>
                        </tr>
                      ) : (
                        data.slice(0, 8).map((row) => (
                          <ChartTr key={row.id} style={{ textAlign: "center" }}>
                            <ChartTd style={{ textAlign: "center" }}>{row.studentName}</ChartTd>
                            <ChartTd style={{ textAlign: "center" }}>
                              {row.date ? (
                                <>
                                  {new Date(row.date).toLocaleDateString("vi-VN")}
                                </>
                              ) : (
                                ""
                              )}
                            </ChartTd>
                            <ChartTd>{row.height}</ChartTd>
                          </ChartTr>
                        ))
                      )}
                    </tbody>
                  </ChartTable>
                </>
              )}

              {activeTab === "medication" && (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 24,
                    }}
                  >
                    <div style={{ marginLeft: "35%" }}>
                      <h5 style={{ margin: 0, color: "#1a365d", fontSize: "3rem", fontWeight: "bold", textAlign: "center" }}>
                        Lịch sử gửi thuốc
                      </h5>
                      <div style={{ marginLeft: "-120%", marginTop: "5%", marginBottom: "-8%" }}>

                        <SearchInput style={{ width: "150%" }}
                          placeholder="Tìm kiếm theo mã đơn, học sinh, thuốc, ghi chú..."
                          value={searchMedication}
                          onChange={(e) => {
                            setSearchMedication(e.target.value);
                            setMedicationPage(1);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <MedicationTable>
                    <MedicationThead style={{ textAlign: "center" }}>
                      <tr>
                        <MedicationTh style={{ textAlign: "center" }}>
                          <FaPills style={{ color: "#38b6ff", marginRight: 4 }} />
                          Mã đơn
                        </MedicationTh>
                        <MedicationTh style={{ textAlign: "center" }}>
                          <FaBuilding
                            style={{ color: "#2563eb", marginRight: 4 }}
                          />
                          Mã lớp
                        </MedicationTh>
                        <MedicationTh style={{ textAlign: "center" }}>
                          <FaUser style={{ color: "#2563eb", marginRight: 4 }} />
                          Học sinh
                        </MedicationTh>
                        <MedicationTh style={{ textAlign: "center" }}>
                          <FaPills style={{ color: "#38b6ff", marginRight: 4 }} />
                          Danh sách thuốc
                        </MedicationTh>
                        <MedicationTh style={{ textAlign: "center" }}>
                          <FaCalendarAlt
                            style={{ color: "#38b6ff", marginRight: 4 }}
                          />
                          Ngày gửi
                        </MedicationTh>
                        <MedicationTh style={{ textAlign: "center" }}>
                          <FaCheckCircle
                            style={{ color: "#38b6ff", marginRight: 4 }}
                          />
                          Trạng thái
                        </MedicationTh>
                        <MedicationTh style={{ textAlign: "center" }}>Chi tiết</MedicationTh>
                      </tr>
                    </MedicationThead>
                    <tbody>
                      {medicationPaged.length === 0 ? (
                        <tr>
                          <MedicationTd
                            colSpan="7"
                            style={{ textAlign: "center", color: "#999" }}
                          >
                            Không có dữ liệu gửi thuốc
                          </MedicationTd>
                        </tr>
                      ) : (
                        medicationPaged.map((row) => (
                          <MedicationTr key={row.id} style={{ textAlign: "center" }}>
                            <MedicationTd style={{ textAlign: "center" }}>{row.id}</MedicationTd>
                            <MedicationTd style={{ textAlign: "center" }}>
                              {row.studentClassName || "-"}
                            </MedicationTd>
                            <MedicationTd style={{ textAlign: "center" }}>{row.studentName}</MedicationTd>
                            <MedicationTd style={{ textAlign: "center" }}>
                              <ul style={{ margin: 0, paddingLeft: 20 }}>
                                {row.medications?.map((med, idx) => (
                                  <li key={idx}>
                                    <FaPills
                                      style={{ color: "#38b6ff", marginRight: 4 }}
                                    />
                                    <b>{med.medicationName}</b> - {med.dosage}
                                    {med.note && (
                                      <>
                                        <br />
                                        <span style={{ color: "#666" }}>
                                          {med.note}
                                        </span>
                                      </>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </MedicationTd>
                            <MedicationTd>
                              {row.createdDate
                                ? row.createdDate.split("T")[0]
                                : "-"}
                            </MedicationTd>
                            <MedicationTd>
                              <span className={getStatusClass(row.status)}>
                                {row.status === "Active"
                                  ? "Đang sử dụng"
                                  : row.status === "Pending"
                                    ? "Chờ xác nhận"
                                    : row.status === "Completed"
                                      ? "Đã hoàn thành"
                                      : row.status}
                              </span>
                            </MedicationTd>
                            <MedicationTd>
                              <Tooltip title="Xem chi tiết gửi thuốc">
                                <OutlineButton style={{ textAlign: "center", marginLeft: "16%" }}
                                  onClick={() => handleShowMedicationDetail(row.id)}
                                >
                                  <FaEye /> Xem hồ sơ
                                </OutlineButton>
                              </Tooltip>
                            </MedicationTd>
                          </MedicationTr>
                        )))}
                    </tbody>
                  </MedicationTable>
                  {medicationTotalPage > 1 && (
                    <Pagination>
                      <PageBtn
                        onClick={() =>
                          setMedicationPage((p) => Math.max(1, p - 1))
                        }
                        disabled={medicationPage === 1}
                      >
                        <FaChevronLeft />
                      </PageBtn>
                      <span>
                        Trang {medicationPage}/{medicationTotalPage}
                      </span>
                      <PageBtn
                        onClick={() =>
                          setMedicationPage((p) =>
                            Math.min(medicationTotalPage, p + 1)
                          )
                        }
                        disabled={medicationPage === medicationTotalPage}
                      >
                        <FaChevronRight />
                      </PageBtn>
                    </Pagination>
                  )}
                </>
              )}
            </FadeInDiv>
          )}
        </ContentCard>

        <Modal
          open={showModal}
          onCancel={() => setShowModal(false)}
          title={
            activeTab === "checkup"
              ? "Chi tiết khám sức khỏe"
              : "Chi tiết tiêm chủng"
          }
          footer={[
            <Button key="close" onClick={() => setShowModal(false)}>
              Đóng
            </Button>,
          ]}
          width={750}
        >
          {loadingDetail ? (
            <Spin tip="Đang tải chi tiết..." />
          ) : errorDetail ? (
            <Alert type="error" message={errorDetail} showIcon />
          ) : detail ? (
            activeTab === "checkup" ? (
              <DetailBox>
                <Row gutter={30}>
                  <Col span={12}>
                    <DetailLabel>
                      <i className="fas fa-calendar-alt me-2"></i>Ngày khám
                    </DetailLabel>
                    <DetailValue>
                      {detail.date
                        ? new Date(detail.date).toLocaleDateString("vi-VN")
                        : ""}
                    </DetailValue>
                    <DetailLabel>
                      <i className="fas fa-user-md me-2"></i>Bác sĩ
                    </DetailLabel>
                    <DetailValue>{detail.nurseName}</DetailValue>
                    <DetailLabel>
                      <i className="fas fa-building me-2"></i>Địa điểm
                    </DetailLabel>
                    <DetailValue>{detail.location}</DetailValue>
                  </Col>
                  <Col span={12}>
                    <DetailLabel>
                      <i className="fas fa-ruler-vertical me-2"></i>Chiều cao
                    </DetailLabel>
                    <DetailValue>
                      {detail.height != null && detail.height !== ""
                        ? detail.height + " cm"
                        : "N/A"}
                    </DetailValue>
                    <DetailLabel>
                      <i className="fas fa-weight me-2"></i>Cân nặng
                    </DetailLabel>
                    <DetailValue>
                      {detail.weight != null && detail.weight !== ""
                        ? detail.weight + " kg"
                        : "N/A"}
                    </DetailValue>
                    <DetailLabel>
                      <i className="fas fa-eye me-2"></i>Thị lực
                    </DetailLabel>
                    <DetailValue>
                      {detail.visionLeft != null && detail.visionRight != null
                        ? `${detail.visionLeft}/${detail.visionRight}`
                        : detail.visionLeft != null
                          ? `${detail.visionLeft}/-`
                          : detail.visionRight != null
                            ? `-/${detail.visionRight}`
                            : "N/A"}
                    </DetailValue>
                    <DetailLabel>
                      <i className="fas fa-calculator me-2"></i>BMI
                    </DetailLabel>
                    <DetailValue>
                      {detail.bmi != null && detail.bmi !== ""
                        ? detail.bmi
                        : "N/A"}
                    </DetailValue>
                    <DetailLabel>
                      <i className="fas fa-tint me-2"></i>Huyết áp
                    </DetailLabel>
                    <DetailValue>
                      {detail.bloodPressure ? detail.bloodPressure : "N/A"}
                    </DetailValue>
                    <DetailLabel>
                      <i className="fas fa-heartbeat me-2"></i>Nhịp tim
                    </DetailLabel>
                    <DetailValue>
                      {detail.heartRate ? detail.heartRate : "N/A"}
                    </DetailValue>
                  </Col>
                  <Col span={24}>
                    <DetailLabel>
                      Kết luận<span className={getStatusConclusion(detail.conclusion)}>{detail.conclusion === "Healthy"
                        ? "Khỏe mạnh"
                        : detail.conclusion === "Sick"
                          ? "Bệnh"
                          : "Cần chú ý"}</span>
                    </DetailLabel>
                    {detail.suggestions &&
                      Array.isArray(detail.suggestions) &&
                      detail.suggestions.length > 0 && (
                        <div className="mb-3">
                          <DetailLabel>Đề xuất</DetailLabel>
                          <ul className="mb-0">
                            {detail.suggestions.map((s, idx) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    {detail.description && (
                      <div className="mb-2">
                        <DetailLabel>Ghi chú</DetailLabel>
                        <DetailValue>{detail.description}</DetailValue>
                      </div>
                    )}
                  </Col>
                </Row>
              </DetailBox>
            ) : (
              // Chi tiết tiêm chủng
              <DetailBox>
                <Row gutter={16}>
                  <Col span={12}>
                    <DetailLabel>
                      <i className="fas fa-calendar-alt me-2"></i>Ngày tiêm
                    </DetailLabel>
                    <DetailValue>
                      {detail.date
                        ? new Date(detail.date).toLocaleDateString("vi-VN")
                        : ""}
                    </DetailValue>
                    <DetailLabel>
                      <i className="fas fa-user me-2"></i>Học sinh
                    </DetailLabel>
                    <DetailValue>{detail.studentName}</DetailValue>
                    <DetailLabel>
                      <i className="fas fa-building me-2"></i>Địa điểm
                    </DetailLabel>
                    <DetailValue>{detail.location}</DetailValue>
                  </Col>
                  <Col span={12}>
                    <DetailLabel>
                      <i className="fas fa-syringe me-2"></i>Vắc-xin
                    </DetailLabel>
                    <DetailValue>{detail.vaccineName}</DetailValue>
                    <DetailLabel>
                      <i className="fas fa-check-circle me-2"></i>Kết quả
                    </DetailLabel>
                    <DetailValue>
                      <span className={getStatusVaccine(detail.result)}>{detail.result === "Successful"
                        ? "Đã tiêm"
                        : detail.result === "Pending"
                          ? "Chờ tiêm"
                          : detail.result === "Rejected"
                            ? "Đã từ chối"
                            : " "}</span></DetailValue>
                    <DetailLabel>
                      <i className="fas fa-user-md me-2"></i>Y tá/Bác sĩ
                    </DetailLabel>
                    <DetailValue>{detail.nurseName}</DetailValue>
                  </Col>
                  <Col span={24}>
                    {detail.description && (
                      <div className="mb-2">
                        <DetailLabel>Ghi chú</DetailLabel>
                        <DetailValue>{detail.description}</DetailValue>
                      </div>
                    )}
                    {detail.status && (
                      <div className="mb-2">
                        <DetailLabel>Trạng thái</DetailLabel>
                        <DetailBadge>{detail.status}</DetailBadge>
                      </div>
                    )}
                    {detail.message && (
                      <div className="mb-2">
                        <DetailLabel>Thông báo</DetailLabel>
                        <DetailValue>{detail.message}</DetailValue>
                      </div>
                    )}
                  </Col>
                </Row>
              </DetailBox>
            )
          ) : null}
        </Modal>
        <Modal
          open={showMedicationDetail}
          onCancel={() => setShowMedicationDetail(false)}
          title="Chi tiết gửi thuốc"
          footer={
            <Button onClick={() => setShowMedicationDetail(false)}>Đóng</Button>
          }
          width={850}
        >
          {loadingMedicationDetail ? (
            <Spin tip="Đang tải chi tiết..." />
          ) : medicationDetail ? (
            <div className="medicine-detail-card">
              <div className="medicine-detail-grid-2col">
                <div>
                  <div className="medicine-label"><i className="fas fa-building me-2"></i>Mã lớp</div>
                  <div className="medicine-detail-value">{medicationDetail.studentClass || medicationDetail.studentClassName || ""}</div>
                </div>
                <div>
                  <div className="medicine-label"><i className="fas fa-user-md me-2"></i>Y tá phụ trách</div>
                  <div className="medicine-detail-value">{medicationDetail.nurseName || "-"}</div>
                </div>
                <div>
                  <div className="medicine-label"><i className="fas fa-user me-2"></i>Học sinh</div>
                  <div className="medicine-detail-value">{medicationDetail.studentName}</div>
                </div>
                <div>
                  <div className="medicine-label"><i className="fas fa-user-friends me-2"></i>Phụ huynh</div>
                  <div className="medicine-detail-value">{medicationDetail.parentName}</div>
                </div>
                <div>
                  <div className="medicine-label"><i className="fas fa-calendar-alt me-2"></i>Ngày gửi</div>
                  <div className="medicine-detail-value">{medicationDetail.createdDate ? new Date(medicationDetail.createdDate).toLocaleDateString("vi-VN") : ""}</div>
                </div>
                <div>
                  <div className="medicine-label"><i className="fas fa-calendar-check me-2"></i>Ngày nhận</div>
                  <div className="medicine-detail-value">{medicationDetail.reviceDate ? new Date(medicationDetail.reviceDate).toLocaleDateString("vi-VN") : "-"}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '18px 0' }}>
                <span className={`medicine-status-badge ${getStatusClass(medicationDetail.status).replace('badge-status', '')}`.trim()}>
                  {medicationDetail.status === "Completed" || medicationDetail.status === "Đã hoàn thành"
                    ? "Đã hoàn thành"
                    : medicationDetail.status === "Active" || medicationDetail.status === "Đang sử dụng"
                      ? "Đang sử dụng"
                      : medicationDetail.status === "Pending" || medicationDetail.status === "Chờ xác nhận"
                        ? "Chờ xác nhận"
                        : medicationDetail.status}
                </span>
              </div>
              <div style={{ marginTop: 8 }}>
                <div className="medicine-label" style={{ color: '#2563eb', fontWeight: 700, marginBottom: 6 }}><i className="fas fa-pills me-2"></i>Danh sách thuốc</div>
                <ul style={{ margin: 0, paddingLeft: 24 }}>
                  {medicationDetail.medications && medicationDetail.medications.length > 0 ? (
                    medicationDetail.medications.map((med, idx) => (
                      <li key={idx} style={{ marginBottom: 6 }}>
                        <b>{med.medicationName}</b> - {med.dosage}
                        {med.note && <span style={{ color: '#666', marginLeft: 8 }}>({med.note})</span>}
                      </li>
                    ))
                  ) : (
                    <li>Không có thông tin thuốc.</li>
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-danger">Không lấy được chi tiết gửi thuốc.</div>
          )}
        </Modal>
        <Modal
          open={showLogoutModal}
          onCancel={() => setShowLogoutModal(false)}
          title="Xác nhận đăng xuất"
          footer={[
            <Button key="cancel" onClick={() => setShowLogoutModal(false)}>
              Ở lại
            </Button>,
            <Button
              key="logout"
              type="primary"
              danger
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Có
            </Button>,
          ]}
          centered
        >
          <p>Bạn có muốn đăng xuất không?</p>
        </Modal>
      </StyledContainer>
    </div>
  );
};

export default HealthHistory;
