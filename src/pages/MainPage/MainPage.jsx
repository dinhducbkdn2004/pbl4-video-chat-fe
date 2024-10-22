import { Outlet, Navigate } from 'react-router-dom';
import SideBar from './SideBar';

const MainPage = () => {
    return (
        <>
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
