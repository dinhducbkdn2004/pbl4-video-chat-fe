import axiosClient from '../configs/axiosClient';

const RoomChatApi = {
    createChatRoom: (users = [], name = '') => {
        const typeRoom = 'PRIVATE';
        const isGroupChat = users.length > 1;
        return axiosClient.post('/chat-rooms', { name, users, typeRoom, isGroupChat });
    },
    searchChatroomByName: (name, getMy) => {
        return axiosClient.get('/chat-rooms/search', {
            params: {
                name,
                getMy
            }
        });
    },
    getAllChatrooms: () => {
        return axiosClient.get('/chat-rooms/search');
    },
    getChatRoomById: (id) => {
        return axiosClient.get('/messages/byRoomchatId', {
            params: {
                chatRoomId: id
            }
        });
    }
};

export default RoomChatApi;
