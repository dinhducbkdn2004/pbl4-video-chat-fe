import { useEffect, useState } from 'react';
import { Tabs, Row, Col } from 'antd';
import useFetch from '../../../hooks/useFetch';
import RoomChatApi from '../../../apis/RoomChatApi';
import Loading from '../../../components/Loading/Loading';
import GroupCard from '../../../components/Search/GroupCard';

const { TabPane } = Tabs;

const GroupListPage = () => {
    const [privateGroupCount, setPrivateGroupCount] = useState(0);
    const [communityGroupCount, setCommunityGroupCount] = useState(0);

    return (
        <div className="space-y-6 rounded-lg bg-white-default dark:bg-black-light px-3 py-3" style={{ height: '100vh' }}>
            <div className="m-0 rounded-lg bg-white-default dark:bg-black-light p-5" style={{ height: '100%' }}>
                <Tabs defaultActiveKey="1">
                    <TabPane tab={`Nhóm riêng tư (${privateGroupCount})`} key="1">
                        <PrivateGroups setPrivateGroupCount={setPrivateGroupCount} />
                    </TabPane>
                    <TabPane tab={`Cộng Đồng (${communityGroupCount})`} key="2">
                        <CommunityGroups setCommunityGroupCount={setCommunityGroupCount} />
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
};

const PrivateGroups = ({ setPrivateGroupCount }) => {
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
        <div className="flex flex-col gap-6 overflow-y-auto" style={{ height: 'calc(100vh - 200px)' }}>
            {isLoading ? (
                <div className="flex h-40 w-full items-center justify-center">
                    <Loading />
                </div>
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

const CommunityGroups = ({ setCommunityGroupCount }) => {
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
        <div className="flex flex-col gap-6 overflow-y-auto" style={{ height: 'calc(100vh - 200px)' }}>
            {isLoading ? (
                <div className="flex h-40 w-full items-center justify-center">
                    <Loading />
                </div>
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