import React from "react";
import { Link } from "react-router-dom";

const LoginLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header with only logo */}
      <header className="header">
        <nav className="navbar navbar-light bg-white shadow-sm">
          <div className="container">
            <Link className="navbar-brand fw-bold text-primary" to="/">
              <i className="fas fa-heartbeat me-2"></i>School Health
            </Link>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-grow-1">{children}</main>
    </div>
  );
};

export default LoginLayout;
