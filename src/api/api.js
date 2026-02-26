import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "applications/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const saveTokens = () => {
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};

export const register = async (username, email, password) => {
  try {
    const response = await api.post("/register/", {
      username,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Registration failed");
  }
};

export const login = async (username, password) => {
  try {
    const response = await api.post("/token/", {
      username,
      password,
    });

    const { access, refresh } = response.data;

    saveTokens(access, refresh);

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Login failed");
  }
};

export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await api.post("/token/refresh/", {
      refresh: refreshToken,
    });

    localStorage.setItem("access_token", response.data.access);
    return response.data.access;
  } catch (error) {
    clearTokens();
    throw new Error("Session expired. Please log in again.");
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get("/profile/");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to fetch profile");
  }
};

export const getSettings = async () => {
  try {
    const response = await api.get("/settings/");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail("Failed to fetch settings"));
  }
};

export const updateSettings = async (settingsData) => {
  try {
    const response = await api.put("/settings/", settingsData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to update settings",
    );
  }
};
