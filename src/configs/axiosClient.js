import axios from 'axios';

import authApi from '../apis/authApi';

import { authActions } from '../redux/features/auth/authSlice';
import { store } from './../redux/store';
import envClient from '../env';

const axiosClient = axios.create({
    baseURL: envClient.VITE_BASE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

axiosClient.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },

    async (error) => {
        const originalRequest = error.config;

        switch (error.response.status) {
            case 401: {
                break;
            }

            case 410: {
                if (!originalRequest._retry) {
                    originalRequest._retry = true;
                    const refreshToken = localStorage.getItem('REFRESH_TOKEN');
                    const { isOk, data } = await authApi.resetAccessToken(refreshToken);

                    if (isOk) {
                        const { accessToken } = data;
                        localStorage.setItem('ACCESS_TOKEN', accessToken);
                        store.dispatch(
                            authActions.setCredentials({
                                accessToken,
                                refreshToken
                            })
                        );

                        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                        return axiosClient(originalRequest);
                    }
                    store.dispatch(authActions.logout());
                    return Promise.reject(error);
                }
                store.dispatch(authActions.logout());
                return Promise.reject(error);
            }

            default: {
                if (error.response?.data) throw error.response.data;
                throw error.response;
            }
        }
    }
);

export default axiosClient;
