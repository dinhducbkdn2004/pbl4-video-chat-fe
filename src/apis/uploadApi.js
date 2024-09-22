import axios from 'axios';
import axiosClient from '../configs/axiosClient';

const uploadApi = {
    getPresignedUrl: async function (folder) {
        return axiosClient.post('/upload/get-presigned-url', {
            folder
        });
    },
    upload: async function (file, folder) {
        const res = await this.getPresignedUrl(folder);
        const formData = new FormData();
        formData.append('file', file); // The image file to upload
        formData.append('api_key', res.data.apiKey);
        formData.append('timestamp', res.data.timestamp);
        formData.append('signature', res.data.signature);
        formData.append('folder', res.data.folder); // Optional: folder where to store the image

        // Step 2: Upload the image directly to Cloudinary
        const { status, data } = await axios.post(
            `https://api.cloudinary.com/v1_1/${res.data.cloudName}/image/upload`,
            formData,
            {
                withCredentials: false
            }
        );
        return {
            status,
            data
        };
    }
};

export default uploadApi;
