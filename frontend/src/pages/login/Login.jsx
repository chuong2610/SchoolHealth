import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import "./Login.css";
import bgImg from "../../assets/login-bg.png";
import { auth, googleProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import LoginLayout from "../../layouts/LoginLayout";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // TODO: Implement email/password login logic here
      console.log("Login with:", formData);
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to login with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginLayout>
      <div
        className="login-page d-flex align-items-center min-vh-100"
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        }}
      >
        <Container fluid className="login-container">
          <Row className="justify-content-center align-items-center min-vh-100">
            <Col xs={12} sm={8} md={6} lg={4}>
              <div className="login-card">
                <h2 className="text-center mb-4">Welcome Back</h2>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>

                  <div className="divider">
                    <span>or</span>
                  </div>

                  <Button
                    variant="outline-primary"
                    className="w-100 google-btn"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
                    <FaGoogle className="me-2" />
                    Continue with Google
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </LoginLayout>
  );
};

export default Login;
