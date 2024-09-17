import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import userApi from '../../apis/userApi';
import Loading from '../../components/Loading/Loading';
import { Button, Image } from 'antd';
import Container from '../../components/Container';
import EditProfile from '../../components/UserPage/EditProfile';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/features/auth/authSelections';

const UserPage = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const { user: currentUser } = useSelector(authSelector);
    const { isLoading, fetchData } = useFetch({ showSuccess: false });
    useEffect(() => {
        (async () => {
            if (currentUser?._id === id) setUser(currentUser);
            const data = await fetchData(() => userApi.getUser(id));

            if (data.isOk) {
                setUser(data.data);
            }
        })();
    }, [currentUser, id]);

    if (isLoading || !user) return <Loading />;

    return (
        <Container>
            <Image width={'100%'} src={user.backgroundImage} />
            <div className='relative -top-[100px] flex flex-col items-center gap-y-6'>
                <Image src={user.avatar} className='mx-auto h-auto w-[100px] rounded-full' width={200} />
                <h1 className='mb-5 text-center'>{user.name}</h1>
                <div className='flex items-center justify-center gap-x-4'>
                    <Button>Thêm bạn bè</Button>
                    <Button>Nhắn tin</Button>
                    {currentUser._id === id && <EditProfile data={user} />}
                </div>
            </div>
            <div>
                <p className='mx-auto max-w-[400px] text-center'>{user.introduction}</p>
            </div>
        </Container>
    );
};

export default UserPage;
