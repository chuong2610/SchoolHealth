import React, { useState } from "react";
import { Tabs, Tab, Form, Button } from "react-bootstrap";

const Settings = () => {
  const [key, setKey] = useState("account");
  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h3 className="mb-4">Cài đặt tài khoản</h3>
              <Tabs activeKey={key} onSelect={setKey} className="mb-3">
                <Tab
                  eventKey="account"
                  title={
                    <>
                      <i className="fas fa-user-cog me-2"></i>Tài khoản
                    </>
                  }
                >
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Tên đăng nhập</Form.Label>
                      <Form.Control value="admin123" readOnly />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Tên hiển thị</Form.Label>
                      <Form.Control value="Nguyễn Văn Admin" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value="admin@schoolhealth.com"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Ngôn ngữ</Form.Label>
                      <Form.Select defaultValue="vi">
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                      </Form.Select>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Lưu thay đổi
                    </Button>
                  </Form>
                </Tab>
                <Tab
                  eventKey="notification"
                  title={
                    <>
                      <i className="fas fa-bell me-2"></i>Thông báo
                    </>
                  }
                >
                  <div className="py-3 text-muted">
                    Cài đặt thông báo (đang phát triển).
                  </div>
                </Tab>
                <Tab
                  eventKey="privacy"
                  title={
                    <>
                      <i className="fas fa-shield-alt me-2"></i>Quyền riêng tư
                    </>
                  }
                >
                  <div className="py-3 text-muted">
                    Cài đặt quyền riêng tư (đang phát triển).
                  </div>
                </Tab>
                <Tab
                  eventKey="security"
                  title={
                    <>
                      <i className="fas fa-lock me-2"></i>Bảo mật
                    </>
                  }
                >
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Mật khẩu hiện tại</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Mật khẩu mới</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        id="two-factor-auth"
                        label="Bật xác thực hai lớp"
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Lưu thay đổi
                    </Button>
                  </Form>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
