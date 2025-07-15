import React from 'react';
import styles from './About.module.css';

export default function About() {
    return (
        <div className={styles.aboutContainer}>
            <h1 className={styles.aboutTitle}>Giới thiệu về School Health</h1>
            <div className={styles.aboutSubtitle}>Nền tảng chăm sóc sức khỏe học đường hiện đại, kết nối phụ huynh, nhà trường và y tế.</div>

            <section className={styles.aboutSection}>
                <div className={styles.aboutSectionTitle}>Sứ mệnh</div>
                <p className={styles.aboutText}>
                    School Health giúp phụ huynh theo dõi, quản lý và phối hợp chăm sóc sức khỏe cho học sinh một cách chủ động, an toàn và hiệu quả.
                </p>
            </section>

            <section className={styles.aboutSection}>
                <div className={styles.aboutSectionTitle}>Giá trị cốt lõi</div>
                <ul className={styles.aboutList}>
                    <li>Đồng hành cùng phụ huynh và nhà trường</li>
                    <li>Bảo mật & an toàn thông tin</li>
                    <li>Chuyên nghiệp, tận tâm, hiện đại</li>
                </ul>
            </section>

            <section className={styles.aboutSection}>
                <div className={styles.aboutSectionTitle}>Tính năng nổi bật</div>
                <ul className={styles.aboutList}>
                    <li>Quản lý hồ sơ sức khỏe học sinh</li>
                    <li>Thông báo y tế, lịch tiêm chủng, khám sức khỏe</li>
                    <li>Gửi thuốc, liên hệ y tá trực tuyến</li>
                    <li>Báo cáo, thống kê sức khỏe toàn diện</li>
                </ul>
            </section>
        </div>
    );
} 
