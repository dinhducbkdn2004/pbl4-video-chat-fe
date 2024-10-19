import axiosClient from '../configs/axiosClient';

const notificationsApi = {
    getAll: async () => {
        return axiosClient.get('/notifications');
    },

    seenNotification: async (notificationId) => {
        return axiosClient.patch('/notifications/seen-notification', { notificationId });
    },
};

export default notificationsApi;