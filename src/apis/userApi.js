import axiosClient from '../configs/axiosClient';

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
    getSentRequests: () => {
        return axiosClient.get(`/friend-requests/getSentRequest`);
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
    },
    addFriend: (data) => {
        return axiosClient.post('/friend-requests/add-friend', data);
    },
    acceptFriendRequest: (requestId, status) => {
        return axiosClient.patch(`/friend-requests/update/${requestId}`, { status });
    }
};

export default userApi;
