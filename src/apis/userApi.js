import axiosClient from '../configs/axiosClient';
import { getSocket, initializeSocket } from '../configs/socketInstance';

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
        return axiosClient.get(`/friend-requests/get-my`, {
            params: {
                page,
                limit
            }
        });
    },
    addFriend: (senderId, type) => {
        let socket = getSocket();
        if (!socket) {
            socket = initializeSocket();
        }
        if (socket) {
            socket.emit('client-update-friend-request', senderId, type);
        } else {
            console.error('Socket is not defined');
        }
    },
    getFriendList: (userId) => {
        return axiosClient.get(`/users/get-detail/${userId}/friend-list`);
    },
    searchUsers: (name, page = 1, limit = 10) => {
        return axiosClient.get('/users/search', {
            params: {
                name,
                page,
                limit
            }
        });
    },
    editProfile: (data) => {
        return axiosClient.patch('/users/me/edit-profile', data);
    }
};

export default userApi;
