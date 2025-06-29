import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic } from "antd";
import { Table } from "react-bootstrap";
import { FaPills, FaClock, FaCalendarAlt, FaUserCheck, FaCheckCircle, FaUserNurse, FaEnvelope, FaChartPie, FaListAlt, FaHeartbeat } from "react-icons/fa";
import { PieChart, Pie as RePie, Cell, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart } from 'recharts';
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
// Import CSS cho Nurse Dashboard
import "../../styles/nurse/dashboard/index.css";
// import MedicineSvg from "../../assets/pill-svgrepo-com .svg";
// import ClockSvg from "../../assets/clock-svgrepo-com .svg";
// import CalendarSvg from "../../assets/graphic-design-illustration-svgrepo-com.svg";

import MedicalExaminationFemaleSvg from "../../assets/medical-examination-female-svgrepo-com.svg";

// Animation variants cho framer motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardHoverVariants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -8,
    transition: { duration: 0.3, ease: "easeOut" },
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
  },
};

// SVG Component cho thuốc - sử dụng SVG mới từ file
const MedicineSvg = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="pillGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A3D8A0" />
        <stop offset="100%" stopColor="#81C784" />
      </linearGradient>
      <linearGradient id="pillGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F8BBD9" />
        <stop offset="100%" stopColor="#FDF2F8" />
      </linearGradient>
    </defs>
    <g>
      <path
        fill="url(#pillGradient1)"
        d="M32.744,56.709C29.34,60.121,24.813,62,20,62c-9.925,0-18-8.074-18-18c0-4.813,1.879-9.34,5.294-12.746l11.27-11.276l25.46,25.46L32.744,56.709z"
      />
      <path
        fill="url(#pillGradient2)"
        d="M56.65,32.817L45.438,44.023L19.977,18.562L31.18,7.353c0.083-0.06,0.163-0.127,0.239-0.201C34.811,3.83,39.278,2,44,2c9.925,0,18,8.074,18,18c0,4.721-1.829,9.189-5.151,12.581C56.775,32.656,56.709,32.734,56.65,32.817z"
      />
      <path
        fill="rgba(255,255,255,0.3)"
        d="M64,20C64,8.953,55.047,0,44,0c-5.449,0-10.375,2.191-13.98,5.723L30,5.703L5.879,29.84C2.25,33.461,0,38.465,0,44c0,11.047,8.953,20,20,20c5.535,0,10.539-2.25,14.16-5.879L58.297,34l-0.02-0.02C61.809,30.375,64,25.445,64,20z M32.744,56.709C29.34,60.121,24.813,62,20,62c-9.925,0-18-8.074-18-18c0-4.813,1.879-9.34,5.294-12.746l11.27-11.276l25.46,25.46L32.744,56.709z M56.65,32.817L45.438,44.023L19.977,18.562L31.18,7.353c0.083-0.06,0.163-0.127,0.239-0.201C34.811,3.83,39.278,2,44,2c9.925,0,18,8.074,18,18c0,4.721-1.829,9.189-5.151,12.581C56.775,32.656,56.709,32.734,56.65,32.817z"
      />
    </g>
  </svg>
);

// SVG Component cho clock - sử dụng SVG wait đơn giản
const ClockSvg = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="clockSimpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F5A623" />
        <stop offset="100%" stopColor="#FFB300" />
      </linearGradient>
    </defs>
    <g>
      <circle fill="#FFFAEE" cx="16" cy="16" r="11.5" />
      <path fill="url(#clockSimpleGradient)" d="M16,2.5C8.544,2.5,2.5,8.544,2.5,16S8.544,29.5,16,29.5S29.5,23.456,29.5,16S23.456,2.5,16,2.5z M16,27.5C9.649,27.5,4.5,22.351,4.5,16S9.649,4.5,16,4.5S27.5,9.649,27.5,16S22.351,27.5,16,27.5z" />
      <path fill="#231F20" d="M15,24h2v1h-2V24z M17,8h-2V7h2V8z M25,15v2h-1v-2H25z M7,15h1v2H7V15z M16,16h4v1h-5v-7h1V16z" />
    </g>
  </svg>
);

