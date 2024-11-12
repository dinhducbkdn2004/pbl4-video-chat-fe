import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import ChatList from './ChatList/ChatList';
import './MessagePage.css'; // Import the CSS file

const { Content, Sider } = Layout;

const MessagePage = () => {
    return (
        <>
            <Layout style={{ height: '100vh' }}>
                <Sider width={385} breakpoint='md' collapsedWidth='0'>
                    <ChatList />
                </Sider>
                <Content className='bg-white-default'>
                    <Outlet />
                </Content>
            </Layout>
        </>
    );
};

export default MessagePage;
