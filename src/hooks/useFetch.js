import { notification } from 'antd';
import { useState, useEffect } from 'react';

const useFetch = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification({
        showProgress: true
    });
    const [notificationData, setNotificationData] = useState(null);

    useEffect(() => {
        if (notificationData) {
            if (notificationData.type === 'success') {
                api.success({
                    message: 'Success!',
                    description: notificationData.message
                });
            } else if (notificationData.type === 'error') {
                api.error({
                    message: 'Error!',
                    description: notificationData.message
                });
            }
        }
    }, [notificationData, api]);

    const fetchData = async (cb) => {
        try {
            setIsLoading(true);

            const data = await cb();

            setNotificationData({ type: 'success', message: data.message });
            return data;
        } catch (error) {
            console.error(error);
            setNotificationData({ type: 'error', message: error.message });
            return error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        contextHolder,
        fetchData,
        isLoading
    };
};

export default useFetch;
