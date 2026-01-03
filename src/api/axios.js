import axios from "axios";

export const api = axios.create({
    baseURL:"https://thehealingstar.onrender.com",
    // baseURL: "http://localhost:3000",
    withCredentials: true
    // headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")?.replace(/"/g, "")}`
    // }
});



api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${JSON.parse(token)}`
    }
    return config
},
    (error) => {
        return Promise.reject(error);
    }
)