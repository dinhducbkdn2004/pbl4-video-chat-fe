import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Layout, Menu } from "antd";
import {
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import { getSocket } from "../../configs/socketInstance";
const { Sider, Content } = Layout;
const MessagePage = (props) => {
    const socket = getSocket();
    useEffect(() => {
        (async () => {
            socket.emit("send-message", "aloalo");
        })();
    }, []);
    return (
        <Layout>
            <Sider trigger={null}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    items={[
                        {
                            key: "1",
                            icon: <UserOutlined />,
                            label: "nav 1",
                        },
                        {
                            key: "2",
                            icon: <VideoCameraOutlined />,
                            label: "nav 2",
                        },
                        {
                            key: "3",
                            icon: <UploadOutlined />,
                            label: "nav 3",
                        },
                    ]}
                />
            </Sider>
            <Content>
                <h1>Hello aloalo</h1>
            </Content>
        </Layout>
    );
};

MessagePage.propTypes = {};

export default MessagePage;
