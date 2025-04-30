import { useEffect, useState } from 'react';
import { Tabs, Row, Col, Skeleton } from 'antd';
import useFetch from '../../../hooks/useFetch';
import RoomChatApi from '../../../apis/RoomChatApi';
import GroupCard from '../../../components/Search/GroupCard';

const { TabPane } = Tabs;

const GroupListPage = () => {
    const [privateGroupCount, setPrivateGroupCount] = useState(0);
    const [communityGroupCount, setCommunityGroupCount] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div
            className='space-y-4 rounded-lg bg-white-default px-2 py-2 dark:bg-black-light md:space-y-6 md:px-3 md:py-3'
            style={{ height: '100vh' }}
        >
            <div className='m-0 rounded-lg bg-white-default p-2 dark:bg-black-light md:p-5' style={{ height: '100%' }}>
                <Tabs defaultActiveKey='1' size={isMobile ? 'small' : 'default'}>
                    <TabPane tab={`Private Groups (${privateGroupCount})`} key='1'>
                        <PrivateGroups setPrivateGroupCount={setPrivateGroupCount} isMobile={isMobile} />
                    </TabPane>
                    <TabPane tab={`Community (${communityGroupCount})`} key='2'>
                        <CommunityGroups setCommunityGroupCount={setCommunityGroupCount} isMobile={isMobile} />
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
};

const PrivateGroups = ({ setPrivateGroupCount, isMobile }) => {
    const { fetchData, isLoading } = useFetch({ showSuccess: false, showError: false });
    const [privateGroups, setPrivateGroups] = useState([]);

    useEffect(() => {
        (async () => {
            const data = await fetchData(() => RoomChatApi.getGroup('PRIVATE', 'Group', 0, 10, true));
            if (data.isOk) {
                setPrivateGroups(data.data);
                setPrivateGroupCount(data.data.length);
            }
        })();
    }, [fetchData, setPrivateGroupCount]);

    return (
        <div
            className='flex flex-col gap-4 overflow-y-auto md:gap-6'
            style={{ height: 'calc(100vh - 200px)', paddingBottom: isMobile ? '60px' : '0' }}
        >
            {isLoading ? (
                <Row gutter={[16, 16]}>
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Col key={index} xs={24} sm={12} md={12} lg={12} xl={12}>
                            <Skeleton active avatar paragraph={{ rows: 2 }} />
                        </Col>
                    ))}
                </Row>
            ) : (
                <Row gutter={[16, 16]}>
                    {privateGroups.map((group) => (
                        <Col key={group._id} xs={24} sm={12} md={12} lg={12} xl={12}>
                            <GroupCard data={group} isMember={true} />
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

const CommunityGroups = ({ setCommunityGroupCount, isMobile }) => {
    const { fetchData, isLoading } = useFetch({ showSuccess: false, showError: false });
    const [communityGroups, setCommunityGroups] = useState([]);

    useEffect(() => {
        (async () => {
            const data = await fetchData(() => RoomChatApi.getGroup('PUBLIC', 'Group', 0, 10, true));
            if (data.isOk) {
                setCommunityGroups(data.data);
                setCommunityGroupCount(data.data.length);
            }
        })();
    }, [fetchData, setCommunityGroupCount]);

    return (
        <div
            className='flex flex-col gap-4 overflow-y-auto md:gap-6'
            style={{ height: 'calc(100vh - 200px)', paddingBottom: isMobile ? '60px' : '0' }}
        >
            {isLoading ? (
                <Row gutter={[16, 16]}>
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Col key={index} xs={24} sm={12} md={12} lg={12} xl={12}>
                            <Skeleton active avatar paragraph={{ rows: 2 }} />
                        </Col>
                    ))}
                </Row>
            ) : (
                <Row gutter={[16, 16]}>
                    {communityGroups.map((group) => (
                        <Col key={group._id} xs={24} sm={12} md={12} lg={12} xl={12}>
                            <GroupCard data={group} isMember={true} />
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default GroupListPage;
