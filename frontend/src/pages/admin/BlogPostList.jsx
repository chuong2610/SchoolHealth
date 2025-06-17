// import axios from "axios";
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// const BlogPostList = () => {
//   const [blogPosts, setBlogPosts] = useState([]);
//   const [error, setError] = useState("");
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchBlogPost();
//   }, []);
//   const fetchBlogPost = async () => {
//     try {
//       const response = await axios.get("http://localhost:5182/api/BlogPosts", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setBlogPosts(response.data);
//     } catch (error) {
//       setError("Failed to fetch blog posts. Check your token or API endpoint.");
//       console.error("Error fetching blog posts:", error); // Debug log
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this blog post?")) {
//       try {
//         await axios.delete(`http://localhost:5182/api/BlogPosts/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setBlogPosts(blogPosts.filter((post) => post.id !== id));
//       } catch (error) {
//         setError("Failed to delete blog post.");
//         console.error("Error deleting blog post:", error);
//       }
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h2>Blog Posts</h2>
//       {error && <div className="alert alert-danger">{error}</div>}
//       <Link to="/admin/createBlogPost" className="btn btn-primary mb-3">
//         Create New Blog Post
//       </Link>
//       <div className="table-responsive">
//         <table className="table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Title</th>
//               <th>Summary</th>
//               <th>Created At</th>
//               <th>Image</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {blogPosts.map((post) => (
//               <tr key={post.id}>
//                 <td>{post.id}</td>
//                 <td>{post.title}</td>
//                 <td>{post.contentSummary}</td>
//                 <td>{new Date(post.createdAt).toLocaleString()}</td>
//                 <td>
//                   {post.imageUrl && (
//                     <img
//                       src={post.imageUrl}
//                       alt={post.title}
//                       style={{ maxWidth: "100%", height: "auto" }}
//                     />
//                   )}
//                 </td>
//                 <td>
//                   <Link
//                     to={`/admin/editBlogPost/${post.id}`}
//                     className="btn btn-warning btn-sm me-2"
//                   >
//                     Edit
//                   </Link>

//                   <button
//                     className="btn btn-danger btn-sm"
//                     onClick={() => handleDelete(post.id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default BlogPostList;

import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BlogPostList = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBlogPost();
  }, []);

  const fetchBlogPost = async () => {
    try {
      const response = await axios.get("http://localhost:5182/api/BlogPosts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API Response:", response.data); // Kiểm tra dữ liệu
      setBlogPosts(response.data);
    } catch (error) {
      setError("Failed to fetch blog posts. Check your token or API endpoint.");
      console.error("Error fetching blog posts:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await axios.delete(`http://localhost:5182/api/BlogPosts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBlogPosts(blogPosts.filter((post) => post.id !== id));
      } catch (error) {
        setError("Failed to delete blog post.");
        console.error("Error deleting blog post:", error);
      }
    }
  };

  // Hàm format ngày
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="container mt-4">
      <h2 className="d-flex justify-content-center mb-5">Manage Posts</h2>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <Link to="/admin/createBlogPost" className="btn btn-primary me-2">
            Add Post
          </Link>
          <Link to="/admin/blog-posts" className="btn btn-primary">
            Manage Posts
          </Link>
        </div>
        <div></div> {/* Placeholder để cân bằng flex */}
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {blogPosts.map((post, index) => (
              <tr key={post.id}>
                <td>{index + 1}</td>
                <td>{post.title}</td>
                <td>{formatDate(post.createdAt)}</td>
                <td>
                  <Link
                    to={`/admin/editBlogPost/${post.id}`}
                    className="btn btn-success btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogPostList;
