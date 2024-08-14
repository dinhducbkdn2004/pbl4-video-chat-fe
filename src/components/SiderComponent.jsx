import React from "react";
import PropTypes from "prop-types";
import { Layout } from "antd";

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
            <Menu theme="dark" mode="inline" items={chatboxs} />
        </Sider>
    );
};

// SiderComponent.propTypes = {
//     collapsed: PropTypes.boolean.isRequired,
// };

export default SiderComponent;
