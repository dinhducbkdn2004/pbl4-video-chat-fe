import axiosClient from '../configs/axiosClient';

const RoomChatApi = {
    createChatRoom: (users = [], name = '', privacy) => {
        const isGroupChat = users.length > 1;
        return axiosClient.post('/chat-rooms', { name, users, privacy, isGroupChat });
    },
    searchChatroomByName: (name, page = 1, limit = 10, getMy = true) => {
        return axiosClient.get('/chat-rooms/search', {
            params: {
                name,
                page,
                limit,
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
    getGroup: ( privacy, typeRoom, page = 1, limit = 10, getMy = true) => {
        return axiosClient.get('/chat-rooms/search', {
            params: {
                privacy,
                typeRoom,
                page,
                limit,
                getMy,
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

    addMember: (chatRoomId, newMemberId) =>
        axiosClient.post(`/chat-rooms/add-member/`, {
            chatRoomId,
            newMemberId
        }),

    removeMember: (chatRoomId, memberId) =>
        axiosClient.delete(`/chat-rooms/remove-member/`, {
            data: {
                chatRoomId,
                memberId
            }
        }),

    leaveGroup: (chatRoomId) =>
        axiosClient.delete(`/chat-rooms/leave-group/`, {
            data: {
                chatRoomId
            }
        }),

    changeRole: (chatRoomId, userId, role) =>
        axiosClient.patch(`/chat-rooms/change-role/`, {
            chatRoomId,
            userId,
            role
        }),

    getRequestByChatRoomId: (chatRoomId, page = 1, limit = 10) =>
        axiosClient.get(`/group-requests/get-request-by-chat-room-id`, {
            params: {
                chatRoomId,
                page,
                limit
            }
        }),

    createRequest: (chatRoomId, message) => axiosClient.post(`/group-requests`, { chatRoomId, message }),
    updatedRequest: (requestId, status) => axiosClient.patch(`/group-requests/${requestId}`, { status })
};

export default RoomChatApi;
