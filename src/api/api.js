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

    // Response contains: { access: "...", refresh: "..." }
    const { access, refresh } = response.data;

    // Automatically save tokens to localStorage
    saveTokens(access, refresh);

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Login failed");
  }
};
