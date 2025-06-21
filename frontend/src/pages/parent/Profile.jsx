import React from "react";
import "../../styles/parent-theme.css";

const parentInfo = {
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  name: "Nguyễn Văn B",
  code: "PH001",
  email: "nguyenvanb@gmail.com",
  phone: "0912 345 678",
  address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
  dob: "15/05/1980",
  gender: "Nam",
  role: "Phụ huynh",
  children: [
    {
      name: "Nguyễn Văn C",
      class: "10A1",
      id: "HS001",
    },
  ],
};

const Profile = () => {
  return (
    <div className="parent-bg-img parent-theme" style={{ minHeight: "00vh", padding: "20px 0" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div className="parent-card" style={{ borderRadius: 24, boxShadow: "0 4px 24px rgba(56,182,255,0.10)", padding: 36, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
            <img
              src={parentInfo.avatar}
              alt="Avatar"
              style={{
                width: 120,
                height: 120,
                objectFit: "cover",
                borderRadius: "50%",
                border: "5px solid #e5e7eb",
                marginBottom: 12,
                boxShadow: "0 2px 12px rgba(56,182,255,0.12)"
              }}
            />
            <div style={{ fontWeight: 800, fontSize: 28, color: "#1a365d", marginBottom: 6, textAlign: "center" }}>{parentInfo.name}</div>
            <span style={{ background: "#2563eb", color: "#fff", borderRadius: 10, padding: "4px 18px", fontWeight: 600, fontSize: 16, marginBottom: 8, display: "inline-block" }}>
              Vai trò: {parentInfo.role}
            </span>
            <button
              className="parent-btn"
              style={{ borderRadius: 10, fontWeight: 600, fontSize: 16, marginBottom: 0, marginTop: 2, padding: "8px 28px", background: "#2563eb" }}
              disabled
            >
              <i className="fas fa-edit" style={{ marginRight: 8 }}></i>Chỉnh sửa
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
            <div style={{ flex: "1 1 50%", minWidth: 200, marginBottom: 18 }}>
              <div style={{ color: "#888", fontWeight: 600, fontSize: 15, marginBottom: 2 }}><i className="fas fa-envelope" style={{ marginRight: 7 }}></i>Email:</div>
              <div style={{ fontWeight: 500, color: "#1a365d" }}>{parentInfo.email}</div>
            </div>
            <div style={{ flex: "1 1 50%", minWidth: 200, marginBottom: 18 }}>
              <div style={{ color: "#888", fontWeight: 600, fontSize: 15, marginBottom: 2 }}><i className="fas fa-phone" style={{ marginRight: 7 }}></i>Số điện thoại:</div>
              <div style={{ fontWeight: 500, color: "#1a365d" }}>{parentInfo.phone}</div>
            </div>
            <div style={{ flex: "1 1 50%", minWidth: 200, marginBottom: 18 }}>
              <div style={{ color: "#888", fontWeight: 600, fontSize: 15, marginBottom: 2 }}><i className="fas fa-map-marker-alt" style={{ marginRight: 7 }}></i>Địa chỉ:</div>
              <div style={{ fontWeight: 500, color: "#1a365d" }}>{parentInfo.address}</div>
            </div>
            <div style={{ flex: "1 1 50%", minWidth: 200, marginBottom: 18 }}>
              <div style={{ color: "#888", fontWeight: 600, fontSize: 15, marginBottom: 2 }}><i className="fas fa-birthday-cake" style={{ marginRight: 7 }}></i>Ngày sinh:</div>
              <div style={{ fontWeight: 500, color: "#1a365d" }}>{parentInfo.dob}</div>
            </div>
            <div style={{ flex: "1 1 50%", minWidth: 200, marginBottom: 18 }}>
              <div style={{ color: "#888", fontWeight: 600, fontSize: 15, marginBottom: 2 }}><i className="fas fa-venus-mars" style={{ marginRight: 7 }}></i>Giới tính:</div>
              <div style={{ fontWeight: 500, color: "#1a365d" }}>{parentInfo.gender}</div>
            </div>
            <div style={{ flex: "1 1 50%", minWidth: 200, marginBottom: 18 }}>
              <div style={{ color: "#888", fontWeight: 600, fontSize: 15, marginBottom: 2 }}><i className="fas fa-id-card" style={{ marginRight: 7 }}></i>Mã phụ huynh:</div>
              <div style={{ fontWeight: 500, color: "#1a365d" }}>{parentInfo.code}</div>
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: "#2563eb", marginBottom: 10 }}>Học sinh liên quan</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {parentInfo.children.map((child, idx) => (
                <li key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f0f5ff", borderRadius: 10, padding: "10px 18px", marginBottom: 8, boxShadow: "0 2px 8px rgba(56,182,255,0.06)" }}>
                  <span style={{ fontWeight: 500, color: "#1a365d" }}>
                    <i className="fas fa-user-graduate" style={{ marginRight: 8, color: "#2563eb" }}></i>
                    {child.name} ({child.class})
                  </span>
                  <span style={{ background: "#38b6ff", color: "#fff", borderRadius: 8, padding: "4px 14px", fontWeight: 600, fontSize: 15 }}>{child.id}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
