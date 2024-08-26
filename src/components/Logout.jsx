import { Button } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../redux/features/auth/authSlice";

const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch(authActions.logout());
        navigate("/login");
    };
    return <Button onClick={handleLogout}>Logout</Button>;
};

export default Logout;
