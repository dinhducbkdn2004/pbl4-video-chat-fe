import Container from '../../components/Container';
import { useSocket } from '../../hooks/useSocket';

const NotificationPage = () => {
    const { notifications } = useSocket();
    console.log(notifications);

    return <Container></Container>;
};

export default NotificationPage;
