import axiosClient from '../configs/axiosClient';

const RoomChatApi = {
    createChatRoom: (users = [], name = '', privacy) => {
        const isGroupChat = users.length > 1;
        return axiosClient.post('/chat-rooms', { name, users, privacy, isGroupChat });
    },
    searchChatroomByName: (name, getMy) => {
        return axiosClient.get('/chat-rooms/search', {
            params: {
                name,
                getMy
            }
        });
    },
    getAllChatrooms: (getMy = true) => {
        return axiosClient.get('/chat-rooms/search', {
            params: {
                getMy
            }
        });
    },
    getChatRoomById: (id, page = 1, limit = 10) => {
        return axiosClient.get('/messages/byRoomchatId', {
            params: {
                chatRoomId: id,
                page,
                limit
            }
        });
    },
    createMessage: (content, chatRoomId, type, file = null) => {
        const payload = { content, chatRoomId, type };
        if (file) {
            payload.file = file;
        }
        return axiosClient.post('/messages', payload);
    }
};

export default RoomChatApi;
