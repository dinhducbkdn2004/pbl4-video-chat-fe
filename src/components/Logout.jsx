import { Button } from "antd";

import useAuth from "../hooks/useAuth";

const Logout = () => {
    const { handleLogout } = useAuth();
    return <Button onClick={handleLogout}>Logout</Button>;
};

export default Logout;
