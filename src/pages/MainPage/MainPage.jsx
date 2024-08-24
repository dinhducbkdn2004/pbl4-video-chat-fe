import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Layout, Menu, theme } from "antd";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import SiderComponent from "../../components/SiderComponent";
import useFetch from "../../hooks/useFetch";
import userService from "../../apis/userApi";
import Logout from "../../components/Logout";
import useAuth from "../../hooks/useAuth";
const { Header, Content, Footer, Sider } = Layout;

const MainPage = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [collapsed, setCollapsed] = React.useState(false);
    const { user } = useAuth();
    return (
        <>
            <div>
                <Logout />
                <h1>Hello {user.name}</h1>
            </div>
        </>
    );
    // return (
    //     <Layout>
    //         <SiderComponent collapsed={collapsed} />
    //         <Layout>
    //             <Header
    //                 style={{
    //                     padding: 0,
    //                     background: colorBgContainer,
    //                 }}
    //             >
    //                 <Button
    //                     type="text"
    //                     icon={
    //                         collapsed ? (
    //                             <MenuUnfoldOutlined />
    //                         ) : (
    //                             <MenuFoldOutlined />
    //                         )
    //                     }
    //                     onClick={() => setCollapsed(!collapsed)}
    //                     style={{
    //                         fontSize: "16px",
    //                         width: 64,
    //                         height: 64,
    //                     }}
    //                 />
    //             </Header>
    //             <Content
    //                 style={{
    //                     margin: "24px 16px 0",
    //                 }}
    //             >
    //                 <div
    //                     style={{
    //                         padding: 24,
    //                         minHeight: 360,
    //                         background: colorBgContainer,
    //                         borderRadius: borderRadiusLG,
    //                     }}
    //                 >
    //                     content
    //                 </div>
    //             </Content>
    //             <Footer
    //                 style={{
    //                     textAlign: "center",
    //                 }}
    //             >
    //                 Ant Design ©{new Date().getFullYear()} Created by Ant UED
    //             </Footer>
    //         </Layout>
    //     </Layout>
    // );
};

MainPage.propTypes = {};

export default MainPage;
