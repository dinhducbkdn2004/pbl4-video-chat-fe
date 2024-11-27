import axiosClient from '../configs/axiosClient';

const notificationsApi = {
    getAll: async (page = 1, limit = 10) => {
        return axiosClient.get('/notifications', {
            params: {
                page,
                limit
            }
        });
    },

    seenNotification: async () => {
        return axiosClient.patch(`/notifications/seen-notification`);
    },

    updatedNotification: async (notificationId, isRead) => {
        // isRead = true or false
        return axiosClient.patch(`/notifications/update-notification`, {
            notificationId,
            isRead
        });
    },

    deleteNotification: async (notificationId) => {
        return axiosClient.delete(`/notifications/delete-notification/${notificationId}`);
    }
};

export default notificationsApi;
