import { Layout } from 'antd';
import ChatList from './ChatList/ChatList';
import { Outlet } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';

import './MessagePage.scss';

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
                <Content>
                    <Outlet />
                </Content>
            </Layout>
        </>
    );
};

export default MessagePage;
