import React from "react";

const notifications = [
  {
    title: "Thông báo khám sức khỏe định kỳ",
    date: "3 ngày trước",
    content: "Lịch khám sức khỏe định kỳ sẽ được tổ chức vào ngày 15/01/2024.",
  },
  {
    title: "Nhắc nhở tiêm chủng",
    date: "5 ngày trước",
    content: "Bạn cần hoàn thành mũi tiêm vắc-xin sởi vào ngày 20/02/2024.",
  },
  {
    title: "Thông báo nghỉ học",
    date: "1 tuần trước",
    content: "Trường sẽ nghỉ học vào ngày 30/04 và 01/05.",
  },
  {
    title: "Cập nhật hồ sơ sức khỏe",
    date: "2 tuần trước",
    content: "Vui lòng cập nhật thông tin sức khỏe cá nhân trong tháng này.",
  },
  {
    title: "Kết quả khám răng miệng",
    date: "3 tuần trước",
    content: "Bạn có sâu răng nhỏ, nên đi khám nha khoa sớm.",
  },
  {
    title: "Thông báo phòng chống dịch",
    date: "1 tháng trước",
    content: "Hãy rửa tay thường xuyên và đeo khẩu trang khi đến trường.",
  },
  {
    title: "Nhắc nhở uống thuốc",
    date: "1 tháng trước",
    content: "Đừng quên uống thuốc dị ứng vào buổi sáng.",
  },
  {
    title: "Thông báo kiểm tra thị lực",
    date: "2 tháng trước",
    content: "Bạn sẽ được kiểm tra thị lực vào ngày 10/06/2024.",
  },
  {
    title: "Thông báo tiêm phòng cúm",
    date: "2 tháng trước",
    content: "Lịch tiêm phòng cúm sẽ diễn ra vào ngày 01/01/2024.",
  },
];

const Notifications = () => {
  return (
    <div
      style={{ background: "#f5f7fa", minHeight: "100vh", padding: "32px 0" }}
    >
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="d-flex align-items-center mb-4">
          <h1 className="fw-bold mb-0" style={{ fontSize: 36 }}>
            Thông báo
          </h1>
        </div>
        <div className="list-group">
          {notifications.map((item, idx) => (
            <div key={idx} className="list-group-item">
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1 fw-bold">{item.title}</h5>
                <small>{item.date}</small>
              </div>
              <p className="mb-1">{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
