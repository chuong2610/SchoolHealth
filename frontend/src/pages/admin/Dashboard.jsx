import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../../styles/dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [chartType, setChartType] = useState("week");
  const [isLoading, setIsLoading] = useState(false);

  const eventStatsWeek = [
    { label: "Tuần 1", value: 8 },
    { label: "Tuần 2", value: 12 },
    { label: "Tuần 3", value: 10 },
    { label: "Tuần 4", value: 5 },
  ];
  const eventStatsMonth = [
    { label: "Tháng 1", value: 25 },
    { label: "Tháng 2", value: 16 },
    { label: "Tháng 3", value: 35 },
  ];
  const medicineStats = [
    {
      type: "Thuốc",
      name: "Paracetamol 500mg",
      quantity: "100 viên",
      date: "15/03/2024",
      reason: "Sốt cao",
      user: "Nguyễn Văn A",
    },
    {
      type: "Vật tư",
      name: "Băng y tế",
      quantity: "50 cuộn",
      date: "14/03/2024",
      reason: "Té ngã",
      user: "Trần Thị B",
    },
    {
      type: "Thuốc",
      name: "ORSol",
      quantity: "200 gói",
      date: "13/03/2024",
      reason: "Tiêu chảy",
      user: "Lã Văn C",
    },
    {
      type: "Vật tư",
      name: "Khẩu trang y tế",
      quantity: "300 cái",
      date: "12/03/2024",
      reason: "Phòng dịch",
      user: "Phạm Thị D",
    },
    {
      type: "Thuốc",
      name: "Vitamin C",
      quantity: "150 viên",
      date: "11/03/2024",
      reason: "Tăng sức đề kháng",
      user: "Hoàng Văn E",
    },
  ];

  const chartData = chartType === "week" ? eventStatsWeek : eventStatsMonth;
  const chartLabel =
    chartType === "week"
      ? "Thống kê sự kiện y tế theo tuần (Tháng 3)"
      : "Thống kê sự kiện y tế theo tháng";
  const tableTitle =
    chartType === "week"
      ? "Thống kê sự kiện y tế theo tuần"
      : "Thống kê sự kiện y tế theo tháng";
  const tableCol = chartType === "week" ? "Tuần" : "Tháng";

  // Chart.js data & options
  const barData = {
    labels: chartData.map((item) => item.label),
    datasets: [
      {
        label: "Số sự kiện",
        data: chartData.map((item) => item.value),
        backgroundColor: chartType === "month" ? "#0060EF" : "#22d3a5",
        borderRadius: 8,
        maxBarThickness: 120,
        categoryPercentage: 0.6,
        barPercentage: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `Số sự kiện: ${context.parsed.y}`,
        },
      },
    },
    animation: {
      duration: 800,
      easing: "easeOutQuart",
    },
    scales: {
      x: {
        title: {
          display: true,
          text: chartType === "week" ? "Tuần" : "Tháng",
          font: { size: 14, weight: "bold" },
        },
        grid: { display: false },
        ticks: { font: { size: 14 } },
      },
      y: {
        title: {
          display: true,
          text: "Số sự kiện",
          font: { size: 14, weight: "bold" },
        },
        beginAtZero: true,
        grid: { color: "#e3e3e3" },
        ticks: { stepSize: 5, font: { size: 14 } },
      },
    },
  };

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [chartType]);

  return (
    <main className="container py-4" style={{ paddingTop: 80 }}>
      <section className="section active dashboard-bg">
        <div className="container-fluid">
          <div className="dashboard-stats row g-4 mb-4">
            <div className="col-12 col-md-4 col-lg-4 d-flex">
              <div className="stat-card stat-blue d-flex align-items-center p-4 w-100">
                <FontAwesomeIcon icon="syringe" className="stat-icon" />
                <div>
                  <div className="stat-value">
                    1,250/<span style={{ fontSize: "1.2rem" }}>1,500</span>
                  </div>
                  <div className="stat-label">Đã tiêm chủng</div>
                  <div className="stat-value">
                    1,100/<span style={{ fontSize: "1.2rem" }}>1,500</span>
                  </div>
                  <div className="stat-label">Đã khám sức khỏe</div>
                  <div className="text-muted small">
                    81.3% | 73.3% hoàn thành
                  </div>
                  <div className="text-muted small mt-1">Cập nhật: Hôm qua</div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4 col-lg-4 d-flex">
              <div className="stat-card stat-green d-flex align-items-center p-4 w-100">
                <FontAwesomeIcon
                  icon="briefcase-medical"
                  className="stat-icon"
                />
                <div>
                  <div className="stat-value">35</div>
                  <div className="stat-label">Tổng số sự kiện y tế</div>
                  <div className="mt-2">
                    <span className="badge bg-warning text-dark">
                      Chờ duyệt (15)
                    </span>
                    <span className="badge bg-success">Đã duyệt (12)</span>
                    <span className="badge bg-danger">Từ chối (8)</span>
                  </div>
                  <div className="text-muted small mt-1">Cập nhật: Hôm nay</div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4 col-lg-4 d-flex">
              <div className="stat-card stat-orange d-flex align-items-center p-4 w-100">
                <FontAwesomeIcon icon="capsules" className="stat-icon" />
                <div>
                  <div className="stat-value">
                    2,000 <span style={{ fontSize: "1.2rem" }}>viên</span>
                  </div>
                  <div className="stat-label">Thuốc đã sử dụng</div>
                  <div className="stat-value">
                    500 <span style={{ fontSize: "1.2rem" }}>đơn vị</span>
                  </div>
                  <div className="stat-label">Vật tư đã sử dụng</div>
                  <div className="text-muted small">
                    Tồn kho: 3,500 viên | 750 đơn vị
                  </div>
                  <div className="text-muted small mt-1">
                    Cập nhật: 3 ngày trước
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row g-4 align-items-start mb-4">
            <div className="col-12 col-lg-8">
              <div className="card border-0 shadow-sm p-3 mb-2 chart-card w-100">
                <div className="d-flex justify-content-end mb-2">
                  <div className="btn-group" role="group">
                    <button
                      className={`btn btn-outline-primary btn-sm${
                        chartType === "week" ? " active" : ""
                      }`}
                      onClick={() => setChartType("week")}
                      disabled={isLoading}
                    >
                      Thống kê theo tuần
                    </button>
                    <button
                      className={`btn btn-outline-primary btn-sm${
                        chartType === "month" ? " active" : ""
                      }`}
                      onClick={() => setChartType("month")}
                      disabled={isLoading}
                    >
                      Thống kê theo tháng
                    </button>
                  </div>
                </div>
                <div className="dashboard-caption fw-bold mb-2">
                  {chartLabel}
                </div>
                <div
                  style={{
                    width: "100%",
                    minHeight: 340,
                    height: 340,
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 12,
                    borderRadius: 12,
                    position: "relative",
                    opacity: isLoading ? 0.5 : 1,
                    transition: "opacity 0.3s",
                  }}
                >
                  {isLoading ? (
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <Bar data={barData} options={barOptions} height={340} />
                  )}
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-4 dashboard-side-col">
              <div className="card border-0 shadow-sm h-100 mb-3">
                <div className="card-body">
                  <h5 className="card-title">{tableTitle}</h5>
                  <table className="table table-sm mb-0">
                    <thead>
                      <tr>
                        <th>{tableCol}</th>
                        <th>Số sự kiện</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chartData.map((row, idx) => (
                        <tr key={idx}>
                          <td>{row.label}</td>
                          <td>{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          {/* Bảng thống kê thuốc & vật tư y tế đã chi ra */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="fw-bold mb-3" style={{ fontSize: "1.1rem" }}>
                Thống kê thuốc & vật tư y tế đã chi ra
              </div>
              <div className="table-responsive">
                <table
                  className="table table-bordered align-middle mb-0"
                  style={{ tableLayout: "auto" }}
                >
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "8%", minWidth: 80 }}>Loại</th>
                      <th style={{ width: "20%", minWidth: 150 }}>Tên</th>
                      <th style={{ width: "12%", minWidth: 100 }}>Số lượng</th>
                      <th style={{ width: "15%", minWidth: 120 }}>
                        Ngày sử dụng
                      </th>
                      <th style={{ width: "20%", minWidth: 120 }}>Lý do</th>
                      <th style={{ width: "15%", minWidth: 130 }}>
                        Người sử dụng
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicineStats.map((row, idx) => (
                      <tr key={idx}>
                        <td>
                          <span
                            className={`badge ${
                              row.type === "Thuốc" ? "bg-primary" : "bg-success"
                            }`}
                          >
                            {row.type}
                          </span>
                        </td>
                        <td>{row.name}</td>
                        <td>{row.quantity}</td>
                        <td>{row.date}</td>
                        <td>{row.reason}</td>
                        <td>{row.user}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
