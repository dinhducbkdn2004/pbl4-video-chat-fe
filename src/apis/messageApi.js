import axiosClient from '../configs/axiosClient';

const messageApi = {
    fetchSEOData: async function (url) {
        return axiosClient.get('/messages/get-seo-data', {
            params: {
                url
            }
        });
    }
};

export default messageApi;
