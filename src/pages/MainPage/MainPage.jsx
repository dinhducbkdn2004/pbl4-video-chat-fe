import { ContactsOutlined, MessageOutlined } from "@ant-design/icons";
import { Image, Layout, Menu } from "antd";
import { useEffect } from "react";

import useFetch from "../../hooks/useFetch";

import Logout from "../../components/Logout";

import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { authSelector } from "../../redux/features/auth/authSelections";
import { authActions } from "../../redux/features/auth/authSlice";
import userApi from "./../../apis/userApi";
import Loading from "./../../components/Loading";
import { store } from "./../../redux/store";
import { io } from "socket.io-client";
import { initializeSocket } from "../../configs/socketInstance";

const { Header } = Layout;

const MainPage = () => {
    const { isAuthenticated } = useSelector(authSelector);
    const { fetchData, isLoading, contextHolder } = useFetch();
    const naviage = useNavigate();
    const handleNavigatie = (e) => {
        naviage(`/${e.key}`);
    };
    useEffect(() => {
        (async () => {
            if (isAuthenticated) {
                const { isOk, data } = await fetchData(userApi.getProfile);

                if (isOk) {
                    store.dispatch(authActions.setProfile(data));
                    initializeSocket();
                    return;
                }
                store.dispatch(authActions.logout());
            } else {
                store.dispatch(authActions.logout());
            }
        })();
    }, []);
    if (isLoading) return <Loading />;

    return (
        <>
            {contextHolder}
            <Layout>
                <Header
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Image
                        src="https://i0.wp.com/help.zalo.me/wp-content/uploads/2022/04/Thumbnail.png?fit=720%2C720&ssl=1"
                        height={80}
                        width={80}
                    />
                    <Menu
                        onClick={handleNavigatie}
                        theme="dark"
                        mode="horizontal"
                        items={[
                            {
                                key: "message",
                                icon: <MessageOutlined />,
                                label: "Message",
                            },
                            {
                                key: "contact",
                                icon: <ContactsOutlined />,
                                label: "Contact",
                            },
                        ]}
                        style={{
                            flex: 1,
                            minWidth: 0,
                            justifyContent: "center",
                        }}
                    />
                    <Logout />
                </Header>
                <Layout
                    style={{
                        height: "100vh",
                    }}
                >
                    <Outlet />
                </Layout>
            </Layout>
        </>
    );
};

MainPage.propTypes = {};

export default MainPage;
