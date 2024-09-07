import { Layout } from "antd";
import { useEffect } from "react";
import useFetch from "../../hooks/useFetch";

import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { initializeSocket } from "../../configs/socketInstance";
import { authSelector } from "../../redux/features/auth/authSelections";
import { authActions } from "../../redux/features/auth/authSlice";
import userApi from "./../../apis/userApi";
import Loading from "./../../components/Loading/Loading";
import { store } from "./../../redux/store";
import "./MainPage.scss";

import SideBar from "./SideBar";

const { Content } = Layout;

const MainPage = () => {
    const { isAuthenticated } = useSelector(authSelector);
    const { fetchData, isLoading, contextHolder } = useFetch();
    // const naviage = useNavigate();
    // const handleNavigatie = (e) => {
    //   naviage(`/${e.key}`);
    // };
    useEffect(() => {
        (async () => {
            if (isAuthenticated) {
                const { isOk, data } = await fetchData(userApi.getProfile);
                if (isOk) {
                    initializeSocket();
                    store.dispatch(authActions.setProfile(data));
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

            <Layout style={{ height: "100vh" }}>
                <SideBar />
                <Layout>
                    <Content style={{ display: "flex", flexDirection: "row" }}>
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

MainPage.propTypes = {};

export default MainPage;
