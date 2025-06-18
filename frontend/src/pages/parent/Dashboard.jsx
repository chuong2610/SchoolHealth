import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ParentDashboard = () => {
  {
    /**Bắt đầu sử lí logic để nạp API */
  }
  const [blogs, setBlogs] = useState([]); //state để lưu danh sách blog
  const [loading, setLoading] = useState(true); //state để hiển thị trạng thái loading
  const [error, setError] = useState(null); //state để lưu lỗi nếu có
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Gọi API khi component được mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5182/api/BlogPosts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("API blogs data:", response.data); // 👈 thêm dòng này
        setBlogs(response.data); //lưu dữ liệu của blog vào state
        setLoading(false); // tắt trạng thái loading
      } catch (err) {
        console.error("API error:", err.response ? err.response : err); // Log chi tiết lỗi
        setError(
          err.response
            ? `Lỗi ${err.response.status}: ${
                err.response.data.message || "Không thể tải dữ liệu blog."
              }`
            : "Không thể kết nối đến server."
        );
      }
    };
    fetchBlogs();
  }, []); //dependancy array rỗng, chỉ chạy 1 lần khi component mount
  {
    /**Kết thúc sử lí logic để nạp API */
  }

  //Bắt đầu hàm format ngày
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  //
  const getPreviewText = (html, maxLength = 100) => {
    if (!html) return ""; // tránh null
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // function BlogCard({ blog }) {
  //   const preview = getPreviewText(blog.content, 100);

  //   return (
  //     <div className="card-body">
  //       <h5>{blog.title}</h5>
  //       <p className="card-text">{preview}</p>
  //     </div>
  //   );
  // }

  //Kết thúc hàm chuyển HTML sang plain text

  return (
    <div>
      {/* Mở đầu Banner Section */}
      <section className="banner position-relative">
        <div className="container h-100">
          <div className="row h-100 align-items-center">
            <div className="col-lg-6">
              <div className="banner-content text-white">
                <h1 className="display-4 fw-bold mb-4">
                  Chăm sóc sức khỏe học đường
                </h1>
                <p className="lead mb-4">
                  Đồng hành cùng phụ huynh trong việc chăm sóc sức khỏe cho học
                  sinh
                </p>
                <Link to="/parent/more-know" className="btn btn-primary btn-lg">
                  Tìm hiểu thêm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Kết thúc Banner Section */}

      {/* Mở đầu School Information Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">Giới thiệu về trường học</h2>
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img
                src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="School Building"
                className="img-fluid rounded shadow"
              />
            </div>
            <div className="col-lg-6">
              <p className="lead mb-4">
                Trường chúng tôi tự hào là một trong những cơ sở giáo dục hàng
                đầu với hệ thống y tế học đường hiện đại và chuyên nghiệp.
              </p>
              <p className="mb-4">
                Với đội ngũ nhân viên y tế giàu kinh nghiệm, chúng tôi cam kết
                mang đến dịch vụ chăm sóc sức khỏe tốt nhất cho học sinh.
              </p>
              <p>
                Phòng y tế được trang bị đầy đủ thiết bị y tế cần thiết và luôn
                sẵn sàng hỗ trợ học sinh trong mọi tình huống.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Kết thúc School Information Section */}

      {/* Mở đầu Health Blog Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">Blog sức khỏe học đường</h2>
          {/** */}
          {loading ? (
            <p className="text-center">Đang tải dữ liệu...</p> //Hiển thị khi đang gọi
          ) : error ? (
            <p className="text-center text-danger">{error}</p> //hiển thị lỗi nếu có
          ) : (
            <div className="row g-4">
              {blogs.map(
                (blog) => (
                  console.log("Blog content preview:", blog.content),
                  (
                    <div className="col-md-4" key={blog.id}>
                      <div
                        className="card h-100 shadow-sm"
                        onClick={() => navigate(`/parent/blog/${blog.id}`)}
                        style={{ cursor: "pointer", overflow: "hidden" }}
                      >
                        <img
                          src={
                            blog.imageUrl ||
                            "https://placehold.jp/800x180.png?text=No+Image"
                          }
                          className="card-img-top"
                          alt={blog.title}
                          style={{
                            width: "100%",
                            height: 180,
                            objectFit: "cover",
                            // borderTopLeftRadius: "0.75rem", // dòng này gây ra lỗi có khoảng trắng nhỏ giữa ảnh và card bên trái
                            // borderTopRightRadius: "0.75rem", // dòng này gây ra lỗi có khoảng trắng nhỏ giữa ảnh và card bên phải
                            display: "block",
                          }}
                          onError={(e) => {
                            e.target.onError = null;
                            e.target.src =
                              "https://placehold.jp/800x180.png?text=No+Image";
                          }}
                        />
                        <div className="card-body">
                          <small className="text-muted">
                            {formatDate(blog.createdAt)}
                          </small>
                          <h5 className="card-title mt-2">{blog.title}</h5>
                          <p className="card-text">
                            {getPreviewText(blog.contentSummary, 100)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          )}
          {/** */}
        </div>
      </section>
      {/* Kết thúc Health Blog Section */}
    </div>
  );
};

export default ParentDashboard;
