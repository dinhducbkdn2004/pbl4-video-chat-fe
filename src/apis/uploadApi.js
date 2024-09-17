import axiosClient from '../configs/axiosClient';

const uploadApi = {
    getPresignedUrl: async function (publicId, folder) {
        return axiosClient.post('/upload/get-presigned-url', {
            publicId,
            folder
        });
    },
    upload: async function (file, publicId, folder) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await this.getPresignedUrl(publicId, folder);
        if (res.isOk) {
            console.log(res.data.url);

            const uploadResponse = await axiosClient.post(res.data.url, formData);
            console.log('Thaành công');

            console.log(uploadResponse);
        }
    }
};

export default uploadApi;