// SVG Component cho calendar - sử dụng SVG folder mới từ file
const CalendarSvg = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 1024 1024"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="folderGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#87CEEB" />
        <stop offset="100%" stopColor="#4682B4" />
      </linearGradient>
      <linearGradient id="folderGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F8BBD9" />
        <stop offset="100%" stopColor="#FDF2F8" />
      </linearGradient>
    </defs>
    <g>
      <path d="M673 366.8c-4.8 3.5-10.5 4.4-16.7 4.4s-10.9 1.3-15.6-2.2c-12.7 6.6-25.8 20.4-25.8 36.4h76.2c0-16-5.4-32-18.1-38.6z" fill="url(#folderGradient2)" />
      <path d="M652.6 342.1m-17 0a17 17 0 1 0 34 0 17 17 0 1 0-34 0Z" fill="url(#folderGradient2)" />
      <path d="M742.8 893.2H281.2c-8.8 0-16-7.2-16-16V238.9c0-8.8 7.2-16 16-16h461.7c8.8 0 16 7.2 16 16v638.3c-0.1 8.8-7.2 16-16.1 16zM281.2 230.9c-4.4 0-8 3.6-8 8v638.3c0 4.4 3.6 8 8 8h461.7c4.4 0 8-3.6 8-8V238.9c0-4.4-3.6-8-8-8H281.2z" fill="url(#folderGradient1)" />
      <path d="M754.8 958.5H269.2c-40.7 0-73.7-33.1-73.7-73.7V231.3c0-40.7 33.1-73.7 73.7-73.7h137.9c2.4-24.8 13.5-47.8 31.5-65.3 19.8-19.3 46-29.9 73.7-29.9 27.7 0 53.8 10.6 73.7 29.9 18 17.5 29.1 40.5 31.5 65.3h137.4c40.7 0 73.7 33.1 73.7 73.7v653.5c0 40.6-33.1 73.7-73.8 73.7zM269.2 172.6c-32.4 0-58.7 26.3-58.7 58.7v653.5c0 32.4 26.3 58.7 58.7 58.7h485.7c32.4 0 58.7-26.3 58.7-58.7V231.3c0-32.4-26.3-58.7-58.7-58.7H603.2l-0.2-7.3c-0.7-23.6-10.5-45.8-27.5-62.3S536 77.3 512.3 77.3 466.1 86.5 449 103c-17 16.5-26.7 38.6-27.5 62.3l-0.2 7.3H269.2z" fill="#999999" />
      <path d="M514.5 153.3c-12.6 0-22.8-10.2-22.8-22.8s10.2-22.8 22.8-22.8 22.8 10.2 22.8 22.8-10.3 22.8-22.8 22.8z m0-37.5c-8.1 0-14.8 6.6-14.8 14.8s6.6 14.8 14.8 14.8c8.2 0 14.8-6.6 14.8-14.8s-6.7-14.8-14.8-14.8z" fill="url(#folderGradient1)" />
      <path d="M637.2 256H386.3c-8.8 0-16-7.2-16-16v-58.8c0-8.8 7.2-16 16-16h250.9c8.8 0 16 7.2 16 16V240c0 8.8-7.2 16-16 16z m-250.9-82.8c-4.4 0-8 3.6-8 8V240c0 4.4 3.6 8 8 8h250.9c4.4 0 8-3.6 8-8v-58.8c0-4.4-3.6-8-8-8H386.3zM649 362.5c-13.8 0-25.1-11.3-25.1-25.1s11.3-25.1 25.1-25.1 25.1 11.3 25.1 25.1-11.2 25.1-25.1 25.1z m0-42.2c-9.4 0-17.1 7.7-17.1 17.1s7.7 17.1 17.1 17.1 17.1-7.7 17.1-17.1-7.6-17.1-17.1-17.1z" fill="#999999" />
      <path d="M697.2 409.4h-96.3v-4c0-18.5 10.4-35.1 27-43.3l2.1-1 1.9 1.3c5.1 3.5 11 5.3 17.1 5.3s12.1-1.8 17.1-5.3l1.9-1.3 2.1 1c16.7 8.2 27 24.7 27 43.3v4h0.1z m-88.1-8H689c-1.3-13.1-8.8-24.6-20.4-31.1-5.9 3.5-12.6 5.4-19.6 5.4-6.9 0-13.7-1.9-19.6-5.4-11.5 6.5-19 18-20.3 31.1zM354.4 320.8h103.8v8H354.4zM354.4 395.9h178.8v8H354.4zM354.4 471h60.7v8h-60.7zM354.4 546h338.9v8H354.4zM354.4 621.1h273.8v8H354.4zM354.4 696.2h89.4v8h-89.4zM619.3 812.1h74v8h-74z" fill="#999999" />
    </g>
  </svg>
);

