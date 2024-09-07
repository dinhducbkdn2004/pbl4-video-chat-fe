import { Layout, Avatar, Menu, Badge } from "antd";
import { HiOutlineChat } from "react-icons/hi";
import { BiGroup } from "react-icons/bi";
import { IoCallOutline, IoSettingsOutline } from "react-icons/io5";
import { LuContact2 } from "react-icons/lu";
import user from "../../assets/user.jpg";
import "./SideBar.scss";
import logo from "../../assets/logo.png";

const { Sider } = Layout;

const Sidebar = () => {
    return (
        <Sider
            width={80}
            className="sidebar-container"
            style={{
                backgroundColor: "#f0f2f5",
                borderInlineEnd: "1px solid #d9d9d9",
            }}
        >
            <div
                style={{
                    padding: "10px 0",
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <img
                    src={logo}
                    alt="Logo"
                    style={{ width: "40px", height: "40px" }}
                />
            </div>
            <Menu
                mode="vertical"
                className="custom-menu"
                style={{ backgroundColor: "#f0f2f5" }}
            >
                <Menu.Item
                    key="chat"
                    icon={<HiOutlineChat size={21} />}
                    className="custom-menu-item"
                />
                <Menu.Item
                    key="group"
                    icon={<BiGroup size={21} />}
                    className="custom-menu-item"
                />
                <Menu.Item
                    key="call"
                    icon={<IoCallOutline size={21} />}
                    className="custom-menu-item"
                />
                <Menu.Item
                    key="contact"
                    icon={<LuContact2 size={21} />}
                    className="custom-menu-item"
                />
                <Menu.Item
                    key="setting"
                    icon={<IoSettingsOutline size={21} />}
                    className="custom-menu-item"
                />
                <Menu.Item
                    key="search"
                    icon={<IoSettingsOutline size={21} />}
                    className="custom-menu-item"
                />
            </Menu>
            <div className="avatar-container">
                <Badge count={5}>
                    <Avatar size={40} src={user} />
                </Badge>
            </div>
        </Sider>
    );
};

export default Sidebar;
