import React from 'react';

const Contact = () => {
    return (
        <div>
            <div>
                <div>
                    <h1>Liên hệ</h1>
                    <div>
                        <div>
                            <div>
                                <div>
                                    <h2>Thông tin liên hệ</h2>
                                    <div>
                                        <h3>Địa chỉ</h3>
                                        <p>
                                            <i></i>
                                            123 Đường ABC, Quận XYZ, TP.HCM
                                        </p>
                                    </div>
                                    <div>
                                        <h3>Điện thoại</h3>
                                        <p>
                                            <i></i>
                                            (028) 1234 5678
                                        </p>
                                    </div>
                                    <div>
                                        <h3>Email</h3>
                                        <p>
                                            <i></i>
                                            contact@schoolhealth.com
                                        </p>
                                    </div>
                                    <div>
                                        <h3>Giờ làm việc</h3>
                                        <p>
                                            Thứ Hai - Thứ Sáu: 8:00 - 17:00<br />
                                            Thứ Bảy: 8:00 - 12:00<br />
                                            Chủ Nhật: Nghỉ
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div>
                                <div>
                                    <h2>Gửi tin nhắn cho chúng tôi</h2>
                                    <form>
                                        <div>
                                            <label htmlFor="name">Họ và tên</label>
                                            <input
                                                type="text"
                                                id="name"
                                                placeholder="Nhập họ và tên của bạn"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                placeholder="Nhập email của bạn"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="subject">Tiêu đề</label>
                                            <input
                                                type="text"
                                                id="subject"
                                                placeholder="Nhập tiêu đề tin nhắn"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="message">Nội dung</label>
                                            <textarea
                                                id="message"
                                                rows="5"
                                                placeholder="Nhập nội dung tin nhắn"
                                            ></textarea>
                                        </div>
                                        <button type="submit">
                                            Gửi tin nhắn
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <div>
                                <div>
                                    <h2>Bản đồ</h2>
                                    <div>
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241779445467!2d106.69814931480078!3d10.775889992319295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f467bf0e9d5%3A0x1a9cb2e8a0e41e0d!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBTw6BpIEfDsm4!5e0!3m2!1svi!2s!4v1647856666"
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
