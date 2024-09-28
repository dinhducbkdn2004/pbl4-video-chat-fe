import axiosClient from '../configs/axiosClient';

const notificationsApi = {
    getAll: async () => {
        return axiosClient.get('/notifications');
    }
};

export default notificationsApi;