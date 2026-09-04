import axios from "axios";

const API = "http://localhost:5000/api/auth";

export const loginUser = async (data) => {
  const res = await axios.post(`${API}/login`, data);
  localStorage.setItem("token", res.data.token);
  return res.data.user;
};

export const signupUser = async (data) => {
  const res = await axios.post(`${API}/signup`, data);
  localStorage.setItem("token", res.data.token);
  return res.data.user;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const res = await axios.get(`${API}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};
