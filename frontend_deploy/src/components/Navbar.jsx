import React from "react";
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { FaUsers } from "react-icons/fa";

const Navbar = () => {
  return (
    <Nav className="mr-auto">
      <Nav.Link as={Link} to="/admin/accounts">
        <FaUsers /> Người dùng
      </Nav.Link>
    </Nav>
  );
};

export default Navbar;
