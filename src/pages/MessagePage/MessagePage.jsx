import { Layout, Button } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import ChatList from './ChatList/ChatList';
import { useState, useEffect } from 'react';

const { Content, Sider } = Layout;

const MessagePage = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [showChatList, setShowChatList] = useState(true);
    const location = useLocation();

    // Kiểm tra kích thước màn hình
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);

            // Nếu đang ở trong một cuộc trò chuyện và đang ở chế độ mobile
            const inChatRoom = location.pathname.includes('/message/') && location.pathname !== '/message';
            if (mobile && inChatRoom) {
                setShowChatList(false);
            } else if (!mobile) {
                setShowChatList(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [location.pathname]);

    // Xử lý khi chuyển đổi trang hoặc vào một phòng chat
    useEffect(() => {
        if (isMobile) {
            const inChatRoom = location.pathname.includes('/message/') && location.pathname !== '/message';
            setShowChatList(!inChatRoom);
        }
    }, [location.pathname, isMobile]);

    return (
        <div className='h-full w-full overflow-hidden'>
            <div className='relative flex h-full w-full'>
                {/* Chat List */}
                <div
                    className={`absolute h-full md:relative ${
                        isMobile ? (showChatList ? 'w-full' : 'w-0') : 'w-[350px]'
                    } z-20 transition-all duration-300 ease-in-out ${
                        isMobile && !showChatList ? '-translate-x-full' : 'translate-x-0'
                    }`}
                >
                    {(showChatList || !isMobile) && (
                        <div className='h-full overflow-hidden rounded-lg bg-white-dark dark:bg-black-light'>
                            <ChatList onSelectChat={() => isMobile && setShowChatList(false)} />
                        </div>
                    )}
                </div>

                {/* Chat Room Content */}
                <div
                    className={`absolute h-full w-full transition-all duration-300 ease-in-out md:relative ${
                        isMobile
                            ? showChatList
                                ? 'translate-x-full opacity-0'
                                : 'translate-x-0 opacity-100'
                            : 'ml-2 opacity-100'
                    }`}
                    style={{
                        visibility: isMobile && showChatList ? 'hidden' : 'visible',
                        flex: isMobile ? 'none' : '1'
                    }}
                >
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default MessagePage;
