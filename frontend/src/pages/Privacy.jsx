import React from 'react';

const Privacy = () => {
    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-12">
                    <h1 className="mb-4">Chính sách bảo mật</h1>
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <section className="mb-4">
                                <h2 className="h4 mb-3">1. Thông tin chúng tôi thu thập</h2>
                                <p>
                                    Chúng tôi thu thập các thông tin sau đây:
                                </p>
                                <ul>
                                    <li>Thông tin cá nhân (họ tên, email, số điện thoại)</li>
                                    <li>Thông tin học sinh (họ tên, ngày sinh, lớp học)</li>
                                    <li>Thông tin sức khỏe (tiền sử bệnh, dị ứng, thuốc đang sử dụng)</li>
                                    <li>Thông tin đăng nhập và sử dụng hệ thống</li>
                                </ul>
                            </section>

                            <section className="mb-4">
                                <h2 className="h4 mb-3">2. Cách chúng tôi sử dụng thông tin</h2>
                                <p>
                                    Chúng tôi sử dụng thông tin thu thập được để:
                                </p>
                                <ul>
                                    <li>Quản lý và theo dõi sức khỏe học sinh</li>
                                    <li>Cung cấp dịch vụ y tế học đường</li>
                                    <li>Gửi thông báo và cập nhật về tình hình sức khỏe</li>
                                    <li>Cải thiện và phát triển hệ thống</li>
                                    <li>Tuân thủ các quy định pháp luật</li>
                                </ul>
                            </section>

                            <section className="mb-4">
                                <h2 className="h4 mb-3">3. Bảo mật thông tin</h2>
                                <p>
                                    Chúng tôi cam kết bảo vệ thông tin của bạn bằng cách:
                                </p>
                                <ul>
                                    <li>Sử dụng các biện pháp bảo mật tiên tiến</li>
                                    <li>Mã hóa dữ liệu nhạy cảm</li>
                                    <li>Giới hạn quyền truy cập thông tin</li>
                                    <li>Thường xuyên cập nhật và kiểm tra hệ thống bảo mật</li>
                                </ul>
                            </section>

                            <section className="mb-4">
                                <h2 className="h4 mb-3">4. Chia sẻ thông tin</h2>
                                <p>
                                    Chúng tôi chỉ chia sẻ thông tin trong các trường hợp sau:
                                </p>
                                <ul>
                                    <li>Với sự đồng ý của bạn</li>
                                    <li>Khi cần thiết để cung cấp dịch vụ</li>
                                    <li>Khi được yêu cầu bởi pháp luật</li>
                                    <li>Để bảo vệ quyền lợi và an toàn của người dùng</li>
                                </ul>
                            </section>

                            <section className="mb-4">
                                <h2 className="h4 mb-3">5. Quyền của người dùng</h2>
                                <p>
                                    Bạn có quyền:
                                </p>
                                <ul>
                                    <li>Truy cập và xem thông tin cá nhân</li>
                                    <li>Yêu cầu chỉnh sửa thông tin không chính xác</li>
                                    <li>Yêu cầu xóa thông tin cá nhân</li>
                                    <li>Rút lại sự đồng ý về việc sử dụng thông tin</li>
                                </ul>
                            </section>

                            <section className="mb-4">
                                <h2 className="h4 mb-3">6. Cập nhật chính sách</h2>
                                <p>
                                    Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian.
                                    Khi có thay đổi, chúng tôi sẽ thông báo cho bạn qua email hoặc
                                    thông báo trên hệ thống.
                                </p>
                            </section>

                            <section>
                                <h2 className="h4 mb-3">7. Liên hệ</h2>
                                <p className="mb-0">
                                    Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật, vui lòng liên hệ với chúng tôi qua:<br />
                                    Email: privacy@schoolhealth.com<br />
                                    Điện thoại: (028) 1234 5678<br />
                                    Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy; 