// SVG Component cho health declaration
const HealthSvg = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 -17.64 228.97 228.97"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="packageGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffc742" />
        <stop offset="100%" stopColor="#efa536" />
      </linearGradient>
      <linearGradient id="packageGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f7ead0" />
        <stop offset="100%" stopColor="#f7ead0" />
      </linearGradient>
      <linearGradient id="packageGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#275563" />
        <stop offset="100%" stopColor="#275563" />
      </linearGradient>
    </defs>
    <g>
      <rect fill="url(#packageGradient1)" height="149" rx="10" ry="10" width="220.97" x="2.99" y="39.67" />
      <rect fill="url(#packageGradient2)" height="10.95" width="218.95" x="7.04" y="43.92" />
      <polyline fill="#ffffff" points="60.21 43.33 61.09 112.15 89.47 88.32 117.86 111.4 117.86 43.05" />
      <path fill="url(#packageGradient3)" d="M120.84,123.32,88.41,90.89,56.08,122.06V41.17a4,4,0,1,1,8,0v62.06L88.51,79.67,112.84,104V40.89a4,4,0,0,1,8,0Z" />
      <rect fill="#efa536" height="9.06" width="221" x="3.87" y="176.54" />
      <path fill="#ffffff" d="M19.82,96.15a3,3,0,0,1-3-3V82a3,3,0,0,1,6,0V93.15A3,3,0,0,1,19.82,96.15Z" />
      <path fill="#ffffff" d="M19.82,75.57a3,3,0,0,1-3-3V66.52a3,3,0,0,1,6,0v6.05A3,3,0,0,1,19.82,75.57Z" />
      <circle fill="#ffffff" cx="19.78" cy="105.71" r="3.54" />
      <path fill="url(#packageGradient3)" d="M215,193.68H14a14,14,0,0,1-14-14v-129a14,14,0,0,1,14-14H215a14,14,0,0,1,14,14V84.83a4,4,0,1,1-8,0V50.68a6,6,0,0,0-6-6H14a6,6,0,0,0-6,6v129a6,6,0,0,0,6,6H215a6,6,0,0,0,6-6V139.83a4,4,0,0,1,8,0v39.86A14,14,0,0,1,215,193.68Z" />
      <ellipse fill="#908152" cx="171.89" cy="59.04" rx="43.58" ry="43.66" />
      <circle fill="#ffffff" cx="172.24" cy="48.12" r="43.66" />
      <path fill="#d9f0ff" d="M216.6,47.78a43.66,43.66,0,1,1-85.06-13.86c3.58,20.17,22.14,38.32,41.4,38.32s36.84-14.6,41.4-38.32A43.42,43.42,0,0,1,216.6,47.78Z" />
      <path fill="#d9f0ff" d="M216.23,47.11a43.66,43.66,0,1,1-87.31,0,44.17,44.17,0,0,1,.37-5.69,43.66,43.66,0,0,0,86.57,0A44.2,44.2,0,0,1,216.23,47.11Z" />
      <path fill="url(#packageGradient3)" d="M172,95.31a47.66,47.66,0,1,1,47.66-47.66A47.71,47.71,0,0,1,172,95.31ZM172,8a39.66,39.66,0,1,0,39.66,39.66A39.7,39.7,0,0,0,172,8Z" />
      <path fill="url(#packageGradient3)" d="M161.12,47.68a3.22,3.22,0,0,1,.59-2,1.86,1.86,0,0,1,1.56-.8H169V39a2,2,0,0,1,.86-1.59,3.16,3.16,0,0,1,2-.7,3,3,0,0,1,2,.7,2.06,2.06,0,0,1,.81,1.59v5.91h5.72a2,2,0,0,1,1.56.82,2.92,2.92,0,0,1,.7,2,2.86,2.86,0,0,1-.67,2,2.05,2.05,0,0,1-1.59.77h-5.72v6A2,2,0,0,1,174,58a3.27,3.27,0,0,1-2.08.61,3.41,3.41,0,0,1-2.08-.61,1.91,1.91,0,0,1-.84-1.62v-6h-5.77a1.9,1.9,0,0,1-1.56-.74A3.08,3.08,0,0,1,161.12,47.68Z" />
      <path fill="url(#packageGradient3)" d="M224.49,125.64a4,4,0,0,1-4-4v-7.31a4,4,0,0,1,8,0v7.31A4,4,0,0,1,224.49,125.64Z" />
      <path fill="url(#packageGradient3)" d="M224.49,105.64a4,4,0,0,1-4-4v-.31a4,4,0,0,1,8,0v.31A4,4,0,0,1,224.49,105.64Z" />
    </g>
  </svg>
);

