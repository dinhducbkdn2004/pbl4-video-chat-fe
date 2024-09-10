import axiosClient from '../configs/axiosClient';
import { getSocket } from '../configs/socketInstance';

const userApi = {
    getProfile: () => {
        return axiosClient.get('/users/me');
    },
    getUser: (userId) => {
        return axiosClient.get(`/users/get-detail/${userId}`);
    },
    getAllUser: () => {
        return axiosClient.get(`/users/getAll`);
    },
    getFriendRequest: (page, limit) => {
        return axiosClient.get(`/users/friend-request`, {
            params: {
                page,
                limit
            }
        });
    },
    addFriend: (senderId, type) => {
        const socket = getSocket();
        socket.emit('client-update-friend-request', senderId, type);
    },
    getFriendList: (userId) => {
        return axiosClient.get(`/users/get-detail/${userId}/friend-list`);
    },
    searchUsers: (name, page = 1, limit = 10) => {
        return axiosClient.get('/search/users', {
            params: {
                name,
                page,
                limit
            }
        });
    }
};
export default userApi;
