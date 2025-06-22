// Login.jsx - Đăng nhập cho người dùng
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import axios from "axios";
import "./Login.css";
// Styles được import từ main.jsx
import loginBg from "../../assets/login-bg.png";
import bagpackSvg from "../../assets/bagpack-svgrepo-com.svg";
import eLearningSvg from "../../assets/e-learning-svgrepo-com.svg";
import researchSvg from "../../assets/research-svgrepo-com.svg";
import studentSvg from "../../assets/student-svgrepo-com.svg";

// API Configuration từ biến môi trường
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5182/api";
const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "1059017246677-b4j4rqlgqvog2dnssqcn41ch8741npet.apps.googleusercontent.com";
const GOOGLE_REDIRECT_URI =
  import.meta.env.VITE_GOOGLE_REDIRECT_URI ||
  "http://localhost:3000/auth/google/callback";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [step, setStep] = useState("phone"); // 'phone', 'otp', 'password-setup', 'login'
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Nếu đã đăng nhập thì tự động chuyển hướng về dashboard đúng role
  useEffect(() => {
    if (isAuthenticated()) {
      const role = localStorage.getItem("role");
      if (role) {
        navigate(`/${role}`, { replace: true });
      }
    }
  }, [isAuthenticated, navigate]);

  // Countdown timer cho resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Kiểm tra số điện thoại đã verify chưa
  const checkPhoneVerification = async (phoneNumber) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/auth/is-verified/${phoneNumber}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Gửi OTP
  const sendOTP = async (phoneNumber) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/send-otp`, {
        phoneNumber,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Xác thực OTP
  const verifyOTP = async (phoneNumber, otpCode) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
        phoneNumber,
        otp: otpCode,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Cập nhật mật khẩu
  const updatePassword = async (phoneNumber, newPassword) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/User/update-password`,
        { phoneNumber, password: newPassword }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Validation chỉ nhận số cho số điện thoại
  const handlePhoneInput = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setPhoneNumber(value);
  };

  // Xử lý submit số điện thoại
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      setError("Vui lòng nhập số điện thoại!");
      return;
    }
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const verificationStatus = await checkPhoneVerification(phoneNumber);

      if (verificationStatus.success && verificationStatus.data) {
        // Nếu đã verify thì chuyển sang form đăng nhập
        setStep("login");
      } else {
        await sendOTP(phoneNumber);
        setStep("otp");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Có lỗi xảy ra! Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  // Xử lý submit OTP
  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Vui lòng nhập mã OTP!");
      return;
    }
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const verificationResult = await verifyOTP(phoneNumber, otp);
      if (verificationResult.success) {
        setStep("password-setup");
      } else {
        setError("Mã OTP không chính xác!");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Có lỗi xảy ra! Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  // Xử lý submit mật khẩu mới
  const handlePasswordSetup = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ mật khẩu!");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      await updatePassword(phoneNumber, password);
      setStep("login");
      setPassword("");
      setConfirmPassword("");
      setSuccessMsg("Tạo mật khẩu thành công! Vui lòng đăng nhập.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Có lỗi xảy ra! Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password) {
      setError("Vui lòng nhập mật khẩu!");
      return;
    }
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        phoneNumber,
        password,
      });
      const { success, data } = response.data;
      if (!success || !data?.token || !data?.roleName) {
        setError("Đăng nhập thất bại hoặc dữ liệu phản hồi không hợp lệ!");
        return;
      }
      const { token, userId, roleName } = data;
      await login(token, roleName, Number(userId), "");
      setSuccessMsg("Đăng nhập thành công! Đang chuyển hướng...");
      setTimeout(() => navigate(`/${roleName.toLowerCase()}`), 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlebacktoLogin = () => {
    setStep("phone");
    setError("");
    setSuccessMsg("");
    setOtp("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleGoogleLogin = () => {
    const scope = "email profile";
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      GOOGLE_REDIRECT_URI
    )}&response_type=code&scope=${encodeURIComponent(
      scope
    )}&access_type=offline`;

    window.location.href = googleAuthUrl;
  };

  const renderForm = () => {
    switch (step) {
      case "phone":
        return (
          <>
            <form onSubmit={handlePhoneSubmit} autoComplete="off">
              <div className="form-group">
                <div className="login-title">
                  Đăng nhập để truy cập hệ thống
                </div>
                {/* <div className="login-subtitle">Đăng nhập để truy cập hệ thống</div> */}
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Nhập số điện thoại"
                  value={phoneNumber}
                  onChange={handlePhoneInput}
                  required
                  pattern="[0-9]*"
                  inputMode="numeric"
                />
                <i
                  className="fas fa-phone input-icon"
                  style={{
                    marginTop: "25px",
                    animation: "pulse 1s ease-in-out infinite both ",
                  }}
                ></i>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>Đang xử lý...
                  </>
                ) : (
                  "Tiếp tục"
                )}
              </button>
            </form>
            <div className="divider">
              <span>Hoặc đăng nhập bằng</span>
            </div>
            <button onClick={handleGoogleLogin} className="btn google-btn">
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
              />
              Đăng nhập bằng Google
            </button>
          </>
        );
      case "otp":
        return (
          <form onSubmit={handleOTPSubmit} autoComplete="off">
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="Nhập mã OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <i className="fas fa-key input-icon"></i>
            </div>
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handlebacktoLogin}
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>Đang xác thực...
                  </>
                ) : (
                  "Xác thực OTP"
                )}
              </button>
            </div>
          </form>
        );
      case "password-setup":
        return (
          <form onSubmit={handlePasswordSetup} autoComplete="off">
            <div className="form-group">
              <input
                type="password"
                className="form-input"
                placeholder="Nhập mật khẩu mới"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i className="fas fa-lock input-icon"></i>
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-input"
                placeholder="Xác nhận mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <i className="fas fa-lock input-icon"></i>
            </div>
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handlebacktoLogin}
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>Đang cập nhật...
                  </>
                ) : (
                  "Cập nhật mật khẩu"
                )}
              </button>
            </div>
          </form>
        );
      case "login":
        return (
          <form onSubmit={handleLogin} autoComplete="off">
            <div className="form-group">
              <div className="login-title">Vui lòng nhập mật khẩu</div>
              <input
                type="tel"
                className="form-input"
                value={phoneNumber}
                disabled
              />
              <i
                className="fas fa-phone input-icon"
                style={{
                  marginTop: "25px",
                  animation: "pulse 1s ease-in-out infinite both ",
                }}
              ></i>
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-input"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className="fas fa-lock input-icon"
                style={{
                  marginTop: "-7px",
                  animation: "pulse 1s ease-in-out infinite both ",
                }}
              ></i>
            </div>
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handlebacktoLogin}
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>Đang đăng nhập...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </button>
            </div>
          </form>
        );
    }
  };

  return (
    <div className="login-bg">
      {/* SVG động nền ở 2 góc */}
      <svg
        className="corner-animated-bg top-left-bg"
        viewBox="0 0 200 200"
        preserveAspectRatio="none"
      >
        <circle cx="100" cy="100" r="80" fill="#fee440" opacity="0.6">
          <animate
            attributeName="cx"
            values="100;150;100"
            dur="8s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values="100;50;100"
            dur="10s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="50" cy="150" r="60" fill="#3ddc97" opacity="0.5">
          <animate
            attributeName="cx"
            values="50;30;50"
            dur="7s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values="150;120;150"
            dur="9s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      <svg
        className="corner-animated-bg bottom-right-bg"
        viewBox="0 0 200 200"
        preserveAspectRatio="none"
      >
        <circle cx="100" cy="100" r="70" fill="#4361ee" opacity="0.6">
          <animate
            attributeName="cx"
            values="100;50;100"
            dur="6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values="100;150;100"
            dur="8s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="150" cy="50" r="50" fill="#ff6b6b" opacity="0.5">
          <animate
            attributeName="cx"
            values="150;170;150"
            dur="5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values="50;80;50"
            dur="7s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      {/* SVG động các góc */}
      <img src={bagpackSvg} alt="bagpack" className="corner-svg top-left-svg" />
      <img
        src={eLearningSvg}
        alt="e-learning"
        className="corner-svg top-right-svg"
      />
      <img
        src={researchSvg}
        alt="research"
        className="corner-svg bottom-left-svg"
      />
      <img
        src={studentSvg}
        alt="student"
        className="corner-svg bottom-right-svg"
      />

      <div className="login-container">
        <div className="login-logo">
          <i className="fas fa-heartbeat"></i>
          <span>School Health</span>
        </div>
        <div className="login-title">Hệ thống sức khỏe học đường</div>

        <div className="login-box">
          {error && <div className="alert alert-danger">{error}</div>}
          {successMsg && (
            <div
              className="alert alert-success"
              style={{
                background: "#E8F5E9",
                color: "#388E3C",
                border: "1px solid #C8E6C9",
              }}
            >
              {successMsg}
            </div>
          )}
          {renderForm()}
        </div>
      </div>
    </div>
  );
};

export default Login;
