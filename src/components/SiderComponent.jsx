import React from "react";
import PropTypes from "prop-types";
import { Layout } from "antd";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
const items = [
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    UserOutlined,
].map((icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: `nav ${index + 1}`,
}));
const { Sider, Menu } = Layout;
const SiderComponent = (props) => {
    const { collapsed } = props;
    console.log(collapsed);
    const [chatboxs, setChatboxs] = React.useState([]);
    const fetchMessages = () => {
        const data = [];
        setChatboxs(data);
    };
    React.useEffect(() => {
        fetchMessages();
    }, []);

    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className="demo-logo-vertical" />
            <Menu theme="dark" mode="inline" items={items} />
        </Sider>
    );
};

// SiderComponent.propTypes = {
//     collapsed: PropTypes.boolean.isRequired,
// };

export default SiderComponent;
