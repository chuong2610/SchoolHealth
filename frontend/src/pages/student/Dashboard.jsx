import React from "react";
import { Routes, Route } from "react-router-dom";

const StudentDashboard = () => {
  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <h1 className="h3 mb-4">Dashboard</h1>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Lịch khám sắp tới</h5>
                  <p className="card-text display-4">1</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Số lần khám trong tháng</h5>
                  <p className="card-text display-4">2</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Thông báo mới</h5>
                  <p className="card-text display-4">2</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
