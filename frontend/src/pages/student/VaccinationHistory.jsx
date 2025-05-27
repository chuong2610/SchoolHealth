import React from "react";

const vaccinationData = [
  { date: "01/01/2024", vaccine: "Vắc-xin cúm", note: "Không có phản ứng phụ" },
  { date: "15/02/2024", vaccine: "Vắc-xin sởi", note: "Đau nhẹ tại chỗ tiêm" },
  {
    date: "10/03/2024",
    vaccine: "Vắc-xin thủy đậu",
    note: "Không có phản ứng",
  },
  {
    date: "25/03/2024",
    vaccine: "Vắc-xin viêm gan B",
    note: "Mệt nhẹ sau tiêm",
  },
  {
    date: "05/04/2024",
    vaccine: "Vắc-xin bạch hầu",
    note: "Không có phản ứng",
  },
  {
    date: "20/04/2024",
    vaccine: "Vắc-xin ho gà",
    note: "Sưng nhẹ tại chỗ tiêm",
  },
  { date: "10/05/2024", vaccine: "Vắc-xin uốn ván", note: "Không có phản ứng" },
  {
    date: "22/05/2024",
    vaccine: "Vắc-xin bại liệt",
    note: "Không có phản ứng",
  },
  {
    date: "01/06/2024",
    vaccine: "Vắc-xin viêm não Nhật Bản",
    note: "Không có phản ứng",
  },
];

const checkupData = [
  { date: "10/01/2024", type: "Khám tổng quát", result: "Sức khỏe tốt" },
  { date: "20/02/2024", type: "Khám mắt", result: "Thị lực 10/10" },
  { date: "15/03/2024", type: "Khám răng miệng", result: "Có sâu răng nhỏ" },
  { date: "01/04/2024", type: "Khám tai mũi họng", result: "Bình thường" },
  { date: "18/04/2024", type: "Khám tim mạch", result: "Bình thường" },
  { date: "05/05/2024", type: "Khám da liễu", result: "Không phát hiện bệnh" },
  { date: "22/05/2024", type: "Khám tổng quát", result: "Sức khỏe tốt" },
  { date: "10/06/2024", type: "Khám mắt", result: "Cận thị nhẹ" },
  { date: "25/06/2024", type: "Khám răng miệng", result: "Không sâu răng" },
];

const VaccinationHistory = () => {
  return (
    <div
      style={{ background: "#f5f7fa", minHeight: "100vh", padding: "32px 0" }}
    >
      <div className="container" style={{ maxWidth: 1000 }}>
        <div className="d-flex align-items-center mb-4">
          <h1 className="fw-bold mb-0" style={{ fontSize: 36 }}>
            Lịch sử tiêm chủng & khám sức khỏe
          </h1>
        </div>
        <div className="card mb-4 shadow-sm border-0 rounded-4 p-4">
          <h4 className="fw-bold mb-3">Lịch sử tiêm chủng</h4>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Loại vắc-xin</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {vaccinationData.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.date}</td>
                    <td>{row.vaccine}</td>
                    <td>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card shadow-sm border-0 rounded-4 p-4">
          <h4 className="fw-bold mb-3">Lịch sử khám sức khỏe</h4>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Loại khám</th>
                  <th>Kết quả</th>
                </tr>
              </thead>
              <tbody>
                {checkupData.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.date}</td>
                    <td>{row.type}</td>
                    <td>{row.result}</td>
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

export default VaccinationHistory;
