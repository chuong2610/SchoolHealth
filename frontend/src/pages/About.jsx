import React from 'react';

const About = () => {
    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-12">
                    <h1 className="mb-4">Giới thiệu về Hệ thống Quản lý Y tế Học đường</h1>
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h2 className="h4 mb-3">Tầm nhìn</h2>
                            <p className="mb-4">
                                Hệ thống Quản lý Y tế Học đường được phát triển với mục tiêu cung cấp một giải pháp toàn diện
                                trong việc quản lý và chăm sóc sức khỏe học sinh tại các trường học. Chúng tôi hướng đến việc
                                tạo ra một môi trường học tập an toàn và lành mạnh cho mọi học sinh.
                            </p>

                            <h2 className="h4 mb-3">Sứ mệnh</h2>
                            <p className="mb-4">
                                - Cung cấp công cụ quản lý y tế học đường hiệu quả và dễ sử dụng<br />
                                - Tăng cường khả năng theo dõi và chăm sóc sức khỏe học sinh<br />
                                - Tạo kênh liên lạc trực tiếp giữa nhà trường và phụ huynh<br />
                                - Hỗ trợ công tác phòng chống dịch bệnh trong trường học
                            </p>

                            <h2 className="h4 mb-3">Tính năng chính</h2>
                            <div className="row mb-4">
                                <div className="col-md-4 mb-3">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h3 className="h5">Quản lý sức khỏe</h3>
                                            <p className="mb-0">
                                                Theo dõi và quản lý thông tin sức khỏe của học sinh một cách hệ thống và khoa học.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h3 className="h5">Quản lý thuốc</h3>
                                            <p className="mb-0">
                                                Hệ thống quản lý kho thuốc và theo dõi việc sử dụng thuốc trong trường học.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h3 className="h5">Báo cáo thống kê</h3>
                                            <p className="mb-0">
                                                Tạo các báo cáo thống kê về tình hình sức khỏe học sinh và hoạt động y tế.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h2 className="h4 mb-3">Đội ngũ phát triển</h2>
                            <p className="mb-4">
                                Hệ thống được phát triển bởi đội ngũ chuyên gia giàu kinh nghiệm trong lĩnh vực công nghệ
                                thông tin và y tế học đường. Chúng tôi luôn nỗ lực cải thiện và nâng cấp hệ thống để đáp ứng
                                tốt nhất nhu cầu của người dùng.
                            </p>

                            <h2 className="h4 mb-3">Liên hệ</h2>
                            <p className="mb-0">
                                Nếu bạn có bất kỳ thắc mắc hoặc góp ý nào, vui lòng liên hệ với chúng tôi qua:<br />
                                Email: contact@schoolhealth.com<br />
                                Điện thoại: (028) 1234 5678<br />
                                Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About; 
