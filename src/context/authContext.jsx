import { createContext, useState } from "react";
import PropTypes from "prop-types";
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const handleLogin = (data) => {
        setUser(data);
    };
    return (
        <AuthContext.Provider
            value={{
                user,
                handleLogin,
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
