import { Avatar, Badge, Dropdown, Layout, Menu } from "antd";
import { BiGroup, BiMessageSquareDots } from "react-icons/bi";
import { FiStopCircle } from "react-icons/fi";
import { RiLogoutCircleRLine } from "react-icons/ri";

import { IoCallOutline, IoSettingsOutline } from "react-icons/io5";
import { LuContact2 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

import { handleLogout } from "../../components/Logout";
import "./SideBar.scss";
import assets from "../../assets";
import { store } from "../../redux/store";

import { authSelector } from "../../redux/features/auth/authSelections";
import { useSelector } from "react-redux";

const { Sider } = Layout;

const Sidebar = () => {
    const logout = handleLogout();
    const navigate = useNavigate();
    const { user } = useSelector(authSelector);
    console.log(user);
    const menu = (
        <Menu>
            <Menu.Item key="setting">
                <IoSettingsOutline size={15} />
                <span>Setting</span>
            </Menu.Item>
            <Menu.Item key="logout" onClick={logout}>
                <RiLogoutCircleRLine size={15} /> <span>Logout</span>
            </Menu.Item>
        </Menu>
    );

    return (
        <Sider width={72} className="sidebar-container">
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo" />
            </div>
            <Menu
                mode="vertical"
                className="custom-menu"
                onClick={(e) => {
                    navigate(e.key);
                }}
            >
                <Menu.Item
                    key="message"
                    icon={<BiMessageSquareDots size={20} />}
                    className="custom-menu-item"
                    data-description="Chat"
                />
                <Menu.Item
                    key="group"
                    icon={<BiGroup size={20} />}
                    className="custom-menu-item"
                    data-description="Group"
                />
                <Menu.Item
                    key="block"
                    icon={<FiStopCircle size={20} />}
                    className="custom-menu-item"
                    data-description="Block"
                />
                <Menu.Item
                    key="call"
                    icon={<IoCallOutline size={20} />}
                    className="custom-menu-item"
                    data-description="Call"
                />
                <Menu.Item
                    key="contact"
                    icon={<LuContact2 size={20} />}
                    className="custom-menu-item"
                    data-description="Contact"
                />
                <Menu.Item
                    key="setting"
                    icon={<IoSettingsOutline size={20} />}
                    className="custom-menu-item"
                    data-description="Setting"
                />
                <div className="bottom-menu-items">
                    <Dropdown overlay={menu} trigger={["click"]}>
                        <div className="avatar-container">
                            <Badge count={1} status="success">
                                <Avatar size={46} src={user?.avatar} />
                            </Badge>
                        </div>
                    </Dropdown>
                </div>
            </Menu>
        </Sider>
    );
};

export default Sidebar;
