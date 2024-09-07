import { Layout } from "antd";
import { useEffect } from "react";
import useFetch from "../../hooks/useFetch";

import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { authSelector } from "../../redux/features/auth/authSelections";
import { authActions } from "../../redux/features/auth/authSlice";
import userApi from "./../../apis/userApi";
import Loading from "./../../components/Loading/Loading";
import { store } from "./../../redux/store";
import { io } from "socket.io-client";
import { initializeSocket } from "../../configs/socketInstance";
import "./MainPage.scss";

import SideBar from "./SideBar";
import ChatList from "../../components/ChatList/ChatList";
import ChatWindow from "../../components/ChatWindow/ChatWindow";

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
            <div className="chat-list-container">
              <ChatList />
            </div>
            <div className="chat-window-container">
              <ChatWindow />
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

MainPage.propTypes = {};

export default MainPage;
