import axios from "axios";
import envClient from "../env";

const axiosClient = axios.create({
    baseURL: envClient.BASE_API_URL || "http://localhost:3000/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

axiosClient.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("Authorization");
        if (token) {
            config.headers.Authorization = `Bare ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        // Handle response errors
        console.error("API error:", error.response.data);
        if (error.response.data) throw error.response.data;
        throw error;
    }
);

export default axiosClient;
