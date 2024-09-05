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
import Loading from "./../../components/Loading/Loading";
import { store } from "./../../redux/store";
import { io } from "socket.io-client";
import { initializeSocket } from "../../configs/socketInstance";
import SideBar from "./SideBar";

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
        <Logout />
      </Layout>
    </>
  );
};

MainPage.propTypes = {};

export default MainPage;
