import React, { useEffect, useState } from "react";
import { Navbar, Nav, Form } from "react-bootstrap";
import "./style.css";
import { useNavigate } from "react-router-dom";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SearchIcon from "@mui/icons-material/Search";

const Header = ({ searchTerm, onSearchChange }) => {
  const navigate = useNavigate();

  const handleShowLogin = () => {
    navigate("/login");
  };

  const [user, setUser] = useState();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      const user = JSON.parse(localStorage.getItem("user"));
      setUser(user);
    }
  }, []);

  const handleShowLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Navbar className="navbarCSS" collapseOnSelect expand="lg">
      <Navbar.Brand href="/" className="navBrand">
        <div className="navLogoBox">
          <AccountBalanceWalletIcon sx={{ fontSize: 18, color: "#fff" }} />
        </div>
        <div>
          <div className="navTitle">Kharcha Tracker</div>
          {user && <div className="navGreeting">Namaste, {user.name} 👋</div>}
        </div>
      </Navbar.Brand>

      <Navbar.Toggle
        aria-controls="basic-navbar-nav"
        style={{ backgroundColor: "transparent", borderColor: "transparent" }}
      >
        <span
          className="navbar-toggler-icon"
          style={{
            background: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255, 255, 255)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e")`,
          }}
        ></span>
      </Navbar.Toggle>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Navbar.Collapse id="responsive-navbar-nav">
          {user && (
            <div className="navSearchBox">
              <SearchIcon sx={{ fontSize: 16, color: "#83839a" }} />
              <Form.Control
                type="text"
                placeholder="Search transactions..."
                value={searchTerm || ""}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                className="navSearchInput"
              />
            </div>
          )}

          {user && user.avatarImage && (
            <img
              src={user.avatarImage}
              alt="avatar"
              className="navAvatarImg"
              onClick={() => navigate("/setAvatar")}
              title="Change avatar"
            />
          )}

          {user ? (
            <Nav>
              <span className="navLogoutBtn" onClick={handleShowLogout}>
                Logout
              </span>
            </Nav>
          ) : (
            <Nav>
              <span className="navLoginBtn" onClick={handleShowLogin}>
                Login
              </span>
            </Nav>
          )}
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Header;