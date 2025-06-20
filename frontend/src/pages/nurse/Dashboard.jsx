import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Badge, Avatar } from "antd";
import { FaPills, FaClock, FaCalendarAlt, FaUserCheck, FaCheckCircle, FaUserNurse, FaEnvelope, FaChartPie, FaListAlt, FaHeartbeat } from "react-icons/fa";
import { PieChart, Pie as RePie, Cell, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart } from 'recharts';
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import "../../styles/nurse-theme.css";
import "../../styles/sidebar.css";
import CustomTable from "../../components/CustomTable";
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
    style={{ marginBottom: '8px' }}
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
    style={{ marginBottom: '8px' }}
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
    style={{ marginBottom: '8px' }}
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
    style={{ marginBottom: '8px' }}
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

// Mock nurse profile
const nurseProfile = {
  name: "Nguyễn Thị B",
  role: "Y tá",
  email: "nurse.b@school.edu.vn",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg"
};

const Dashboard = () => {
  const { user } = useAuth();
  const nurseId = user?.id;
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!nurseId) return;
    const fetchDashboard = async () => {
      setLoading(true);
      const res = await fetch(`http://localhost:5182/api/Home/nurse/${nurseId}`);
      const data = await res.json();
      setDashboardData(data.data);
      setLoading(false);
    };
    fetchDashboard();
  }, [nurseId]);

  if (loading || !dashboardData) {
    return (
      <div className="nurse-loading">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ fontSize: '48px', color: 'var(--nurse-accent)' }}
        >
          <FaHeartbeat />
        </motion.div>
        <p style={{ marginTop: '16px' }}>Đang tải dashboard...</p>
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
      class: med.studentClassName,
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
      render: (name) => <span style={{ color: 'var(--nurse-text)' }}>{name}</span>
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
      render: (medicine) => <span style={{ color: 'var(--nurse-text)', fontSize: '0.9em' }}>{medicine}</span>
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
      render: (eventType) => <span style={{ fontWeight: 600 }}>{eventType}</span>
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
    <motion.div
      className="nurse-dashboard"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Banner */}
      <div className="nurse-header-banner">
        <div className="nurse-header-content">
          <Row align="middle">
            <Col>
              <motion.div
                className="nurse-avatar"
                style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden' }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <img src={nurseProfile.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </motion.div>
            </Col>
            <Col flex="auto" style={{ marginLeft: 24 }}>
              <motion.h1
                className="nurse-welcome-title"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Chào mừng, {nurseProfile.name}!
              </motion.h1>
              <motion.div
                className="nurse-welcome-subtitle"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <FaUserNurse style={{ marginRight: '8px' }} />
                {nurseProfile.role}
                <span style={{ margin: '0 16px' }}>•</span>
                <FaEnvelope style={{ marginRight: '8px' }} />
                {nurseProfile.email}
              </motion.div>
            </Col>
            {/* SVG bên phải welcome card */}
            <Col flex="none" md={4} className="me-5" style={{
              marginLeft: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              height: '100%',
              minWidth: 150,

            }}>
              <img
                src={MedicalExaminationFemaleSvg}
                alt="Medical Examination"
                style={{
                  maxWidth: '150px',
                  height: 'auto',
                  display: 'block'
                }}
              />
            </Col>
          </Row>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        {[
          {
            title: 'Thuốc cần uống',
            value: medicineToTake,
            icon: FaPills,
            color: 'success',
            gradient: 'linear-gradient(135deg, #A3D8A0 0%, #81C784 100%)',
            svgComponent: MedicineSvg
          },
          {
            title: 'Thuốc chờ xác nhận',
            value: pendingMedicine,
            icon: FaClock,
            color: 'warning',
            gradient: 'linear-gradient(135deg, #F5A623 0%, #FFB300 100%)',
            svgComponent: ClockSvg
          },
          {
            title: 'Lịch khám hôm nay',
            value: todayAppointments,
            icon: FaCalendarAlt,
            color: 'info',
            gradient: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)',
            svgComponent: CalendarSvg
          },
          {
            title: 'Khai báo y tế mới',
            value: newHealthDeclarations,
            icon: FaUserCheck,
            color: 'danger',
            gradient: 'linear-gradient(135deg, #E57373 0%, #F48FB1 100%)',
            svgComponent: HealthSvg
          }
        ].map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={item.title}>
            <motion.div variants={itemVariants}>
              <motion.div
                variants={cardHoverVariants}
                initial="rest"
                whileHover="hover"
              >
                <Card className={`nurse-stat-card nurse-stat-card-${item.color}`} style={{
                  border: '1px solid #e8e8e8',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <item.svgComponent />
                    </motion.div>
                    <Statistic
                      title={
                        <span className="nurse-stat-title" style={{ justifyContent: 'center' }}>
                          {item.title}
                        </span>
                      }
                      value={item.value}
                      valueStyle={{
                        background: item.gradient,
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: '32px',
                        fontWeight: 'bold'
                      }}
                    />
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Main Content - 2 Column Layout */}
      <Row gutter={[24, 24]}>
        {/* Left Column - Tables */}
        <Col xs={24} lg={14}>
          {/* Medicine Schedule */}
          <motion.div variants={itemVariants}>
            <motion.div variants={cardHoverVariants} initial="rest" whileHover="hover">
              <Card
                className="nurse-data-card"
                title={
                  <span>
                    <motion.div
                      style={{ display: 'inline-block' }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <FaPills style={{ marginRight: '12px', color: 'var(--nurse-success)' }} />
                    </motion.div>
                    Lịch cho uống thuốc
                  </span>
                }
              >
                <div className="nurse-table">
                  <CustomTable
                    columns={medicineColumns}
                    data={medicineSchedule}
                    pagination={{ pageSize: 5 }}
                    size="middle"
                  />
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Today's Appointments */}
          <motion.div variants={itemVariants}>
            <motion.div variants={cardHoverVariants} initial="rest" whileHover="hover">
              <Card
                className="nurse-data-card"
                title={
                  <span>
                    <motion.div
                      style={{ display: 'inline-block' }}
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <FaCalendarAlt style={{ marginRight: '12px', color: 'var(--nurse-warning)' }} />
                    </motion.div>
                    Lịch khám hôm nay
                  </span>
                }
              >
                <div className="nurse-table">
                  <CustomTable
                    columns={todayColumns}
                    data={todayHealthAppointments}
                    pagination={false}
                    size="middle"
                  />
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </Col>

        {/* Right Column - Charts */}
        <Col xs={24} lg={10}>
          {/* Medicine Confirmation Chart */}
          <motion.div variants={itemVariants}>
            <motion.div variants={cardHoverVariants} initial="rest" whileHover="hover">
              <Card
                className="nurse-chart-card"
                title={
                  <span>
                    <motion.div
                      style={{ display: 'inline-block' }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      <FaChartPie style={{ marginRight: '12px', color: 'var(--nurse-success)' }} />
                    </motion.div>
                    Tỉ lệ xác nhận thuốc
                  </span>
                }
              >
                <div className="nurse-chart">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <defs>
                        <linearGradient id="pieGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#00c6fb" stopOpacity="1" />
                          <stop offset="100%" stopColor="#7f53ac" stopOpacity="1" />
                        </linearGradient>
                        <linearGradient id="pieGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ffb347" stopOpacity="1" />
                          <stop offset="100%" stopColor="#ffcc33" stopOpacity="1" />
                        </linearGradient>
                      </defs>
                      <RePie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={5}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {pieData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={idx === 0 ? 'url(#pieGradient1)' : 'url(#pieGradient2)'} />
                        ))}
                      </RePie>
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--nurse-card-bg)',
                          border: '1px solid var(--nurse-border)',
                          borderRadius: '12px',
                          boxShadow: '0 8px 24px var(--nurse-shadow)',
                          fontWeight: 600
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Weekly Health Events Chart */}
          <motion.div variants={itemVariants}>
            <motion.div variants={cardHoverVariants} initial="rest" whileHover="hover">
              <Card
                className="nurse-chart-card"
                title={
                  <span>
                    <motion.div
                      style={{ display: 'inline-block' }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <FaHeartbeat style={{ marginRight: '12px', color: 'var(--nurse-danger)' }} />
                    </motion.div>
                    Sự kiện y tế trong tuần
                  </span>
                }
              >
                <div className="nurse-chart">
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={healthEventData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#F8BBD9" stopOpacity="0.8" />
                          <stop offset="50%" stopColor="#E57373" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#F48FB1" stopOpacity="0.1" />
                        </linearGradient>
                        <linearGradient id="lineGradientPink" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#F06292" />
                          <stop offset="100%" stopColor="#F8BBD9" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--nurse-border)" />
                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 12, fontWeight: 600, fill: 'var(--nurse-text-secondary)' }}
                        axisLine={{ stroke: 'var(--nurse-text-secondary)' }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 12, fontWeight: 600, fill: 'var(--nurse-text-secondary)' }}
                        axisLine={{ stroke: 'var(--nurse-text-secondary)' }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          background: 'var(--nurse-card-bg)',
                          border: '1px solid var(--nurse-border)',
                          boxShadow: '0 8px 24px var(--nurse-shadow)',
                          fontWeight: 600
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="events"
                        fill="url(#areaGradient)"
                        stroke="url(#lineGradientPink)"
                        strokeWidth={3}
                      />
                      <Line
                        type="monotone"
                        dataKey="events"
                        stroke="url(#lineGradientPink)"
                        strokeWidth={3}
                        dot={{ r: 6, fill: '#F06292', strokeWidth: 2, stroke: 'var(--nurse-card-bg)' }}
                        activeDot={{ r: 8, fill: '#F06292', strokeWidth: 3, stroke: 'var(--nurse-card-bg)' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </Col>
      </Row>
    </motion.div>
  );
};

export default Dashboard;
