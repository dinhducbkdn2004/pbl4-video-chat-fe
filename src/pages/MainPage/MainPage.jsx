import { useEffect } from 'react';
import useFetch from '../../hooks/useFetch';

import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { authSelector } from '../../redux/features/auth/authSelections';
import { authActions } from '../../redux/features/auth/authSlice';
import userApi from './../../apis/userApi';
import Loading from './../../components/Loading/Loading';
import { store } from './../../redux/store';

import SideBar from './SideBar';

const MainPage = () => {
    const { isAuthenticated } = useSelector(authSelector);
    const { fetchData, isLoading, contextHolder } = useFetch();

    useEffect(() => {
        (async () => {
            if (isAuthenticated) {
                const { isOk, data } = await fetchData(userApi.getProfile);
                if (isOk) {
                    // initializeSocket();
                    store.dispatch(authActions.setProfile(data));
                    return;
                }
                store.dispatch(authActions.logout());
            } else {
                store.dispatch(authActions.logout());
            }
        })();
    }, []);
    if (isLoading) return <Loading />;

    return (
        <>
            {contextHolder}
            <div className='flex h-screen'>
                <SideBar className='w-88' /> {/* 350px */}
                <div className='h-screen flex-1 overflow-auto bg-white-default'>
                    <Outlet />
                </div>
            </div>
        </>
    );
};

MainPage.propTypes = {};

export default MainPage;
