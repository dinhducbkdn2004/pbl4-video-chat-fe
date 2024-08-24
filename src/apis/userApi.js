import axiosClient from "../configs/axiosClient";

const userApi = {
    getProfile: () => {
        return axiosClient.get("/users/me");
    },
};
export default userApi;
