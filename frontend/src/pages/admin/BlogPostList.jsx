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
      setBlogPosts(response.data);
    } catch (error) {
      setError("Failed to fetch blog posts. Check your token or API endpoint.");
      console.error("Error fetching blog posts:", error); // Debug log
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

  return (
    <div className="container mt-4">
      <h2>Blog Posts</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <Link to="/admin/createBlogPost" className="btn btn-primary mb-3">
        Create New Blog Post
      </Link>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Summary</th>
            <th>Created At</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogPosts.map((post) => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>{post.title}</td>
              <td>{post.contentSummary}</td>
              <td>{new Date(post.createAt).toLocaleString()}</td>
              <td>
                {post.imageUrl && (
                  <img
                    src="post.imageUrl"
                    alt={post.title}
                    style={{ width: "180px", height: "auto" }}
                  />
                )}
              </td>
              <td>
                <Link
                  to={`admin/editBlogPost/${post.id}`}
                  className="btn btn-warnming btn sm me-2"
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
  );
};

export default BlogPostList;
