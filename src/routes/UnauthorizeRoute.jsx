import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { authSelector } from "../redux/features/auth/authSelections";

const UnauthorizeRoute = () => {
    const authState = useSelector(authSelector);
  

    if (authState.isAuthenticated) return <Navigate to="/" replace={true} />;
    return <Outlet />;
};

export default UnauthorizeRoute;
