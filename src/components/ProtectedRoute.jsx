
import useAuth from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const { user } = useAuth();
    if (user) return <Outlet />;
    return <Navigate to="/login" replace={true} />;
};

export default ProtectedRoute;
