import React from 'react';

const Contact = () => {
    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-12">
                    <h1 className="mb-4">Liên hệ</h1>
                    <div className="row">
                        <div className="col-md-6 mb-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <h2 className="h4 mb-3">Thông tin liên hệ</h2>
                                    <div className="mb-4">
                                        <h3 className="h5 mb-3">Địa chỉ</h3>
                                        <p className="mb-0">
                                            <i className="fas fa-map-marker-alt me-2"></i>
                                            123 Đường ABC, Quận XYZ, TP.HCM
                                        </p>
                                    </div>
                                    <div className="mb-4">
                                        <h3 className="h5 mb-3">Điện thoại</h3>
                                        <p className="mb-0">
                                            <i className="fas fa-phone me-2"></i>
                                            (028) 1234 5678
                                        </p>
                                    </div>
                                    <div className="mb-4">
                                        <h3 className="h5 mb-3">Email</h3>
                                        <p className="mb-0">
                                            <i className="fas fa-envelope me-2"></i>
                                            contact@schoolhealth.com
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="h5 mb-3">Giờ làm việc</h3>
                                        <p className="mb-0">
                                            Thứ Hai - Thứ Sáu: 8:00 - 17:00<br />
                                            Thứ Bảy: 8:00 - 12:00<br />
                                            Chủ Nhật: Nghỉ
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 mb-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <h2 className="h4 mb-3">Gửi tin nhắn cho chúng tôi</h2>
                                    <form>
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Họ và tên</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                placeholder="Nhập họ và tên của bạn"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                placeholder="Nhập email của bạn"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="subject" className="form-label">Tiêu đề</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="subject"
                                                placeholder="Nhập tiêu đề tin nhắn"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="message" className="form-label">Nội dung</label>
                                            <textarea
                                                className="form-control"
                                                id="message"
                                                rows="5"
                                                placeholder="Nhập nội dung tin nhắn"
                                            ></textarea>
                                        </div>
                                        <button type="submit" className="btn btn-primary">
                                            Gửi tin nhắn
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-12">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h2 className="h4 mb-3">Bản đồ</h2>
                                    <div className="ratio ratio-21x9">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241779445467!2d106.69814931480078!3d10.775889992319295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f467bf0e9d5%3A0x1a9cb2e8a0e41e0d!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBTw6BpIEfDsm4!5e0!3m2!1svi!2s!4v1647856666"
                                            style={{ border: 0 }}
                                            allowFullScreen=""
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        ></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact; 
