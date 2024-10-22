import axiosClient from '../configs/axiosClient';

const RoomChatApi = {
    createChatRoom: (users = [], name = '', privacy) => {
        const isGroupChat = users.length > 1;
        return axiosClient.post('/chat-rooms', { name, users, privacy, isGroupChat });
    },
    searchChatroomByName: (name, getMy = true) => {
        return axiosClient.get('/chat-rooms/search', {
            params: {
                name,
                getMy
            }
        });
    },
    getAllChatrooms: (getMy = true, page = 1, limit = 10) => {
        return axiosClient.get('/chat-rooms/search', {
            params: {
                getMy,
                page,
                limit
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
    },

    getOneToOneChatRoom: (toId) =>
        axiosClient.get('/chat-rooms/getOneToOne', {
            params: {
                to: toId
            }
        }),

    getDetailChatRoom: (chatRoomId) => axiosClient.get(`chat-rooms/${chatRoomId}`),

    changeDetailChatRoom: (data) => axiosClient.patch(`/chat-rooms/change-details/`, data),

    getFileMediaLinks: (chatRoomId, type, page = 1, limit = 10) =>
        axiosClient.get('/messages/getMediaDocumentLink', {
            params: {
                chatRoomId,
                type,
                page,
                limit
            }
        }),

    
        
};

export default RoomChatApi;
