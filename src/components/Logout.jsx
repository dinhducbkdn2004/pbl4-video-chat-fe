import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authActions } from '../redux/features/auth/authSlice';
import { useSocket } from './../hooks/useSocket';

export const handleLogout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { socket } = useSocket();
    return () => {
        dispatch(authActions.logout());
        navigate('/login');
        socket.close();
    };
};

export default handleLogout;
