import { Navigate } from "react-router-dom";
import axiosClient from "../configs/axiosClient";

const authApi = {
    login: async function (email, password) {
        return axiosClient.post("/auth/login", {
            email,
            password,
        });
    },
    resetAccessToken: async function (refreshToken) {
        return axiosClient.put("/auth/reset-token", {
            refreshToken,
        });
    },
    logout: async function () {
        localStorage.removeItem("ACCESS_TOKEN");
        localStorage.removeItem("REFRESH_TOKEN");
    },
};

export default authApi;
