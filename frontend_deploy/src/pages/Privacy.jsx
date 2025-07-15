import React from 'react';
import styles from './Privacy.module.css';

const Privacy = () => {
    return (
        <div className={styles.privacyContainer}>
            <h1 className={styles.privacyTitle}>Chính sách bảo mật</h1>
            <div>
                <section className={styles.privacySection}>
                    <div className={styles.privacySectionTitle}>1. Thông tin chúng tôi thu thập</div>
                    <p className={styles.privacyText}>
                        Chúng tôi thu thập các thông tin sau đây:
                    </p>
                    <ul className={styles.privacyList}>
                        <li>Thông tin cá nhân (họ tên, email, số điện thoại)</li>
                        <li>Thông tin học sinh (họ tên, ngày sinh, lớp học)</li>
                        <li>Thông tin sức khỏe (tiền sử bệnh, dị ứng, thuốc đang sử dụng)</li>
                        <li>Thông tin đăng nhập và sử dụng hệ thống</li>
                    </ul>
                </section>

                <section className={styles.privacySection}>
                    <div className={styles.privacySectionTitle}>2. Cách chúng tôi sử dụng thông tin</div>
                    <p className={styles.privacyText}>
                        Chúng tôi sử dụng thông tin thu thập được để:
                    </p>
                    <ul className={styles.privacyList}>
                        <li>Quản lý và theo dõi sức khỏe học sinh</li>
                        <li>Cung cấp dịch vụ y tế học đường</li>
                        <li>Gửi thông báo và cập nhật về tình hình sức khỏe</li>
                        <li>Cải thiện và phát triển hệ thống</li>
                        <li>Tuân thủ các quy định pháp luật</li>
                    </ul>
                </section>

                <section className={styles.privacySection}>
                    <div className={styles.privacySectionTitle}>3. Bảo mật thông tin</div>
                    <p className={styles.privacyText}>
                        Chúng tôi cam kết bảo vệ thông tin của bạn bằng cách:
                    </p>
                    <ul className={styles.privacyList}>
                        <li>Sử dụng các biện pháp bảo mật tiên tiến</li>
                        <li>Mã hóa dữ liệu nhạy cảm</li>
                        <li>Giới hạn quyền truy cập thông tin</li>
                        <li>Thường xuyên cập nhật và kiểm tra hệ thống bảo mật</li>
                    </ul>
                </section>

                <section className={styles.privacySection}>
                    <div className={styles.privacySectionTitle}>4. Chia sẻ thông tin</div>
                    <p className={styles.privacyText}>
                        Chúng tôi chỉ chia sẻ thông tin trong các trường hợp sau:
                    </p>
                    <ul className={styles.privacyList}>
                        <li>Với sự đồng ý của bạn</li>
                        <li>Khi cần thiết để cung cấp dịch vụ</li>
                        <li>Khi được yêu cầu bởi pháp luật</li>
                        <li>Để bảo vệ quyền lợi và an toàn của người dùng</li>
                    </ul>
                </section>

                <section className={styles.privacySection}>
                    <div className={styles.privacySectionTitle}>5. Quyền của người dùng</div>
                    <p className={styles.privacyText}>
                        Bạn có quyền:
                    </p>
                    <ul className={styles.privacyList}>
                        <li>Truy cập và xem thông tin cá nhân</li>
                        <li>Yêu cầu chỉnh sửa thông tin không chính xác</li>
                        <li>Yêu cầu xóa thông tin cá nhân</li>
                        <li>Rút lại sự đồng ý về việc sử dụng thông tin</li>
                    </ul>
                </section>

                <section className={styles.privacySection}>
                    <div className={styles.privacySectionTitle}>6. Cập nhật chính sách</div>
                    <p className={styles.privacyText}>
                        Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian.
                        Khi có thay đổi, chúng tôi sẽ thông báo cho bạn qua email hoặc
                        thông báo trên hệ thống.
                    </p>
                </section>

                <section className={styles.privacySection}>
                    <div className={styles.privacySectionTitle}>7. Liên hệ</div>
                    <p className={styles.privacyText}>
                        Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật, vui lòng liên hệ với chúng tôi qua:<br />
                        Email: privacy@schoolhealth.com<br />
                        Điện thoại: (028) 1234 5678<br />
                        Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Privacy; 
