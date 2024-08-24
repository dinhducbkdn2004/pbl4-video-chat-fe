import { notification } from "antd";
import { useState } from "react";

const useFetch = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const fetchData = async (cb) => {
        try {
            setIsLoading(true);

            const data = await cb();
            console.log(data.data);
            api.success({
                message: "Success!",
                description: data.message,
            });
            return data;
        } catch (error) {
            console.error(error);
            api.error({
                message: "Error!",
                description: error.message,
            });
            return error;
        } finally {
            setIsLoading(false);
        }
    };
    return {
        contextHolder,
        fetchData,
        isLoading,
    };
};
export default useFetch;
