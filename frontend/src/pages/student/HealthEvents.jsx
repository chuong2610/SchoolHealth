import React from "react";

const eventData = [
  {
    date: "01/01/2024",
    type: "Sốt",
    desc: "Sốt 38.5°C",
    action: "Đã uống thuốc hạ sốt",
  },
  {
    date: "15/01/2024",
    type: "Té ngã",
    desc: "Té ở sân trường, trầy xước nhẹ",
    action: "Sát trùng, dán băng cá nhân",
  },
  {
    date: "22/01/2024",
    type: "Đau bụng",
    desc: "Đau bụng sau giờ ăn trưa",
    action: "Được nghỉ ngơi, theo dõi tại phòng y tế",
  },
  {
    date: "05/02/2024",
    type: "Chảy máu cam",
    desc: "Chảy máu cam khi học thể dục",
    action: "Cầm máu, nghỉ ngơi",
  },
  {
    date: "18/02/2024",
    type: "Đau đầu",
    desc: "Đau đầu nhẹ, không sốt",
    action: "Uống nước, nghỉ ngơi",
  },
  {
    date: "01/03/2024",
    type: "Phản ứng dị ứng",
    desc: "Nổi mẩn đỏ sau khi ăn tôm",
    action: "Uống thuốc dị ứng, theo dõi",
  },
  {
    date: "10/03/2024",
    type: "Đau răng",
    desc: "Đau răng hàm dưới bên phải",
    action: "Khuyến nghị đi khám nha khoa",
  },
  {
    date: "20/03/2024",
    type: "Ho",
    desc: "Ho kéo dài 3 ngày",
    action: "Uống siro ho, theo dõi",
  },
  {
    date: "28/03/2024",
    type: "Đau mắt",
    desc: "Đỏ mắt, nghi ngờ viêm kết mạc",
    action: "Nhỏ thuốc mắt, nghỉ học 1 ngày",
  },
];

const eventIcons = {
  Sốt: "fas fa-thermometer-half text-danger",
  "Té ngã": "fas fa-child text-warning",
  "Đau bụng": "fas fa-stomach text-info",
  "Chảy máu cam": "fas fa-tint text-danger",
  "Đau đầu": "fas fa-head-side-virus text-secondary",
  "Phản ứng dị ứng": "fas fa-allergies text-warning",
  "Đau răng": "fas fa-tooth text-info",
  Ho: "fas fa-head-side-cough text-primary",
  "Đau mắt": "fas fa-eye text-success",
};

const HealthEvents = () => {
  return (
    <div
      style={{ background: "#f5f7fa", minHeight: "100vh", padding: "32px 0" }}
    >
      <div className="container" style={{ maxWidth: 1000 }}>
        <div className="d-flex align-items-center mb-4">
          <h1 className="fw-bold mb-0" style={{ fontSize: 36 }}>
            Lịch sử sự kiện y tế
          </h1>
        </div>
        <div className="card shadow-sm border-0 rounded-4 p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Loại sự kiện</th>
                  <th>Mô tả</th>
                  <th>Xử lý</th>
                </tr>
              </thead>
              <tbody>
                {eventData.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.date}</td>
                    <td>
                      <i
                        className={
                          eventIcons[row.type] ||
                          "fas fa-notes-medical text-secondary"
                        }
                        style={{ marginRight: 8 }}
                      ></i>
                      {row.type}
                    </td>
                    <td>{row.desc}</td>
                    <td>{row.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthEvents;
