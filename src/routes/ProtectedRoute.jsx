import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { authSelector } from '../redux/features/auth/authSelections';
import { useEffect } from 'react';
import Loading from '../components/Loading/Loading';
import useFetch from '../hooks/useFetch';
import userApi from '../apis/userApi';
import { authActions } from '../redux/features/auth/authSlice';

const ProtectedRoute = () => {
    const { isAuthenticated } = useSelector(authSelector);
    const { fetchData, isLoading } = useFetch({ showError: false, showSuccess: false });
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            if (isAuthenticated) {
                const { isOk, data } = await fetchData(userApi.getProfile);

                if (!isOk) dispatch(authActions.logout());

                dispatch(authActions.setProfile(data));
            }
        })();
    }, [fetchData, isAuthenticated, dispatch]);

    if (isLoading) return <Loading />;
    if (isAuthenticated) return <Outlet />;
    return <Navigate to='/login' replace={true} />;
};

export default ProtectedRoute;
