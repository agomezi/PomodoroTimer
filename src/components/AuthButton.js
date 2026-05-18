import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProgress } from "../api/api";
import "./AuthButton.css";

const AuthButton = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [sessionsToday, setSessionsToday] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchSessionCount = async () => {
      try {
        const progressData = await getProgress(1);
        if (progressData && progressData.length > 0) {
          const todayData = progressData[0];
          setSessionsToday(todayData.focus_sessions_completed || 0);
        } else {
          setSessionsToday(0);
        }
      } catch (error) {
        console.error("Failed to fetch session count: ", error);
        setSessionsToday(0);
      }
    };

    fetchSessionCount();

    const interval = setInterval(fetchSessionCount, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="auth-button-container">
      {user ? (
        <div className="auth-button-logged-in">
          <div className="auth-button-user-info">
            <span className="auth-button-username">Hi, {user.username}</span>
            <span className="auth-button-sessions">
              ✅ {sessionsToday} {sessionsToday === 1 ? "session" : "sessions"}{" "}
              today
            </span>
          </div>

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
