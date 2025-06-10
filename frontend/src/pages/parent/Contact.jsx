import React, { useState } from "react";
import { Link } from "react-router-dom";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    // ở đây sử lí dữ liệu (có API thì gọi ở đây)
    console.log("Form submitted", formData);
    // Reset form sau khi gửi
    setFormData({ name: "", email: "", message: "" });
    alert("Tin nhắn đã được gửi! Chúng tôi sẽ phản hồi sớm.");
  };

  return (
    <div className="container py-5">
      {/**Tiêu đề */}
      <h1 className="text-center mb-5">Liên hệ với chúng tôi</h1>
      <div className="row justify-content-center">
        {/**Thông tin liên hệ */}
        <ul className="list-unstyled text-muted">
          <li className="mb-3">
            <i className="fas fa-map-marker-alt me-2"></i> 123 Đường ABC, Quận
            XYZ, TP.HCM
          </li>
          <li className="mb-3">
            <i className="fas fa-phone me-2"></i> (028) 1234 5678
          </li>
          <li className="mb-3">
            <i className="fas fa-envelope me-2"></i>
            {""}
            <a href="mailto:contact@schoolhealth.com" className="text-muted">
              contact@schoolhealth.com
            </a>
          </li>
        </ul>
        {/**Nhúng bản đồ của google vào */}
        <div className="mt-4">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.609941530484!2d106.80730807451786!3d10.841132857997916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgVFAuIEhDTQ!5e0!3m2!1svi!2s!4v1748932009111!5m2!1svi!2s" 
            width="100%" 
            height="250" 
            style={{border:0}}
            allowfullscreen="" 
            loading="lazy" 
            title="google map"            
            ></iframe>

        </div>
        <div className="mt-4">
          <h5>Theo dõi chúng tôi</h5>
          <a href="#" className="text-muted me-3">
            <i className="fab fa-facebook fa-lg"></i>
          </a>
          <a href="#" className="text-muted me-3">
            <i className="fab fa-twitter fa-lg"></i>
          </a>
          <a href="#" className="text-muted">
            <i className="fab fa-youtube fa-lg"></i>
          </a>
        </div>
      </div>

      {/**Form liên hệ */}
      <div className="col-md-6">
        <h3>Gửi tin nhắn</h3>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Họ và tên
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nhập họ và tên"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Nhập email của bạn"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="message" className="form-label">
            Tin nhắn
          </label>
          <textarea
            className="form-control"
            name="message"
            id="message"
            rows="4"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Nhập tin nhắn của bạn"
          ></textarea>
        </div>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Gửi tin nhắn
        </button>
      </div>
    </div>
  );
};

export default Contact;
