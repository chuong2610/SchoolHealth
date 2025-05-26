import React from "react";
import { Link } from "react-router-dom";

const NurseDashboard = () => {
  return (
    <div
      style={{ background: "#f5f7fa", minHeight: "100vh", padding: "32px 0" }}
    >
      <div className="container">
        {/* Chào mừng */}
        <div className="mb-4">
          <h2 className="fw-bold" style={{ fontSize: 32 }}>
            Xin chào, <span className="text-primary">Nguyễn Thị B</span>
          </h2>
          <div className="text-muted" style={{ fontSize: 18 }}>
            Đây là tổng quan về tình hình y tế học đường
          </div>
        </div>
        {/* Thẻ thống kê */}
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="stat-card d-flex align-items-center p-3 h-100">
              <div className="stat-icon bg-primary text-white me-3">
                <i className="fas fa-users fa-lg"></i>
              </div>
              <div>
                <div className="stat-number">150</div>
                <div className="stat-label">Học sinh</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card d-flex align-items-center p-3 h-100">
              <div className="stat-icon bg-success text-white me-3">
                <i className="fas fa-pills fa-lg"></i>
              </div>
              <div>
                <div className="stat-number">12</div>
                <div className="stat-label">Thuốc cần cho uống</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card d-flex align-items-center p-3 h-100">
              <div className="stat-icon bg-warning text-white me-3">
                <i className="fas fa-calendar-check fa-lg"></i>
              </div>
              <div>
                <div className="stat-number">5</div>
                <div className="stat-label">Lịch khám hôm nay</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card d-flex align-items-center p-3 h-100">
              <div className="stat-icon bg-info text-white me-3">
                <i className="fas fa-file-medical fa-lg"></i>
              </div>
              <div>
                <div className="stat-number">8</div>
                <div className="stat-label">Khai báo y tế mới</div>
              </div>
            </div>
          </div>
        </div>
        {/* Công việc cần làm & Lịch khám hôm nay */}
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 mb-4 p-0">
              <div className="card-header bg-white border-0 pb-0 px-4 pt-4">
                <h5 className="fw-bold mb-0">Công việc cần làm</h5>
              </div>
              <div className="card-body pt-3 pb-4 px-4">
                <Link
                  to="/nurse/receive-medicine"
                  className="text-decoration-none"
                >
                  <div className="work-item d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center">
                      <span className="work-icon bg-success text-white me-3">
                        <i className="fas fa-pills fa-lg"></i>
                      </span>
                      <div>
                        <div className="fw-semibold">Cho uống thuốc</div>
                        <div className="text-muted small">
                          Nguyễn Văn A - Lớp 5A - Paracetamol
                        </div>
                        <div className="text-muted small">08:00 - 08:30</div>
                      </div>
                    </div>
                    <span
                      className="badge rounded-pill bg-success px-3 py-2"
                      style={{ fontSize: 15 }}
                    >
                      <i className="fas fa-check me-1"></i>Hoàn thành
                    </span>
                  </div>
                </Link>
                <Link
                  to="/nurse/health-events"
                  className="text-decoration-none"
                >
                  <div className="work-item d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center">
                      <span className="work-icon bg-primary text-white me-3">
                        <i className="fas fa-stethoscope fa-lg"></i>
                      </span>
                      <div>
                        <div className="fw-semibold">Khám sức khỏe</div>
                        <div className="text-muted small">
                          Lớp 3B - Khám định kỳ
                        </div>
                        <div className="text-muted small">09:00 - 10:30</div>
                      </div>
                    </div>
                    <span
                      className="badge rounded-pill bg-primary px-3 py-2"
                      style={{ fontSize: 15 }}
                    >
                      <i className="fas fa-play me-1"></i>Bắt đầu
                    </span>
                  </div>
                </Link>
                <Link
                  to="/nurse/health-declaration"
                  className="text-decoration-none"
                >
                  <div className="work-item d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <span className="work-icon bg-warning text-white me-3">
                        <i className="fas fa-file-medical fa-lg"></i>
                      </span>
                      <div>
                        <div className="fw-semibold">
                          Kiểm tra khai báo y tế
                        </div>
                        <div className="text-muted small">
                          8 khai báo mới cần xác nhận
                        </div>
                        <div className="text-muted small">Trong ngày</div>
                      </div>
                    </div>
                    <span
                      className="badge rounded-pill bg-warning text-dark px-3 py-2"
                      style={{ fontSize: 15 }}
                    >
                      <i className="fas fa-eye me-1"></i>Xem
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 mb-4 p-0">
              <div className="card-header bg-white border-0 pb-0 px-4 pt-4">
                <h5 className="fw-bold mb-0">Lịch khám hôm nay</h5>
              </div>
              <div className="card-body pt-3 pb-4 px-4">
                <Link
                  to="/nurse/health-events"
                  className="text-decoration-none"
                >
                  <div className="exam-item d-flex align-items-center mb-3">
                    <span className="exam-time bg-info bg-opacity-10 text-primary fw-bold me-3">
                      08:00
                    </span>
                    <div>
                      <div className="fw-semibold">Nguyễn Văn A</div>
                      <div className="text-muted small">
                        Lớp 5A - Khám thường
                      </div>
                    </div>
                  </div>
                </Link>
                <Link
                  to="/nurse/health-events"
                  className="text-decoration-none"
                >
                  <div className="exam-item d-flex align-items-center mb-3">
                    <span className="exam-time bg-info bg-opacity-10 text-primary fw-bold me-3">
                      09:00
                    </span>
                    <div>
                      <div className="fw-semibold">Lớp 3B</div>
                      <div className="text-muted small">Khám định kỳ</div>
                    </div>
                  </div>
                </Link>
                <Link
                  to="/nurse/health-events"
                  className="text-decoration-none"
                >
                  <div className="exam-item d-flex align-items-center">
                    <span className="exam-time bg-info bg-opacity-10 text-primary fw-bold me-3">
                      14:00
                    </span>
                    <div>
                      <div className="fw-semibold">Trần Thị B</div>
                      <div className="text-muted small">Lớp 4C - Tái khám</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Custom CSS cho giống bản gốc */}
        <style>{`
          .stat-card {
            background: #fff;
            border-radius: 18px;
            box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
            min-height: 100px;
          }
          .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
          }
          .stat-number {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 2px;
          }
          .stat-label {
            color: #6c757d;
            font-size: 1rem;
            font-weight: 500;
          }
          .work-item {
            background: #f7f9fb;
            border-radius: 14px;
            padding: 18px 20px;
            transition: background 0.2s;
            margin-bottom: 16px;
          }
          .work-item:last-child { margin-bottom: 0; }
          .work-item:hover {
            background: #e9f3ff;
            cursor: pointer;
          }
          .work-icon {
            width: 44px;
            height: 44px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
          }
          .exam-item {
            background: #f7f9fb;
            border-radius: 14px;
            padding: 18px 20px;
            margin-bottom: 16px;
            transition: background 0.2s;
          }
          .exam-item:last-child { margin-bottom: 0; }
          .exam-item:hover {
            background: #e9f3ff;
            cursor: pointer;
          }
          .exam-time {
            min-width: 64px;
            text-align: center;
            border-radius: 8px;
            font-size: 1.25rem;
            padding: 6px 0;
            display: inline-block;
          }
        `}</style>
      </div>
    </div>
  );
};

export default NurseDashboard;
