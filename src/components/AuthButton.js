import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AuthButton.css";

const AuthButton = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="auth-button-container">
      {user ? (
        <div className="auth-button-logged-in">
          <span className="auth-button-username">Hi, {user.username}</span>
          <button onClick={handleLogout} className="auth-button-logout">
            Logout
          </button>
        </div>
      ) : (
        <Link to="/login" className="auth-button-login">
          Login
        </Link>
      )}
    </div>
  );
};

export default AuthButton;
