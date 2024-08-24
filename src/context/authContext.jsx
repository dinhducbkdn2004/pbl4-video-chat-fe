import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

import { useNavigate } from "react-router-dom";
import userApi from "../apis/userApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLogin, setIsLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (data) => {
        setIsLogin(true);
        setUser(data);
    };

    const handleLogout = () => {
        setUser(null);
        setIsLogin(false);
        localStorage.removeItem("ACCESS_TOKEN");
    };

    const handleAuthFail = () => {
        setUser(null);
        setIsLogin(false);
        localStorage.removeItem("ACCESS_TOKEN");
        navigate("/login");
    };

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const accessToken = localStorage.getItem("ACCESS_TOKEN");
            console.log(accessToken);
            if (!accessToken) {
                handleAuthFail();
                return;
            }

            try {
                const data = await userApi.getProfile();
                setUser(data.data);
                setIsLogin(true);
            } catch (error) {
                handleAuthFail();
            } finally {
                setIsLoading(false);
            }
        })();
    }, [user]);

    return (
        <AuthContext.Provider
            value={{
                user,
                handleLogin,
                handleLogout,
                isLogin,
                isLoading,
            }}
        >
            {isLoading ? children : <div>Loading...</div>}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
