import { useEffect } from 'react';

const useNotificationTitle = (notifications) => {
    useEffect(() => {
        if (notifications.length > 0) {
            const originalTitle = document.title;
            const newTitle = 'Bạn có 1 thông báo mới!';
            let isOriginalTitle = true;

            const intervalId = setInterval(() => {
                document.title = isOriginalTitle ? newTitle : originalTitle;
                isOriginalTitle = !isOriginalTitle;
            }, 1000);

            const timeoutId = setTimeout(() => {
                clearInterval(intervalId);
                document.title = originalTitle;
            }, 10000);

            return () => {
                clearInterval(intervalId);
                clearTimeout(timeoutId);
                document.title = originalTitle;
            };
        }
    }, [notifications]);
};

export default useNotificationTitle;