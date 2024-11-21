import { useSelector } from 'react-redux';
import { authSelector } from '../redux/features/auth/authSelections';
import { useCallback } from 'react';
import { useSocket } from './useSocket';

export const useSetDataOneToOneRoom = () => {
    const { user } = useSelector(authSelector);
    const { onlineUsers } = useSocket();
    const setData = useCallback(
        (room) => {
            if (room.typeRoom === 'OneToOne') {
                const opponent = room.participants.find((participant) => participant._id !== user?._id);
                room.name = opponent?.name || '';
                room.chatRoomImage = opponent?.avatar || '';
                room.isOnline = onlineUsers.some((user) => user._id === opponent?._id);
                return room;
            }
        },
        [JSON.stringify(user)]
    );
    return setData;
};
