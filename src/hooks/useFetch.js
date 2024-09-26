import { notification } from 'antd';
import { useState, useEffect, useCallback } from 'react';

const useFetch = (
    config = {
        showSuccess: true,
        showError: true
    }
) => {
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

    const fetchData = useCallback(
        async (cb) => {
            try {
                setIsLoading(true);

                const data = await cb();

                config?.showSuccess && setNotificationData({ type: 'success', message: data.message });
                return data;
            } catch (error) {
                console.error(error);
                config?.showError && setNotificationData({ type: 'error', message: error.message });
                return error;
            } finally {
                setIsLoading(false);
            }
        },
        [config.showError, config.showSuccess]
    );

    return {
        contextHolder,
        fetchData,
        isLoading
    };
};

export default useFetch;
