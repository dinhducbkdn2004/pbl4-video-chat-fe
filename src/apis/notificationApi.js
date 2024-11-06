import axiosClient from '../configs/axiosClient';

const notificationsApi = {
    getAll: async (page = 1, limit = 10) => {
        return axiosClient.get('/notifications', {
            params: {
                page,
                limit,
            },
        });
    },

    seenNotification: async (notificationId) => {
        return axiosClient.patch('/notifications/seen-notification', { notificationId });
    },
};

export default notificationsApi;