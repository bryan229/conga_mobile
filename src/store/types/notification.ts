import { Notification } from '@services/types';

export enum NotificationActionType {
    PUT_NOTIFICATIONS = 'PUT_NOTIFICATIONS',
}

export interface NotificationState {
    notifications: Notification[];
}

export type PutNotifications = {
    type: typeof NotificationActionType.PUT_NOTIFICATIONS;
    payload: Notification[];
};

export type NotificationAction = PutNotifications;
