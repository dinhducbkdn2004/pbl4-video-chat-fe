import { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import useFetch from '../../../hooks/useFetch';
import userApi from '../../../apis/userApi';
import Loading from '../../../components/Loading/Loading';
import FriendRequestCard from './../../../components/FriendRequest/FriendRequestCard';

const { TabPane } = Tabs;

const FriendRequestPage = () => {
    const [requestCount, setRequestCount] = useState(0);
    const [sentRequestCount, setSentRequestCount] = useState(0);
    const [suggestionCount, setSuggestionCount] = useState(0);

    return (
        <div className='space-y-6 bg-white-dark px-3 py-3' style={{ height: '100vh' }}>
            <div className='m-0 rounded-lg bg-white-default p-5' style={{ height: '100%' }}>
                <Tabs defaultActiveKey='1'>
                    <TabPane tab={`Lời mời đã nhận (${requestCount})`} key='1'>
                        <FriendRequestBox setRequestCount={setRequestCount} />
                    </TabPane>
                    <TabPane tab={`Lời mời đã gửi (${sentRequestCount})`} key='2'>
                        <SentRequests setSentRequestCount={setSentRequestCount} />
                    </TabPane>
                    <TabPane tab={`Gợi ý kết bạn (${suggestionCount})`} key='3'>
                        <FriendSuggestions setSuggestionCount={setSuggestionCount} />
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
};

const FriendRequestBox = ({ setRequestCount }) => {
    const { fetchData, isLoading } = useFetch({ showSuccess: false });
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        (async () => {
            const data = await fetchData(() => userApi.getFriendRequest(0, 10)); // chưa có api
            if (data.isOk) {
                setRequests(data.data);
                setRequestCount(data.data.length);
            }
        })();
    }, [fetchData, setRequestCount]);

    return (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {isLoading ? (
                <div className='flex h-40 w-full items-center justify-center'>
                    <Loading />
                </div>
            ) : (
                requests.map((request) => <FriendRequestCard key={request._id} request={request} />)
            )}
        </div>
    );
};

const SentRequests = ({ setSentRequestCount }) => {
    const { fetchData, isLoading } = useFetch({ showSuccess: false });
    const [sentRequests, setSentRequests] = useState([]);

    useEffect(() => {
        (async () => {
            const data = await fetchData(() => userApi.getSentRequests(0, 10)); // chưa có api
            if (data.isOk) {
                setSentRequests(data.data);
                setSentRequestCount(data.data.length);
            }
        })();
    }, [fetchData, setSentRequestCount]);

    return (
        <div className='space-y-4'>
            <h2 className='text-gray-800 text-xl font-semibold'>Lời mời đã gửi</h2>
            {isLoading ? (
                <div className='flex h-40 w-full items-center justify-center'>
                    <Loading />
                </div>
            ) : sentRequests.length > 0 ? (
                sentRequests.map((request) => <FriendRequestCard key={request._id} request={request} />)
            ) : (
                <div className='text-gray-500 flex items-center justify-center rounded-md border border-dashed py-4'>
                    Không có lời mời đã gửi
                </div>
            )}
        </div>
    );
};

const FriendSuggestions = ({ setSuggestionCount }) => {
    const { fetchData, isLoading } = useFetch({ showSuccess: false });
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        (async () => {
            const data = await fetchData(() => userApi.getFriendSuggestions(0, 10));
            if (data.isOk) {
                setSuggestions(data.data);
                setSuggestionCount(data.data.length);
            }
        })();
    }, [fetchData, setSuggestionCount]);

    return (
        <div className='space-y-4'>
            <h2 className='text-gray-800 text-xl font-semibold'>Gợi ý kết bạn</h2>
            {isLoading ? (
                <div className='flex h-40 w-full items-center justify-center'>
                    <Loading />
                </div>
            ) : suggestions.length > 0 ? (
                suggestions.map((suggestion) => <FriendRequestCard key={suggestion._id} request={suggestion} />)
            ) : (
                <div className='text-gray-500 flex items-center justify-center rounded-md border border-dashed py-4'>
                    Không có gợi ý kết bạn
                </div>
            )}
        </div>
    );
};

export default FriendRequestPage;