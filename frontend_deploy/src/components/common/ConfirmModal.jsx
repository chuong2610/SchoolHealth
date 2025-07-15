import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmModal = ({
  show,
  onHide,
  onConfirm,
  title = "Xác nhận",
  message = "Bạn có chắc chắn muốn thực hiện thao tác này?",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  confirmVariant = "danger",
  icon,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {icon && <span style={{ marginRight: 8 }}>{icon}</span>}
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ fontSize: "1.05rem" }}>{message}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {cancelText}
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
