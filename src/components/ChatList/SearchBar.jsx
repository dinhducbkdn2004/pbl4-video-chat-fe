import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { SearchOutlined } from '@ant-design/icons';
import { Input, List, Avatar } from 'antd';
import userApi from '../../apis/userApi';

const SearchBar = ({ searchValue, handleSearchChange, searchResults, handleChatClick, currentUserId }) => {
    const [friendList, setFriendList] = useState([]);

    useEffect(() => {
        const fetchFriendList = async () => {
            const response = await userApi.getFriendList(currentUserId);
            setFriendList(response.data);
        };
        fetchFriendList();
    }, [currentUserId]);

    const isFriend = (userId) => {
        return friendList.some((friend) => friend._id !== userId);
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
                        dataSource={searchResults}
                        renderItem={(item) => {
                            let descriptionContent = null;

                            if (item.typeRoom === 'Group') {
                                descriptionContent = (
                                    <span className='participants text-xs'>
                                        {item.participants.map((participant) => participant.name).join(', ')}
                                    </span>
                                );
                            } else if (item.typeRoom === 'OneToOne') {
                                const otherParticipant = item.participants.find(
                                    (participant) => participant._id !== currentUserId
                                );

                                descriptionContent = (
                                    <span className='participants text-xs'>
                                        {isFriend(otherParticipant._id) ? 'Bạn bè' : 'Người dùng trên Connectica'}
                                    </span>
                                );
                            }

                            return (
                                <List.Item className='list-item' key={item._id} onClick={() => handleChatClick(item)}>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.chatRoomImage} className='avatar' size={38} />}
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
    searchValue: PropTypes.string.isRequired,
    handleSearchChange: PropTypes.func.isRequired,
    searchResults: PropTypes.array.isRequired,
    handleChatClick: PropTypes.func.isRequired,
    currentUserId: PropTypes.object.isRequired
};

export default SearchBar;
