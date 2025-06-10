import React, { useState } from "react";
import { Link } from "react-router-dom";

const FAQ = () => {
  return (
    <div className="container py-5">
      {/**Tiêu đề */}
      <h1 className="text-center mb-5">Câu hỏi thường gặp</h1>

      {/**Sử dụng Accordion - để làm danh sách các câu hỏi */}
      <div className="accordion" id="faqAccordion">
        {/**Câu hỏi 1 */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOne">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              Làm thế nào để đăng kí tài khoản?
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            aria-labelledby="headingOne"
            data-bs-parent="#faqAccordion"
          >
            <div className="accordion-body">
              Bạn có thể đăng ký tài khoản bằng cách nhấp vào "Đăng ký" trên
              trang chủ, sau đó điền thông tin cá nhân và xác nhận email của
              bạn.
            </div>
          </div>
        </div>
        {/**Câu hỏi 2 */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingTwo">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              Làm sao để gửi khai báo y tế?
            </button>
          </h2>
          <div
            id="collapseTwo"
            className="accordion-collapse collapse"
            aria-labelledby="headingTwo"
            data-bs-parent="#faqAccordion"
          >
            <div className="accordion-body">
              Vào mục "Khai báo y tế" trong tài khoản, điền thông tin sức khỏe
              và gửi. Hệ thống sẽ tự động lưu và thông báo cho y tá trường học.
            </div>
          </div>
        </div>

        {/**Câu hỏi 3 */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingThree">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              Tôi quên mật khẩu, làm sao để khôi phục?
            </button>
          </h2>
          <div
            id="collapseThree"
            className="accordion-collapse collapse"
            aria-labelledby="headingThree"
            data-bs-parent="#faqAccordion"
          >
            <div className="accordion-body">
              Nhấp vào "Quên mật khẩu" trên trang đăng nhập, nhập email của bạn
              để nhận liên kết khôi phục. Theo dõi email để đặt lại mật khẩu
              mới.
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-5">
        <p className="text-muted">
          Bạn vẫn cần giúp đỡ?{" "}
          <Link to="/contact" className="text-primary">
            Liên hệ với chúng tôi
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default FAQ;
