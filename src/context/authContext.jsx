import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

import userApi from "../apis/userApi";
import authApi from "../apis/authApi";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLogin, setIsLogin] = useState(() => {
        localStorage.getItem("ACCESS_TOKEN") ? true : false;
    });
    const { fetchData, isLoading, contextHolder } = useFetch();
    const navigate = useNavigate();
    const handleLogin = (data) => {
        setIsLogin(true);
        setUser(data);
    };

    const handleLogout = () => {
        setIsLogin(false);
        setUser(null);
        authApi.logout();
        navigate("/login");
    };

    useEffect(() => {
        (async () => {
            const accessToken = localStorage.getItem("ACCESS_TOKEN");

            if (!accessToken) {
                navigate("/login");
                return;
            }
            const data = await fetchData(userApi.getProfile);
            if (!data.isOk) {
                authApi.logout();

                handleLogout();
                return;
            }
            setUser(data.data);
        })();
    }, [isLogin]);

    return (
        <AuthContext.Provider
            value={{
                user,
                handleLogin,
                handleLogout,
            }}
        >
            {contextHolder}
            {isLoading ? <Loading /> : children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
