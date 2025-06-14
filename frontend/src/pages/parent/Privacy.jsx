import React from "react";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <div className="container py-5">
      {/* Tiêu đề */}
      <h1 className="text-center mb-5">Chính sách bảo mật</h1>

      {/* Nội dung chính */}
      <div className="row justify-content-center">
        <div className="col-md-8">
          <p className="lead">
            Hệ thống Quản lý Y tế Học đường cam kết bảo vệ thông tin cá nhân và
            dữ liệu của người dùng theo quy định của Luật An ninh mạng Việt Nam
            (2018). Chính sách này giải thích cách chúng tôi thu thập, sử dụng,
            lưu trữ, và bảo vệ dữ liệu của bạn.
          </p>

          {/* Thu thập thông tin */}
          <h3 className="mt-4">1. Thu thập thông tin</h3>
          <p>
            Chúng tôi thu thập thông tin như họ tên, email, dữ liệu sức khỏe (qua
            khai báo y tế), và thông tin tài khoản số khi bạn đăng ký hoặc sử dụng
            hệ thống. Tất cả thông tin được xác thực và bảo mật theo quy định tại
            Điều 26 Luật An ninh mạng.
          </p>

          {/* Sử dụng thông tin */}
          <h3 className="mt-4">2. Sử dụng thông tin</h3>
          <p>
            Dữ liệu của bạn được sử dụng để cung cấp dịch vụ, gửi thông báo, và
            cải thiện hệ thống. Chúng tôi có thể chia sẻ thông tin với cơ quan
            chức năng (như Bộ Công an) khi có yêu cầu hợp pháp để phục vụ điều
            tra, theo Điều 26 Luật An ninh mạng. Nếu xảy ra nguy cơ lộ dữ liệu,
            chúng tôi sẽ thông báo ngay cho bạn.
          </p>

          {/* Bảo mật thông tin */}
          <h3 className="mt-4">3. Bảo mật thông tin</h3>
          <p>
            Chúng tôi áp dụng các biện pháp kỹ thuật (như mã hóa) để bảo vệ dữ
            liệu khỏi gián điệp mạng và các hành vi xâm phạm (theo Điều 17 Luật
            An ninh mạng). Hệ thống thường xuyên kiểm tra, khắc phục lỗ hổng bảo
            mật, và xử lý sự cố an ninh mạng kịp thời.
          </p>

          {/* Lưu trữ dữ liệu */}
          <h3 className="mt-4">4. Lưu trữ dữ liệu</h3>
          <p>
            Dữ liệu người dùng (bao gồm thông tin cá nhân và dữ liệu do bạn tạo
            ra) được lưu trữ tại Việt Nam theo quy định tại Điều 26, khoản 3 Luật
            An ninh mạng.
          </p>

          {/* Quyền của người dùng */}
          <h3 className="mt-4">5. Quyền của người dùng</h3>
          <p>
            Bạn có quyền xem, chỉnh sửa, hoặc yêu cầu xóa thông tin cá nhân của
            mình. Bạn cũng có trách nhiệm phối hợp cung cấp thông tin nếu cơ quan
            chức năng yêu cầu, theo Điều 42 Luật An ninh mạng.
          </p>

          {/* Bảo vệ trẻ em */}
          <h3 className="mt-4">6. Bảo vệ trẻ em</h3>
          <p>
            Hệ thống cam kết bảo vệ trẻ em (học sinh) trên không gian mạng, kiểm
            soát nội dung để không gây hại và ngăn chặn thông tin xâm phạm quyền
            trẻ em, theo Điều 29 Luật An ninh mạng.
          </p>

          {/* Trách nhiệm của hệ thống */}
          <h3 className="mt-4">7. Trách nhiệm của hệ thống</h3>
          <p>
            Chúng tôi phối hợp với cơ quan chức năng để xử lý vi phạm an ninh
            mạng, và sẽ xóa bỏ thông tin trái pháp luật (như thông tin sai sự
            thật, gây hoang mang) trong vòng 24 giờ khi có yêu cầu, theo Điều 26
            Luật An ninh mạng.
          </p>

          {/* Call to Action */}
          <div className="text-center mt-5">
            <p className="text-muted">
              Có câu hỏi về chính sách bảo mật?{" "}
              <Link to="/contact" className="text-primary">
                Liên hệ với chúng tôi
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;