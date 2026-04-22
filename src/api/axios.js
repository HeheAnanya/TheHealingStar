import axios from "axios";

export const api = axios.create({
    // baseURL:"https://thehealingstar.onrender.com",
    baseURL: "http://localhost:3000",
    withCredentials: true
    // headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")?.replace(/"/g, "")}`
    // }
});


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const refreshToken = localStorage.getItem("refreshToken")
            if (refreshToken) {
                try {
                    const res = await axios.post("http://localhost:3000/auth/refresh", {
                        refreshToken: JSON.parse(refreshToken)
                    })
                    localStorage.setItem("token", JSON.stringify(res.data.accessToken))
                    error.config.headers.Authorization = `Bearer ${res.data.accessToken}`
                    return api.request(error.config) // retry original request
                } catch {
                    localStorage.removeItem("token")
                    localStorage.removeItem("refreshToken")
                    window.location.href = "/login"
                }
            }
        }
        return Promise.reject(error)
    }
)