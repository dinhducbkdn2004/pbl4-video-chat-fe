import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import ChatList from './ChatList/ChatList';
const { Content, Sider } = Layout;

const MessagePage = () => {
    return (
        <>
            <Layout className='bg-white-dark dark:bg-black-default'>
                <Sider
                    className='h-100vh rounded-lg bg-white-dark dark:bg-black-light'
                    width={385}
                    breakpoint='sm'
                    collapsedWidth='0'
                >
                    <ChatList />
                </Sider>
                <Content className='bg-white-dark dark:bg-black-default'>
                    <Outlet />
                </Content>
            </Layout>
        </>
    );
};

export default MessagePage;
