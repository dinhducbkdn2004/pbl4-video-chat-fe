import axios from "axios";
import envClient from "../env";

const axiosClient = axios.create({
    baseURL: envClient.BASE_API_URL,
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
        return response;
    },
    (error) => {
        // Handle response errors
        console.error("API error:", error);
        throw error;
    }
);

export default axiosClient;
