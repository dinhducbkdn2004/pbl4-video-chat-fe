import { createContext, useState } from "react";
import PropTypes from "prop-types";
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLogin, setIsLogin] = useState(false);
    const handleLogin = (data) => {
        setIsLogin(true);
        setUser(data);
    };
    const handleLogout = () => {
        setUser(null);
        setIsLogin(false);
    };
    return (
        <AuthContext.Provider
            value={{
                user,
                handleLogin,
                handleLogout,
                isLogin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
AuthProvider.propTypes = {
    children: PropTypes.element,
};
export default AuthProvider;
