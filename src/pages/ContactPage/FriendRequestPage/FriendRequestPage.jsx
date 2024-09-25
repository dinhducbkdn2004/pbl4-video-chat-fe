import { useEffect, useState } from 'react';
import useFetch from '../../../hooks/useFetch';
import userApi from '../../../apis/userApi';
import Loading from '../../../components/Loading/Loading';
import FriendRequestCard from './../../../components/FriendRequest/FriendRequestCard';

const FriendRequestPage = () => {
    return (
        <>
            <div className='bg-white rounded-lg px-6 py-5 shadow-md'>
                <h1 className='text-gray-800 text-3xl font-semibold'>Lời mời kết bạn</h1>
            </div>
            <div className='space-y-8 px-6 py-6'>
                <FriendRequestBox />
                <div className='space-y-4'>
                    <h2 className='text-gray-800 text-xl font-semibold'>Lời mời đã gửi</h2>
                    {/* Danh sách lời mời đã gửi */}
                    <div className='text-gray-500 flex items-center justify-center rounded-md border border-dashed py-4'>
                        Không có lời mời đã gửi
                    </div>
                </div>
                <div className='space-y-4'>
                    <h2 className='text-gray-800 text-xl font-semibold'>Gợi ý kết bạn</h2>
                    {/* Danh sách gợi ý kết bạn */}
                    <div className='text-gray-500 flex items-center justify-center rounded-md border border-dashed py-4'>
                        Không có gợi ý kết bạn
                    </div>
                </div>
            </div>
        </>
    );
};

const FriendRequestBox = () => {
    const { fetchData, isLoading } = useFetch({ showSuccess: false });
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
                <h2 className='py-4 text-xl font-semibold'>Lời mời đã nhận</h2>
            </div>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {isLoading ? (
                    <div className='flex h-40 w-full items-center justify-center'>
                        <Loading />
                    </div>
                ) : (
                    requests.map((request) => <FriendRequestCard key={request._id} request={request} />)
                )}
            </div>
        </>
    );
};

export default FriendRequestPage;
