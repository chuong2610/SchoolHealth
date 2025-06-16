import React from "react";
import { Link, Outlet } from "react-router-dom";

const LoginLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Main content */}
      
      <main className="flex-grow-1">
        <Outlet />
      </main>
    </div>
  );
};

export default LoginLayout;
