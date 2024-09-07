import axiosClient from "../configs/axiosClient";

const userApi = {
    getProfile: () => {
        return axiosClient.get("/users/me");
    },
    getUser: (userId) => {
        return axiosClient.get(`/users/${userId}`);
    },
};
export default userApi;
