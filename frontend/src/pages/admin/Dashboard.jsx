import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Avatar } from "antd";
import {
  BarChart,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Area,
  AreaChart,
  PieChart,
  Pie,
  ResponsiveContainer,
  Legend,
  Bar,
} from 'recharts';

import { motion } from "framer-motion";
import { FaHeartbeat, FaPills } from "react-icons/fa";
import FaceKissSvg from "../../assets/face-kiss.svg";
import Hc21SLm from "../../assets/Hc21SLm.png";
import StudyStudentSvg from "../../assets/study-student-svgrepo-com.svg";
import FamilyMotherSvg from "../../assets/family-mother-svgrepo-com.svg";
import NurseSvg from "../../assets/a-woman-in-a-white-coat-pointing-a-finger-svgrepo-com.svg";
import AdminSvg from "../../assets/administrator-work-svgrepo-com.svg";
import AnhDaiDien from "../../assets/AnhDaiDien.jpg";


const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};
const COLORS = ["#00c6fb", "#43e97b", "#7f53ac", "#647dee"];

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [healthEventData, setHealthEventData] = useState([]);
  const [medicineBarData, setMedicineBarData] = useState([]);
  const [medicalSuppliesData, setMedicalSuppliesData] = useState([]);
  const [medicationsData, setMedicationsData] = useState([]);
  const [notificationsData, setNotificationsData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5182/api/Home/admin")
      .then(response => {
        const data = response.data.data;
        setDashboardData({
          numberOfStudents: data.numberOfStudents,
          numberOfParents: data.numberOfParents,
          numberOfNurses: data.numberOfNurses,
          numberOfAdmins: 1, // nếu có field numberOfAdmins thì thay bằng data.numberOfAdmins
        });



        const medicineBarData = [
          {
            name: "Đang xử lý",
            value: data.pendingMedicationsNumber,
            gradient: "url(#blueGreen)",
          },
          {
            name: "Đang sử dụng",
            value: data.activeMedicationsNumber,
            gradient: "url(#purpleBlue)",
          },
          {
            name: "Hoàn thành",
            value: data.completedMedicationsNumber,
            gradient: "url(#orangeYellow)",
          }
        ];
        setMedicineBarData(medicineBarData);

        // Define all days of the week in order
        const DAYS_OF_WEEK = [
          "T2", "T3", "T4", "T5", "T6", "T7", "CN"
        ];

        // Define the corresponding API day names
        const API_DAY_NAMES = [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
        ];

        // Create a mapping from API day names to chart day names
        const dayApiToChartMap = {};
        for (let i = 0; i < API_DAY_NAMES.length; i++) {
          dayApiToChartMap[API_DAY_NAMES[i]] = DAYS_OF_WEEK[i];
        }

        // Initialize healthEventData with all days and 0 values
        const initialHealthEventData = DAYS_OF_WEEK.map(day => ({
          week: day,
          value: 0
        }));

        // Populate with fetched data
        if (data.weeklyMedicalEventCounts) {
          Object.entries(data.weeklyMedicalEventCounts).forEach(([apiDayName, count]) => {
            const chartDayName = dayApiToChartMap[apiDayName];
            if (chartDayName) {
              const index = initialHealthEventData.findIndex(item => item.week === chartDayName);
              if (index !== -1) {
                initialHealthEventData[index].value = Math.max(0, parseInt(count, 10));
              }
            }
          });
        }
        setHealthEventData(initialHealthEventData);

        // Process Medical Supplies data from API
        if (data.medicalSupplies && Array.isArray(data.medicalSupplies)) {
          const suppliesForChart = data.medicalSupplies.map((supply, index) => ({
            name: supply.name,
            value: supply.quantity,
            fill: `url(#gradient${index})`
          }));
          setMedicalSuppliesData(suppliesForChart);
        }

        // Process Medications data from API
        if (data.medications && Array.isArray(data.medications)) {
          // Filter only pending medications and sort by latest date
          const pendingMedications = data.medications
            .filter(med => med.status === 'Active' || med.status === 'Pending') // Filter only active/pending medications
            .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)); // Sort by latest date
          setMedicationsData(pendingMedications);
        }

        // Process Notifications data from API
        if (data.notifications && Array.isArray(data.notifications)) {
          setNotificationsData(data.notifications);
        }

      })
      .catch(error => {
        console.error('Error fetching dashboard data:', error);
        // Set default values if API fails
        setMedicalSuppliesData([
          { name: "Bandages", value: 100, fill: 'url(#gradient0)' },
          { name: "Antiseptic Wipes", value: 50, fill: 'url(#gradient1)' },
          { name: "Gauze Pads", value: 75, fill: 'url(#gradient2)' }
        ]);
      });


  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="dashboard-container"
    >
      {/* VÙNG 1: Admin Welcome Panel */}
      <Row gutter={[24, 24]} className="mb-4">
        <Col xs={24} md={24}>
          <motion.div variants={itemVariants} className="welcome-section d-flex flex-column flex-md-row align-items-center justify-content-between p-4">
            <div className="d-flex flex-column flex-md-row align-items-center mb-4 mb-md-0">
              <Avatar
                size={80}
                src={AnhDaiDien} /* Using AnhDaiDien for the main profile picture */
                className="me-4 welcome-avatar d-flex align-items-center justify-content-center"
                style={{ border: '3px solid var(--accent-yellow)' }}
              />
              <div className="text-center text-md-start">
                <h2 className="fw-bold mb-1">Welcome back, Nguyễn Thiên Ân!</h2>
                <p className="mb-0 fs-6">Here's what's happening with your school today.</p>
                <p className="mt-1 mb-0" style={{ fontSize: 16, color: 'var(--accent-yellow)', fontWeight: 800 }}>Quản trị viên</p>
              </div>
            </div>
            <img src={Hc21SLm} alt="Welcome" className="welcome-illustration ms-0 ms-md-4" style={{ maxWidth: '250px', height: 'auto' }} />
          </motion.div>
        </Col>
      </Row>

      {/* VÙNG 2: Chỉ số tổng quan (School Metrics) */}
      <Row gutter={[24, 24]} className="mb-4">
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <div className="student-card h-100 d-flex flex-column align-items-center justify-content-center text-center"
              style={{ background: 'var(--student-bg)', border: '1px solid var(--student-border)' }}>
              <div className="mb-2 rounded-circle p-3 d-flex align-items-center justify-content-center animated-icon">
                <img src={StudyStudentSvg} alt="Student" style={{ width: 64, height: 64 }} />
              </div>
              <div className="fw-bold fs-4">{dashboardData.numberOfStudents}</div>
              <div className="fs-6">Học sinh</div>
            </div>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <div className="parent-card h-100 d-flex flex-column align-items-center justify-content-center text-center"
              style={{ background: 'var(--parent-bg)', border: '1px solid var(--parent-border)' }}>
              <div className="mb-2 rounded-circle p-3 d-flex align-items-center justify-content-center animated-icon">
                <img src={FamilyMotherSvg} alt="Parent" style={{ width: 64, height: 64 }} />
              </div>
              <div className="fw-bold fs-4">{dashboardData.numberOfParents}</div>
              <div className="fs-6">Phụ huynh</div>
            </div>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <div className="nurse-card h-100 d-flex flex-column align-items-center justify-content-center text-center"
              style={{ background: 'var(--nurse-bg)', border: '1px solid var(--nurse-border)' }}>
              <div className="mb-2 rounded-circle p-3 d-flex align-items-center justify-content-center animated-icon">
                <img src={NurseSvg} alt="Nurse" style={{ width: 64, height: 64 }} />
              </div>
              <div className="fw-bold fs-4">{dashboardData.numberOfNurses}</div>
              <div className="fs-6">Y tá</div>
            </div>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <div className="admin-card h-100 d-flex flex-column align-items-center justify-content-center text-center"
              style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)' }}>
              <div className="mb-2 rounded-circle p-3 d-flex align-items-center justify-content-center animated-icon">
                <img src={AdminSvg} alt="Admin" style={{ width: 64, height: 64 }} />
              </div>
              <div className="fw-bold fs-4">{dashboardData.numberOfAdmins}</div>
              <div className="fs-6">Quản trị viên</div>
            </div>
          </motion.div>
        </Col>
      </Row>

      {/* VÙNG 3: Dynamic Information */}
      <Row gutter={[24, 24]} className="mb-4">
        {/* Medical Supplies Chart */}
        <Col xs={24} lg={8}>
          <motion.div variants={itemVariants}>
            <div className="notice-card h-100"
              style={{ background: 'var(--notice-bg)', border: '1px solid var(--notice-border)' }}>
              <div className="card-header bg-transparent border-0 d-flex flex-column align-items-center justify-content-start">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', alignSelf: 'flex-start' }}>
                  <FaHeartbeat style={{ marginRight: '8px', color: 'var(--primary-blue)' }} />
                  <span className="fw-bold fs-5">🏥 Vật tư y tế</span>
                </div>
                <h6 className="text-center text-muted mb-3" style={{ fontSize: '0.9rem', alignSelf: 'flex-start', }}>Kiểm kê vật tư y tế</h6>
              </div>
              <div className="card-body d-flex justify-content-center align-items-center" style={{ height: 250, padding: '0 10px' }}>
                <div style={{ width: '100%', maxWidth: 300 }}>
                  <ResponsiveContainer width="100%" height={250} minWidth={250}>
                    <PieChart>
                      <defs>
                        <linearGradient id="gradient0" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FF6B6B" stopOpacity="1" />
                          <stop offset="50%" stopColor="#FF8E8E" stopOpacity="1" />
                          <stop offset="100%" stopColor="#FF5252" stopOpacity="1" />
                        </linearGradient>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#4ECDC4" stopOpacity="1" />
                          <stop offset="50%" stopColor="#6FE3DB" stopOpacity="1" />
                          <stop offset="100%" stopColor="#40C4FF" stopOpacity="1" />
                        </linearGradient>
                        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#45B7D1" stopOpacity="1" />
                          <stop offset="50%" stopColor="#73C7E8" stopOpacity="1" />
                          <stop offset="100%" stopColor="#1DE9B6" stopOpacity="1" />
                        </linearGradient>
                        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#96CEB4" stopOpacity="1" />
                          <stop offset="50%" stopColor="#B5DBC8" stopOpacity="1" />
                          <stop offset="100%" stopColor="#66BB6A" stopOpacity="1" />
                        </linearGradient>
                        <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FFEAA7" stopOpacity="1" />
                          <stop offset="50%" stopColor="#FFF2C7" stopOpacity="1" />
                          <stop offset="100%" stopColor="#FFEB3B" stopOpacity="1" />
                        </linearGradient>
                        <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#DDA0DD" stopOpacity="1" />
                          <stop offset="50%" stopColor="#E6B8E6" stopOpacity="1" />
                          <stop offset="100%" stopColor="#BA68C8" stopOpacity="1" />
                        </linearGradient>
                      </defs>
                      <Pie
                        data={medicalSuppliesData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ value }) => `${value}`}
                      >
                        {medicalSuppliesData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.fill || `url(#gradient${index % 6})`}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #ccc',
                          borderRadius: '8px',
                          fontSize: '12px',
                          padding: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                        formatter={(value, name) => [`${value} items`, name]}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value) => <span style={{ color: 'var(--text-primary)', fontSize: '12px', fontWeight: '500' }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        </Col>

        {/* Weekly Health Events */}
        <Col xs={24} lg={8}>
          <motion.div variants={itemVariants}>
            <div className="event-card h-100"
              style={{ background: 'var(--event-bg)', border: '1px solid var(--event-border)' }}>
              <div className="card-header bg-transparent border-0 d-flex flex-column align-items-center justify-content-start">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', alignSelf: 'flex-start' }}>
                  <FaHeartbeat style={{ marginRight: '8px', color: 'var(--primary-blue)' }} />
                  <span className="fw-bold fs-5">📊 Sự kiện y tế</span>
                </div>
                <h6 className="text-center text-muted mb-3" style={{ fontSize: '0.9rem', alignSelf: 'flex-start' }}>Thống kê sự kiện y tế theo tuần</h6>
              </div>
              <div className="card-body w-100 d-flex justify-content-center align-items-center" style={{ height: 250, padding: '0 10px' }}>
                <div style={{ width: '100%', maxWidth: 360 }}>
                  <ResponsiveContainer width="100%" height={250} minWidth={280}>
                    <LineChart data={healthEventData} margin={{ top: 10, right: 10, left: -35, bottom: 10 }}>
                      <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#baff39" />
                          <stop offset="100%" stopColor="#00ffea" />
                        </linearGradient>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#baff39" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#00ffea" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>

                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="week"
                        interval={0}
                        tick={{
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          textAnchor: 'middle'
                        }}
                        axisLine={{ stroke: '#ccc' }}
                        tickLine={{ stroke: '#ccc' }}
                      />
                      <YAxis
                        tick={{
                          fontWeight: 600,
                          fontSize: '0.8rem'
                        }}
                        axisLine={{ stroke: '#ccc' }}
                        tickLine={{ stroke: '#ccc' }}
                        allowDecimals={false}
                        tickFormatter={(value) => Math.floor(value)}
                      />
                      <Tooltip
                        contentStyle={{
                          fontSize: '0.8rem',
                          padding: '8px 12px',
                          borderRadius: '8px'
                        }}
                      />
                      <Area type="monotone" dataKey="value" fill="url(#areaGradient)" stroke="none" />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="url(#lineGradient)"
                        strokeWidth={4}
                        dot={{ r: 6, fill: '#fff', stroke: '#baff39', strokeWidth: 2 }}
                        activeDot={{ r: 8, fill: '#00ffea', stroke: '#fff', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        </Col>

        {/* Medication Insights */}
        <Col xs={24} lg={8}>
          <motion.div variants={itemVariants}>
            <div className="medication-card h-100"
              style={{ background: 'var(--medication-bg)', border: '1px solid var(--medication-border)' }}>
              <div className="card-header bg-transparent border-0 d-flex flex-column align-items-center justify-content-start">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', alignSelf: 'flex-start' }}>
                  <FaPills style={{ marginRight: '8px', color: 'var(--primary-blue)' }} />
                  <span className="fw-bold fs-5">💊 Biểu đồ gửi thuốc</span>
                </div>
                <h6 className="text-center text-muted mb-3" style={{ fontSize: '0.9rem', alignSelf: 'flex-start' }}>Thống kê số lượng thuốc theo trạng thái</h6>
              </div>
              <div className="card-body w-100 d-flex justify-content-center align-items-center" style={{ height: 250, padding: '0 10px' }}>
                <div style={{ width: '100%', maxWidth: 360 }}>
                  <ResponsiveContainer width="100%" height={250} minWidth={280}>
                    <BarChart
                      data={medicineBarData}
                      barCategoryGap="15%"
                      margin={{ top: 10, right: 20, left: -25, bottom: 10 }}
                    >
                      <defs>
                        <linearGradient id="blueGreen" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00c6fb" />
                          <stop offset="100%" stopColor="#43e97b" />
                        </linearGradient>
                        <linearGradient id="purpleBlue" x1="0" y1="0" x2="0" y2="1" >
                          <stop offset="0%" stopColor="#7f53ac" />
                          <stop offset="100%" stopColor="#647dee" />
                        </linearGradient>
                        <linearGradient id="orangeYellow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f7971e" />
                          <stop offset="100%" stopColor="#ffd200" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        interval={0}
                        tick={{
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          textAnchor: 'middle'
                        }}
                        axisLine={{ stroke: '#ccc' }}
                        tickLine={{ stroke: '#ccc' }}
                      />
                      <YAxis
                        tick={{
                          fontWeight: 600,
                          fontSize: '0.8rem'
                        }}
                        axisLine={{ stroke: '#ccc' }}
                        tickLine={{ stroke: '#ccc' }}
                        allowDecimals={false}
                        tickFormatter={(value) => Math.floor(value)}
                      />
                      <Tooltip
                        contentStyle={{
                          fontSize: '0.8rem',
                          padding: '8px 12px',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="value">
                        {medicineBarData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.gradient} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        </Col>
      </Row>

      {/* VÙNG 4: Data Tables */}
      <Row gutter={[24, 24]} className="mb-4">
        {/* Medications Table */}
        <Col xs={24} lg={12}>
          <motion.div variants={itemVariants}>
            <div className="medication-card h-100"
              style={{ background: 'var(--medication-bg)', border: '1px solid var(--medication-border)' }}>
              <div className="card-header bg-transparent border-0 d-flex flex-column align-items-center justify-content-start">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', alignSelf: 'flex-start' }}>
                  <FaPills style={{ marginRight: '8px', color: 'var(--primary-blue)' }} />
                  <span className="fw-bold fs-5">💊 Danh sách thuốc</span>
                </div>
                <h6 className="text-center text-muted mb-3" style={{ fontSize: '0.9rem', alignSelf: 'flex-start' }}>
                  Thuốc chờ uống - Ngày gần nhất
                </h6>
              </div>
              <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto', padding: '0 1rem' }}>
                {medicationsData && medicationsData.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table dashboard-table table-sm table-hover align-middle mb-0">
                      <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--medication-bg)', zIndex: 1 }}>
                        <tr>
                          <th style={{ fontSize: '12px', padding: '8px' }}>ID</th>
                          <th style={{ fontSize: '12px', padding: '8px' }}>Học sinh</th>
                          <th style={{ fontSize: '12px', padding: '8px' }}>Lớp</th>
                          <th style={{ fontSize: '12px', padding: '8px' }}>Trạng thái</th>
                          <th style={{ fontSize: '12px', padding: '8px' }}>Ngày tạo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {medicationsData.slice(0, 10).map((medication) => (
                          <tr key={medication.id}>
                            <td style={{ fontSize: '11px', padding: '6px 8px' }}>{medication.id}</td>
                            <td style={{ fontSize: '11px', padding: '6px 8px' }}>{medication.studentName}</td>
                            <td style={{ fontSize: '11px', padding: '6px 8px' }}>{medication.studentClassName}</td>
                            <td style={{ fontSize: '11px', padding: '6px 8px' }}>
                              <span
                                className={`badge ${medication.status === 'Active' ? 'bg-warning' :
                                  medication.status === 'Pending' ? 'bg-primary' :
                                    medication.status === 'Completed' ? 'bg-success' :
                                      medication.status === 'Rejected' ? 'bg-danger' : 'bg-secondary'
                                  }`}
                                style={{ fontSize: '10px' }}
                              >
                                {medication.status === 'Active' ? 'Chờ uống' :
                                  medication.status === 'Pending' ? 'Chờ xử lý' :
                                    medication.status === 'Completed' ? 'Hoàn thành' :
                                      medication.status === 'Rejected' ? 'Từ chối' :
                                        medication.status}
                              </span>
                            </td>
                            <td style={{ fontSize: '11px', padding: '6px 8px' }}>
                              {new Date(medication.createdDate).toLocaleDateString('vi-VN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="d-flex align-items-center justify-content-center" style={{ height: 200 }}>
                    <p className="text-muted">No medications data available</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </Col>

        {/* Notifications Table */}
        <Col xs={24} lg={12}>
          <motion.div variants={itemVariants}>
            <div className="notice-card h-100"
              style={{ background: 'var(--notice-bg)', border: '1px solid var(--notice-border)' }}>
              <div className="card-header bg-transparent border-0 d-flex flex-column align-items-center justify-content-start">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', alignSelf: 'flex-start' }}>
                  <FaHeartbeat style={{ marginRight: '8px', color: 'var(--primary-blue)' }} />
                  <span className="fw-bold fs-5">📋 Thông báo</span>
                </div>
                <h6 className="text-center text-muted mb-3" style={{ fontSize: '0.9rem', alignSelf: 'flex-start' }}>
                  Health notifications and announcements
                </h6>
              </div>
              <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto', padding: '0 1rem' }}>
                {notificationsData && notificationsData.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table dashboard-table table-sm table-hover align-middle mb-0">
                      <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--notice-bg)', zIndex: 1 }}>
                        <tr>
                          <th style={{ fontSize: '12px', padding: '8px' }}>Tiêu đề</th>
                          <th style={{ fontSize: '12px', padding: '8px' }}>Ngày tạo</th>
                          <th style={{ fontSize: '12px', padding: '8px' }}>Chờ</th>
                          <th style={{ fontSize: '12px', padding: '8px' }}>Xác nhận</th>
                          <th style={{ fontSize: '12px', padding: '8px' }}>Từ chối</th>
                        </tr>
                      </thead>
                      <tbody>
                        {notificationsData.map((notification, index) => (
                          <tr key={index}>
                            <td style={{ fontSize: '11px', padding: '6px 8px', fontWeight: '600' }}>
                              {notification.title}
                            </td>
                            <td style={{ fontSize: '11px', padding: '6px 8px' }}>
                              {new Date(notification.createdDate).toLocaleDateString('vi-VN')}
                            </td>
                            <td style={{ fontSize: '11px', padding: '6px 8px', textAlign: 'center' }}>
                              <span className="badge bg-warning text-dark" style={{ fontSize: '10px', fontWeight: 'bold' }}>
                                {notification.pendingCount || 0}
                              </span>
                            </td>
                            <td style={{ fontSize: '11px', padding: '6px 8px', textAlign: 'center' }}>
                              <span className="badge bg-success" style={{ fontSize: '10px', fontWeight: 'bold' }}>
                                {notification.confirmedCount || 0}
                              </span>
                            </td>
                            <td style={{ fontSize: '11px', padding: '6px 8px', textAlign: 'center' }}>
                              <span className="badge bg-danger" style={{ fontSize: '10px', fontWeight: 'bold' }}>
                                {notification.rejectedCount || 0}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="d-flex align-items-center justify-content-center" style={{ height: 200 }}>
                    <p className="text-muted">No notifications available</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </Col>
      </Row>

    </motion.div>
  );
};

export default Dashboard;
