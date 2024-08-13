import axiosClient from "../configs/axiosClient";

const authService = {
    login: async function (email, password) {
        return axiosClient.post("/auth/login", {
            email,
            password,
        });
    },
};

export default authService;
