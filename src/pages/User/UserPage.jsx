import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import userApi from '../../apis/userApi';
import Loading from '../../components/Loading/Loading';
import { Avatar, Button, Image } from 'antd';
import Container from '../../components/Container';

const UserPage = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const { isLoading, fetchData } = useFetch();
    useEffect(() => {
        (async () => {
            const data = await fetchData(() => userApi.getUser(id));

            if (data.isOk) {
                setUser(data.data);
            }
        })();
    }, [id]);

    if (isLoading || !user) return <Loading />;

    return (
        <Container>
            <Image
                width={'100%'}
                src='https://t4.ftcdn.net/jpg/02/10/45/95/360_F_210459536_XmLDEcKq2DpeNLVmheuWeu9NM9aGKnih.jpg'
            />
            <div className='relative -top-[100px] flex flex-col items-center gap-y-6'>
                <Image src={user.avatar} className='mx-auto h-auto w-[100px] rounded-full' width={200} />
                <h1 className='mb-5 text-center'>{user.name}</h1>
                <div className='flex items-center justify-center gap-x-4'>
                    <Button>Thêm bạn bè</Button>
                    <Button>Nhắn tin</Button>
                </div>
            </div>
            <div>
                <p className='mx-auto max-w-[400px] text-center'>
                    lorem ipsum dolor sit amet, consect lorem ipsum dolor sit amet, consect lorem ipsum dolor sit amet,
                    consect lorem ipsum dolor sit amet, consect lorem ipsum dolor sit amet, consect
                </p>
            </div>
        </Container>
    );
};

export default UserPage;
