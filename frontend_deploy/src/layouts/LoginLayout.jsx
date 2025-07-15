import React from "react";
import { Outlet } from "react-router-dom";

const LoginLayout = () => {
  return (
    <div className="login-bg">
      <Outlet />
    </div>
  );
};

export default LoginLayout;
