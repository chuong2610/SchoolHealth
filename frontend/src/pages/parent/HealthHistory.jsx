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
    </div>
  );
};

export default HealthHistory;
