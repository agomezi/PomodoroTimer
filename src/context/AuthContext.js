import React, { createContext, useState, useContext, useEffect } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  getProfile,
  isAuthenticated,
  clearTokens,
} from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          const profile = await getProfile();
          setUser(profile);
        } catch (error) {
          console.error("Failed to fetch user profile: ", error);
          clearTokens();
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      await apiLogin(username, password);
      const profile = await getProfile();
      setUser(profile);
      return profile;
    } catch (error) {
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      await apiRegister(username, email, password);
      await login(username, password);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used witihin an AuthProvider");
  }
  return context;
};
