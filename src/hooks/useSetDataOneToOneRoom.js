import { useSelector } from 'react-redux';
import { authSelector } from '../redux/features/auth/authSelections';
import { useCallback } from 'react';

export const useSetDataOneToOneRoom = () => {
    const { user } = useSelector(authSelector);
    const setData = useCallback(
        (room) => {
            console.log(user);
            if (room.typeRoom === 'OneToOne') {
                const opponent = room.participants.find((participant) => participant._id !== user?._id);
                room.name = opponent?.name || '';
                room.chatRoomImage = opponent?.avatar || '';
                room.isOnline = opponent?.isOnline || false;
                return room;
            }
        },
        [JSON.stringify(user)]
    );
    return setData;
};
