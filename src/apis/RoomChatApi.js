import axiosClient from '../configs/axiosClient';

const RoomChatApi = {
    createChatRoom: (users = [], name = '', privacy) => {
        return axiosClient.post('/chat-rooms', { name, users, privacy });
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
    },
    getOneToOneChatRoom: (toId) =>
        axiosClient.get('/chat-rooms/getOneToOne', {
            params: {
                to: toId
            }
        })
};
export default RoomChatApi;
