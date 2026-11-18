import axios from "axios";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://thehealingstar.onrender.com").replace(/\/$/, "");

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});
