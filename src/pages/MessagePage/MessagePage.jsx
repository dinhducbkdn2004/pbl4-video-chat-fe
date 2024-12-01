import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import ChatList from './ChatList/ChatList';
const { Content, Sider } = Layout;

const MessagePage = () => {
    return (
        <>
            <Layout className=' bg-white-dark dark:bg-black-default'>
                <Sider
                    className='rounded-lg h-100vh bg-white-dark dark:bg-black-light'
                    width={385}
                    breakpoint='md'
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
