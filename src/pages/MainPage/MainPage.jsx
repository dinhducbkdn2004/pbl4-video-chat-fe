import { Outlet, Navigate } from 'react-router-dom';
import SideBar from './SideBar';

const MainPage = ({ setIsDarkMode, isDarkMode }) => {
    return (
        <>
            <div className='flex h-screen overflow-hidden bg-white-dark p-4 dark:bg-black-default'>
                <SideBar setIsDarkMode={setIsDarkMode} isDarkMode={isDarkMode} className='w-88' /> {/* 350px */}

                <div className='ml-4 flex-1 bg-white-dark dark:bg-black-default'>
                    <Outlet />
                </div>
            </div>
        </>
    );
};

MainPage.propTypes = {};

export default MainPage;
