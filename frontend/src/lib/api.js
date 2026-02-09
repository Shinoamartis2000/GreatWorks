import axios from "axios";

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API_BASE,
});

export const buildFileUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.REACT_APP_BACKEND_URL}${path}`;
};
