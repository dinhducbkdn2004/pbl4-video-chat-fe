import { useEffect, useState } from 'react';
import { notificationsApi } from '../../apis/notificationApi';
import Container from '../../components/Container';
import Loading from '../../components/Loading/Loading';
import useFetch from '../../hooks/useFetch';

const NotificationPage = () => {
    const { fetchData, isLoading } = useFetch({ showSuccess: false, showError: false });
    const [notifications, setNotifications] = useState([]);
    useEffect(() => {
        (async () => {
            const { data, isOk } = fetchData(() => notificationsApi.getAll());
            if (isOk) setNotifications(data);
        })();
    }, []);
    console.log(notifications);
    if (isLoading) return <Loading />;
    return <Container></Container>;
};

export default NotificationPage;
