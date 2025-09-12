import axios from "axios";

const BASE_URL = "http://localhost:9000";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllUsers = () => axios.get(`${BASE_URL}/api/users`);
export const createUser = (user) => axios.post(`${BASE_URL}/api/users`, user);
export const loginUser = (credentials) => axios.post(`${BASE_URL}/api/users/login`, credentials);

export const uploadFile = (formData) =>
  axios.post(`${BASE_URL}/upload`, formData, { headers: { "Content-Type": "multipart/form-data", ...authHeader() } });

export const getFiles = (email) => axios.get(`${BASE_URL}/files/${email}`, { headers: authHeader() });

export const deleteFile = (email, filename) => axios.delete(`${BASE_URL}/delete/${email}/${filename}`, { headers: authHeader() });
