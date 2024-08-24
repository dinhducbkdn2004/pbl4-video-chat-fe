import axios from "axios";
import envClient from "../env";
import authApi from "../apis/authApi";

const axiosClient = axios.create({
    baseURL: envClient.VITE_BASE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

axiosClient.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
        console.log(error.response);

        switch (error.response.status) {
            case 401: {
                authApi.logout();
                break;
            }

            case 410: {
                const refreshToken = localStorage.getItem("REFRESH_TOKEN");
                const data = authApi.resetAccessToken(refreshToken);
                break;
            }

            default: {
                if (error.response?.data) throw error.response.data;
                throw error.response;
            }
        }
    }
);

export default axiosClient;
