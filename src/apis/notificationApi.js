import axiosClient from '../configs/axiosClient';

export const notificationsApi = {
    getAll: async () => {
        return axiosClient.get('/notifications');
    }
};
