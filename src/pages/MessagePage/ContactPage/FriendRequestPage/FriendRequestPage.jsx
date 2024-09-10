import { useEffect, useState } from 'react';
import userApi from '../../../../apis/userApi';
import FriendRequestCard from '../../../../components/FriendRequest/FriendRequestCard';
import Loading from '../../../../components/Loading/Loading';
import useFetch from '../../../../hooks/useFetch';

const FriendRequestPage = () => {
    return (
        <>
            <div className='bg-white-default px-4 py-5'>
                <h1 className='w-full'>Lời mời kết bạn</h1>
            </div>
            <div className='px-4 py-5'>
                <FriendRequestBox />
                <div>
                    <h1>Lời mời đã gửi</h1>
                </div>
                <div>
                    <h1>Gợi ý kết bạn</h1>
                </div>
            </div>
        </>
    );
};
const FriendRequestBox = () => {
    const { fetchData, isLoading } = useFetch();
    const [requests, setRequests] = useState([]);
    useEffect(() => {
        (async () => {
            const data = await fetchData(() => userApi.getFriendRequest(0, 10));
            if (data.isOk) {
                setRequests(data.data);
            }
        })();
    }, []);

    return (
        <>
            <div>
                <h1 className='py-6'>Lời mời đã nhận</h1>
                <div className='flex flex-wrap gap-4'>
                    {isLoading ? (
                        <Loading />
                    ) : (
                        requests.map((request) => <FriendRequestCard key={request._id} request={request} />)
                    )}
                </div>
            </div>
        </>
    );
};
export default FriendRequestPage;
