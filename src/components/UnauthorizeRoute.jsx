import useAuth from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const UnauthorizeRoute = () => {
    const { user } = useAuth();

    if (user) return <Navigate to="/" replace={true} />;
    
    return <Outlet />;
};

export default UnauthorizeRoute;
