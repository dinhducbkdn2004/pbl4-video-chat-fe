import { Layout } from 'antd';
import ChatList from './ChatList/ChatList';
import { Outlet } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import assets from '../../assets';

const { Content, Sider } = Layout;

const MessagePage = () => {
    const { fetchData, isLoading, contextHolder } = useFetch();
    return (
        <>
            {contextHolder}
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
