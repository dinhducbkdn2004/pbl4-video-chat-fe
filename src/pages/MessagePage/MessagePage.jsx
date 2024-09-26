import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import assets from '../../assets';
import ChatList from './ChatList/ChatList';

const { Content, Sider } = Layout;

const MessagePage = () => {
    return (
        <>
            <Layout style={{ height: '100vh' }}>
                <Sider width={350}>
                    <ChatList />
                </Sider>
                <Content
                    style={{
                        backgroundImage: `url(${assets.chatpage_2})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center'
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </>
    );
};

export default MessagePage;
