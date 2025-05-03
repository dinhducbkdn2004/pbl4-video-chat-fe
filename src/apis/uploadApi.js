import axios from 'axios';
import axiosClient from '../configs/axiosClient';
import typeOfFile from '../helpers/typeOfFile';

const uploadApi = {
    getPresignedUrl: async function (folder, fileName) {
        return axiosClient.post('/upload/get-presigned-url', {
            folder,
            fileName
        });
    },
    upload: async function (file, folder) {
        const res = await this.getPresignedUrl(folder, file.name);
        const formData = new FormData();

        formData.append('file', file);
        formData.append('api_key', res.data.apiKey);
        formData.append('timestamp', res.data.timestamp);
        formData.append('signature', res.data.signature);
        formData.append('folder', res.data.folder); // Thư mục lưu trữ
        formData.append('public_id', res.data.public_id); // Đặt tên gốc làm public_id

        let uploadEndpoint;
        switch (typeOfFile(file)) {
            case 'Picture':
                uploadEndpoint = `https://api.cloudinary.com/v1_1/${res.data.cloudName}/image/upload`;
                break;
            case 'Video':
                uploadEndpoint = `https://api.cloudinary.com/v1_1/${res.data.cloudName}/video/upload`;
                break;
            case 'Document':
                uploadEndpoint = `https://api.cloudinary.com/v1_1/${res.data.cloudName}/raw/upload`;
                break;
            default:
                throw new Error('Unsupported file type');
        }

        // Upload trực tiếp lên Cloudinary
        const { status, data } = await axios.post(uploadEndpoint, formData, {
            withCredentials: false
        });
        return {
            status,
            data
        };
    }
};

export default uploadApi;
