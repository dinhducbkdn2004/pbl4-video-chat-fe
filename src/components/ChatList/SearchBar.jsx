import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { SearchOutlined } from '@ant-design/icons';
import { Input, List, Avatar } from 'antd';
import userApi from '../../apis/userApi';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/features/auth/authSelections';
import { debounce } from 'lodash';
import RoomChatApi from '../../apis/RoomChatApi';

const SearchBar = ({ handleChatClick }) => {
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [friendList, setFriendList] = useState([]);
    const { user } = useSelector(authSelector);

    const debouncedSearch = debounce(async (value) => {
        const data = await RoomChatApi.searchChatroomByName(true, value);
        if (data.isOk) setSearchResults(data.data);
    }, 700);

    useEffect(() => {
        if (user && user._id) {
            const fetchFriendList = async () => {
                const response = await userApi.getFriendList(user._id);
                setFriendList(response.data);
            };
            fetchFriendList();
        }
    }, [user]);

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
        debouncedSearch(e.target.value);
    };

    const isFriend = (userId) => {
        return friendList.some((friend) => friend._id === userId);
    };

    return (
        <>
            <div className='search-bar bg-white-default'>
                <SearchOutlined className='search-icon text-blue' />
                <Input
                    className='search-input'
                    placeholder='Search chats...'
                    value={searchValue}
                    onChange={handleSearchChange}
                    autoFocus
                    allowClear
                />
            </div>

            {searchValue && (
                <div className='search-results'>
                    <List
                        itemLayout='horizontal'
                        dataSource={searchResults.sort((a, b) => a.typeRoom === 'OneToOne' ? -1 : 1)}
                        renderItem={(item) => {
                            let descriptionContent = null;

                            if (item.typeRoom === 'OneToOne') {
                                const otherParticipant = item.participants.find(
                                    (participant) => user && participant._id !== user._id
                                );

                                descriptionContent = (
                                    <span className='participants text-xs'>
                                        {otherParticipant && isFriend(otherParticipant._id)
                                            ? 'Bạn bè'
                                            : 'Người dùng trên Connectica'}
                                    </span>
                                );
                            } else if (item.typeRoom === 'Group') {
                                const participantsToShow = item.participants.slice(0, 3).map((participant) => participant.name).join(', ');
                                descriptionContent = (
                                    <span className='participants text-xs'>
                                        {participantsToShow}{item.participants.length > 3 ? ', ...' : ''}
                                    </span>
                                );
                            }

                            return (
                                <List.Item className='list-item' key={item._id} onClick={() => handleChatClick(item)}>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.chatRoomImage} className='flex flex-row' size={38} />}
                                        title={<span className='title text-base font-semibold'>{item.name}</span>}
                                        description={descriptionContent}
                                    />
                                </List.Item>
                            );
                        }}
                    />
                </div>
            )}
        </>
    );
};

SearchBar.propTypes = {
    handleChatClick: PropTypes.func.isRequired
};

export default SearchBar;