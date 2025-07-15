import React, { useState } from 'react';
import styles from './FAQ.module.css';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const faqs = [
        {
            question: "Hệ thống Quản lý Y tế Học đường là gì?",
            answer: "Hệ thống Quản lý Y tế Học đường là một nền tảng toàn diện được thiết kế để quản lý và theo dõi các hoạt động y tế trong trường học. Hệ thống giúp kết nối nhà trường, y tá học đường và phụ huynh trong việc chăm sóc sức khỏe học sinh."
        },
        {
            question: "Ai có thể sử dụng hệ thống?",
            answer: "Hệ thống được thiết kế cho ba đối tượng chính: Quản trị viên (Admin), Y tá học đường và Phụ huynh học sinh. Mỗi đối tượng sẽ có quyền truy cập và chức năng riêng phù hợp với vai trò của họ."
        },
        {
            question: "Làm thế nào để đăng ký tài khoản?",
            answer: "Để đăng ký tài khoản, bạn cần liên hệ với quản trị viên của trường học để được cấp tài khoản và hướng dẫn sử dụng. Mỗi tài khoản sẽ được phân quyền phù hợp với vai trò của người dùng."
        },
        {
            question: "Tôi có thể làm gì với tài khoản phụ huynh?",
            answer: "Với tài khoản phụ huynh, bạn có thể: Khai báo thông tin sức khỏe của con em, theo dõi lịch sử khám bệnh, gửi yêu cầu cấp thuốc, nhận thông báo về tình hình sức khỏe của con em và liên lạc với y tá học đường."
        },
        {
            question: "Làm thế nào để báo cáo vấn đề kỹ thuật?",
            answer: "Nếu bạn gặp bất kỳ vấn đề kỹ thuật nào, vui lòng liên hệ với chúng tôi qua email support@schoolhealth.com hoặc gọi đến số hotline (028) 1234 5678. Đội ngũ kỹ thuật của chúng tôi sẽ hỗ trợ bạn trong thời gian sớm nhất."
        },
        {
            question: "Hệ thống có bảo mật thông tin không?",
            answer: "Có, chúng tôi cam kết bảo mật tuyệt đối thông tin của người dùng. Hệ thống sử dụng các biện pháp bảo mật tiên tiến như mã hóa dữ liệu, xác thực hai yếu tố và tuân thủ các quy định về bảo vệ dữ liệu cá nhân."
        },
        {
            question: "Tôi có thể truy cập hệ thống từ thiết bị di động không?",
            answer: "Có, hệ thống được thiết kế responsive và có thể truy cập từ mọi thiết bị bao gồm máy tính, điện thoại di động và máy tính bảng. Giao diện sẽ tự động điều chỉnh để phù hợp với kích thước màn hình của thiết bị."
        },
        {
            question: "Làm thế nào để cập nhật thông tin cá nhân?",
            answer: "Bạn có thể cập nhật thông tin cá nhân bằng cách đăng nhập vào hệ thống, vào mục 'Hồ sơ cá nhân' và chọn 'Chỉnh sửa'. Sau khi cập nhật, nhớ nhấn 'Lưu' để lưu lại các thay đổi."
        }
    ];

    return (
        <div className={styles.faqContainer}>
            <h1 className={styles.faqTitle}>Câu hỏi thường gặp</h1>
            <div className={styles.faqList}>
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className={openIndex === index ? `${styles.faqItem} ${styles.faqItemOpen}` : styles.faqItem}
                    >
                        <h2 style={{ margin: 0 }}>
                            <button
                                type="button"
                                className={styles.faqQuestionBtn}
                                aria-expanded={openIndex === index}
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                {faq.question}
                            </button>
                        </h2>
                        {openIndex === index && (
                            <div className={styles.faqAnswer}>
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ; 