const Dashboard = () => {
  const { user } = useAuth();
  const nurseId = user?.id;
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use real nurse profile from user context instead of hardcoded data
  const nurseProfile = {
    name: user?.fullName || user?.name || "Chưa cập nhật",
    role: user?.role || "Y tá",
    email: user?.email || "Chưa cập nhật",
    avatar: user?.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.fullName || user?.name || "Nurse") + "&background=F06292&color=fff&size=200"
  };

  useEffect(() => {
    if (!nurseId) return;
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/Home/nurse/${nurseId}`);
        setDashboardData(res.data.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [nurseId]);

  if (loading || !dashboardData) {
    return (
      <div className="nurse-dashboard">
        <div className="nurse-loading">
          <div className="nurse-loading-spinner"></div>
          <div className="nurse-loading-text">Đang tải dashboard...</div>
        </div>
      </div>
    );
  }

  // Map số liệu từ API
  const medicineToTake = dashboardData.activeMedicationsNumber || 0;
  const pendingMedicine = dashboardData.pendingMedicationsNumber || 0;
  const todayAppointments = dashboardData.todayAppointmentsNumber || dashboardData.medicalEvents?.length || 0;
  const newHealthDeclarations = dashboardData.notificationsNumber || 0;

  // Map dữ liệu cho các bảng
  const medicineSchedule = (dashboardData.medications || [])
    .map(med => ({
      key: med.id || Math.random(),
      time: med.time || "",
      student: med.studentName,
      class: med.studentClass,
      medicine: med.medications?.[0]?.medicationName || "",
      status: med.status === "Completed" ? "completed" : "pending"
    }))
    .filter(med => med.status !== 'completed');

  const todayHealthAppointments = (dashboardData.medicalEvents || []).map(ev => ({
    key: ev.id || Math.random(),
    eventType: ev.eventType,
    location: ev.location,
    studentName: ev.studentName,
    date: ev.date
  }));

  // Dữ liệu biểu đồ tròn với gradient colors
  const medicineStats = {
    confirmed: dashboardData.completedMedicationsNumber || 0,
    pending: dashboardData.pendingMedicationsNumber || 0
  };
  const pieData = [
    { name: 'Đã xác nhận', value: medicineStats.confirmed, color: '#81C784' },
    { name: 'Chờ xác nhận', value: medicineStats.pending, color: '#FFB300' },
  ];

  // Dữ liệu biểu đồ đường với area fill
  const today = new Date();
  const todayIdx = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const healthEventData = dashboardData.weeklyMedicalEventCounts ?
    Object.entries(dashboardData.weeklyMedicalEventCounts)
      .map(([day, value], idx) => ({
        day: day === 'Monday' ? 'T2' :
          day === 'Tuesday' ? 'T3' :
            day === 'Wednesday' ? 'T4' :
              day === 'Thursday' ? 'T5' :
                day === 'Friday' ? 'T6' :
                  day === 'Saturday' ? 'T7' : 'CN',
        events: value,
        idx
      }))
      .filter(d => d.idx <= todayIdx)
      .map(({ day, events }) => ({ day, events }))
    : [];

  // Cấu hình cột cho bảng
  const medicineColumns = [
    {
      title: 'Học sinh',
      dataIndex: 'student',
      key: 'student',
      width: 130,
      render: (name) => <span>{name}</span>
    },
    {
      title: 'Lớp',
      dataIndex: 'class',
      key: 'class',
      width: 70,
      render: (className) => <Badge count={className} className="nurse-badge" />
    },
    {
      title: 'Thuốc',
      dataIndex: 'medicine',
      key: 'medicine',
      width: 120,
      render: (medicine) => <span>{medicine}</span>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status) => status === 'completed' ?
        <span className="nurse-tag-success">
          <FaCheckCircle /> Hoàn thành
        </span> :
        <span className="nurse-tag-warning">
          <FaClock /> Chờ uống
        </span>
    },
  ];

  const todayColumns = [
    {
      title: 'Tên sự kiện',
      dataIndex: 'eventType',
      key: 'eventType',
      render: (eventType) => <span>{eventType}</span>
    },
    {
      title: 'Địa điểm',
      dataIndex: 'location',
      key: 'location',
      render: (location) => <span>{location}</span>
    },
    {
      title: 'Tên học sinh',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (studentName) => <span>{studentName}</span>
    },
    {
      title: 'Thời gian',
      dataIndex: 'date',
      key: 'date',
      render: (date) => <span>{date ? new Date(date).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}</span>
    }
  ];

  return (
    <div className="nurse-dashboard-container">
      {/* Header Banner */}
      <div className="nurse-header-banner">
        <div className="nurse-header-content">
          <div className="nurse-header-left">
            <div className="nurse-avatar">
              <span>NU</span>
            </div>
            <div className="nurse-header-text">
              <h1 className="nurse-welcome-title">
                Chào mừng, {nurseProfile.name}!
              </h1>
              <div className="nurse-welcome-subtitle">
                <FaUserNurse />
                {nurseProfile.role}
                <span>•</span>
                <FaEnvelope />
                {nurseProfile.email}
              </div>
            </div>
          </div>
          <div className="nurse-header-right">
            <img
              src={MedicalExaminationFemaleSvg}
              alt="Medical Examination"
              className="nurse-header-illustration"
            />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="nurse-stats-section">
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <motion.div variants={itemVariants}>
              <Card className="nurse-stat-card medicine-active">
                <div className="nurse-stat-content">
                  <div className="nurse-stat-icon">
                    <MedicineSvg />
                  </div>
                  <div className="nurse-stat-info">
                    <div className="nurse-stat-label">Thuốc cần uống</div>
                    <div className="nurse-stat-number">{medicineToTake}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <motion.div variants={itemVariants}>
              <Card className="nurse-stat-card medicine-pending">
                <div className="nurse-stat-content">
                  <div className="nurse-stat-icon">
                    <ClockSvg />
                  </div>
                  <div className="nurse-stat-info">
                    <div className="nurse-stat-label">Thuốc chờ xác nhận</div>
                    <div className="nurse-stat-number">{pendingMedicine}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <motion.div variants={itemVariants}>
              <Card className="nurse-stat-card appointments-today">
                <div className="nurse-stat-content">
                  <div className="nurse-stat-icon">
                    <CalendarSvg />
                  </div>
                  <div className="nurse-stat-info">
                    <div className="nurse-stat-label">Lịch khám hôm nay</div>
                    <div className="nurse-stat-number">{todayAppointments}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <motion.div variants={itemVariants}>
              <Card className="nurse-stat-card health-declarations">
                <div className="nurse-stat-content">
                  <div className="nurse-stat-icon">
                    <HealthSvg />
                  </div>
                  <div className="nurse-stat-info">
                    <div className="nurse-stat-label">Khai báo y tế mới</div>
                    <div className="nurse-stat-number">{newHealthDeclarations}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </div>

      {/* Charts Section */}
      <div className="nurse-charts-section">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <motion.div variants={itemVariants}>
              <Card className="nurse-chart-card">
                <div className="nurse-chart-header">
                  <FaChartPie />
                  <span>Tỉ lệ xác nhận thuốc</span>
                </div>
                <div className="nurse-chart-content">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <RePie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                      >
                        {pieData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={idx === 0 ? '#4A90E2' : '#F5A623'} />
                        ))}
                      </RePie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          </Col>

          {/* Weekly Health Events Chart */}
          <Col xs={24} lg={12}>
            <motion.div variants={itemVariants}>
              <Card className="nurse-chart-card">
                <div className="nurse-chart-header">
                  <FaHeartbeat />
                  <span>Sự kiện y tế trong tuần</span>
                </div>
                <div className="nurse-chart-content">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={healthEventData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="events"
                        fill="#F8BBD9"
                        stroke="#FF6B8D"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </div>

      {/* Tables Section */}
      <div className="nurse-tables-section">
        <Row gutter={[24, 24]}>
          {/* Medicine Schedule Table */}
          <Col xs={24} lg={12}>
            <motion.div variants={itemVariants}>
              <Card className="nurse-table-card">
                <div className="nurse-table-header">
                  <FaPills />
                  <span>Lịch cho uống thuốc</span>
                </div>
                <div className="nurse-table-content">
                  <Table striped hover className="nurse-schedule-table">
                    <thead>
                      <tr>
                        <th>Học sinh</th>
                        <th>Lớp</th>
                        <th>Thuốc</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicineSchedule.map((row) => (
                        <tr key={row.key}>
                          <td>{row.student}</td>
                          <td>{row.class}</td>
                          <td>{row.medicine}</td>
                          <td>
                            {row.status === 'completed' ? (
                              <span className="nurse-tag-success">
                                <FaCheckCircle /> Hoàn thành
                              </span>
                            ) : (
                              <span className="nurse-tag-warning">
                                <FaClock /> Chờ uống
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card>
            </motion.div>
          </Col>

          {/* Today's Health Appointments Table */}
          <Col xs={24} lg={12}>
            <motion.div variants={itemVariants}>
              <Card className="nurse-table-card">
                <div className="nurse-table-header">
                  <FaCalendarAlt />
                  <span>Lịch khám hôm nay</span>
                </div>
                <div className="nurse-table-content">
                  <Table striped hover className="nurse-appointments-table">
                    <thead>
                      <tr>
                        <th>Tên sự kiện</th>
                        <th>Địa điểm</th>
                        <th>Tên học sinh</th>
                        <th>Thời gian</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todayHealthAppointments.map((row) => (
                        <tr key={row.key}>
                          <td>{row.eventType}</td>
                          <td>{row.location}</td>
                          <td>{row.studentName}</td>
                          <td>{row.date ? new Date(row.date).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
