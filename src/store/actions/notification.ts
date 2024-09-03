import { Notification } from '@services/types';
import { AppThunkAction } from '@store';
import { NotificationActionType } from '@store/types/notification';
import moment from 'moment-timezone';

export const deleteNotification =
    (id: string): AppThunkAction<void> =>
    async (dispatch, getState) => {
        const notifications = getState().notification.notifications.filter((noti) => noti.id !== id);
        dispatch(putNotifications(notifications));
    };

export const addNotifications =
    (newNotifications: Notification[]): AppThunkAction<void> =>
    async (dispatch, getState) => {
        let notifications = getState().notification.notifications.filter((nt) => nt.type === 'NOTIFICATION');
        const clubMsgs = getState().notification.notifications.filter((nt) => nt.type === 'CLUB_MSG');
        notifications = [...newNotifications, ...notifications]
            .filter((nt, index, self) => self.findIndex((noti) => noti.id === nt.id) === index)
            .filter((nt) => nt.date && moment(nt.date).isAfter(moment().subtract(3, 'days')));
        dispatch(putNotifications([...notifications, ...clubMsgs]));
    };

export const putNotifications = (payload: Notification[]) => ({
    type: NotificationActionType.PUT_NOTIFICATIONS,
    payload,
});
