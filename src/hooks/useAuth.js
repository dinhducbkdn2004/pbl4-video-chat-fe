import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const useAuth = () => {
    const { user, isLogin } = useContext(AuthContext);
    return {
        user,
        isLogin,
    };
};
export default useAuth;
