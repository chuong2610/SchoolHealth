import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
// const blogData = [
//   {
//     id: "1",
//     title: "Cách phòng tránh bệnh cúm mùa cho học sinh",
//     date: "15/03/2024",
//     image:
//       "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
//     content: `Những biện pháp phòng tránh bệnh cúm mùa hiệu quả cho học sinh trong môi trường học đường.\n\n1. Tiêm phòng cúm đầy đủ.\n2. Giữ vệ sinh cá nhân, rửa tay thường xuyên.\n3. Đeo khẩu trang khi cần thiết.\n4. Tăng cường dinh dưỡng, luyện tập thể thao.\n5. Khi có dấu hiệu bệnh, cần nghỉ học và đi khám bác sĩ.`,
//   },
//   {
//     id: "2",
//     title: "Dinh dưỡng học đường: Xây dựng thực đơn lành mạnh",
//     date: "10/03/2024",
//     image:
//       "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
//     content: `Hướng dẫn xây dựng thực đơn dinh dưỡng cân bằng cho học sinh.\n\n- Đảm bảo đủ 4 nhóm chất: bột đường, đạm, béo, vitamin và khoáng chất.\n- Hạn chế đồ ngọt, nước ngọt có gas.\n- Ăn nhiều rau xanh, trái cây.\n- Uống đủ nước mỗi ngày.`,
//   },
//   {
//     id: "3",
//     title: "Tầm quan trọng của việc rửa tay đúng cách",
//     date: "05/03/2024",
//     image:
//       "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80",
//     content: `Hướng dẫn chi tiết về quy trình rửa tay đúng cách để phòng tránh bệnh.\n\n- Làm ướt tay bằng nước sạch.\n- Dùng xà phòng và chà kỹ các ngón, kẽ tay, móng tay ít nhất 20 giây.\n- Rửa lại bằng nước sạch và lau khô tay.\n- Rửa tay trước khi ăn, sau khi đi vệ sinh, sau khi ho/hắt hơi.`,
//   },
// ];

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const blog = blogData.find((b) => b.id === id) || blogData[0];
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gọi API khi component được muont hoặc khi id thay đổi
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5182/api/BlogPosts/${id}`,
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwiZW1haWwiOiJwYXJlbnRAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiUGFyZW50IiwiZXhwIjoxNzQ5MDAyMzk2LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUxODIiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUxODIifQ.KahGa4EdAJcdvLyv-LKPOr-tXSyO8hB4caNVgiJVLWY`,
            },
          }
        );
        setBlog(response.data);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải bài viết. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]); //dependancy array khi có id, chạy lại khi id thay đổi

  //bắt đầu sử lí phần loading và lỗi
  if (loading) {
    return (
      <div
        style={{ background: "#f5f7fa", minHeight: "100vh", padding: "32px 0" }}
      >
        <div className="container" style={{ maxWidth: 800 }}>
          <p className="text-center">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div
        style={{ background: "#f5f7fa", minHeight: "100vh", padding: "32px 0" }}
      >
        <div className="container" style={{ maxWidth: 800 }}>
          <p className="text-center text-danger">
            {error || "Bài viết không tồn tại."}
          </p>
          <button
            className="btn btn-outline-primary d-block mx-auto"
            onClick={() => navigate(-1)}
          >
            <i className="fas fa-arrow-left me-2"></i>Quay lại
          </button>
        </div>
      </div>
    );
  }
  //kết thúc sử lí phần loading và lỗi

  return (
    <div
      style={{ background: "#f5f7fa", minHeight: "100vh", padding: "32px 0" }}
    >
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="card shadow-sm border-0 rounded-4 mb-4">
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="card-img-top rounded-top-4"
            style={{ maxHeight: 320, objectFit: "cover" }}
            //sử lí lỗi
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.jp/800x180.png?text=No+Image";
            }}
            //kết thúc sử lí lỗi
          />
          <div className="card-body p-4">
            <div className="text-muted mb-2" style={{ fontSize: 16 }}>
              {blog.createdAt}
            </div>
            <h1 className="fw-bold mb-3" style={{ fontSize: 30 }}>
              {blog.title}
            </h1>
            <div style={{ whiteSpace: "pre-line", fontSize: 18 }}>
              {blog.content}
            </div>
            <button
              className="btn btn-outline-primary mt-4"
              onClick={() => navigate(-1)}
            >
              <i className="fas fa-arrow-left me-2"></i>Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
