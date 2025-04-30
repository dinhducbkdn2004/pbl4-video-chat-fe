import { Outlet, Navigate } from 'react-router-dom';
import SideBar from './SideBar';
import { useState, useEffect } from 'react';

const MainPage = ({ setIsDarkMode, isDarkMode }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize(); // Kiểm tra kích thước ban đầu
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className='flex h-screen overflow-hidden bg-white-dark dark:bg-black-default'>
            <SideBar setIsDarkMode={setIsDarkMode} isDarkMode={isDarkMode} isMobile={isMobile} />

            <div className={`flex-1 transition-all duration-300 ${isMobile ? 'pl-0' : 'pl-[4px]'}`}>
                <main className={`h-full overflow-auto p-4 ${isMobile ? 'pl-2' : 'pl-[4px]'}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

MainPage.propTypes = {};

export default MainPage;
