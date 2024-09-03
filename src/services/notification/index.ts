import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationEventType, Notification } from '@services/types';
import moment from 'moment-timezone';

class NotificationService {
    private static _instance: NotificationService | null;

    static getInstance = (): NotificationService => {
        if (!this._instance) this._instance = new NotificationService();
        return this._instance;
    };

    configure = async () => {
        // check notification permission for ios and display dialog
        if (Platform.OS === 'ios') {
            const permission = await this.requestUserPermission();
            if (!permission) return;
        }

        // Register background handler (currently this didn't works on android. I need to fix this)
        messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
            const {
                notification: { title, body },
                data: { id, ...customData },
            } = remoteMessage;
            const newNotification: Notification = {
                id,
                clubId: customData.clubId,
                title,
                message: body,
                data: customData,
                type: 'NOTIFICATION',
                date: moment().format(),
            };
            await this.storeBgNotificationToStorage(newNotification);
            this.addAppIconBadge();
        });
    };

    // When the application is running, but in the background.
    onNotificationOpenedApp = (listener: (notiData: any, type?: NotificationEventType) => void) => {
        return messaging().onNotificationOpenedApp((remoteMessage) => {
            listener(remoteMessage, 'OPEN_APP_NOTIFICATION');
        });
    };

    // When the application is running
    onNotification = (listener: (notiData: any, type?: NotificationEventType) => void) => {
        // Foreground state message handler (when app is open and in view)
        return messaging().onMessage(async (remoteMessage: any) => {
            listener(remoteMessage, 'ON_NOTIFICATION');
            const {
                notification: { title, body },
                data: { id, ...customData },
            } = remoteMessage;
            const newNotification: Notification = {
                id,
                clubId: customData.clubId,
                title,
                message: body,
                data: customData,
                type: 'NOTIFICATION',
                date: moment().format(),
            };
            await this.storeBgNotificationToStorage(newNotification);
        });
    };

    getDeviceToken = async () => {
        try {
            return await messaging().getToken();
        } catch (_) {
            return null;
        }
    };

    // get notification when open app from quit
    getInitialNotification = async () => {
        return await messaging().getInitialNotification();
    };

    addAppIconBadge = async () => {
        const icon_badge = (await AsyncStorage.getItem('icon_badge')) as string;
        const count = !icon_badge || isNaN(Number(icon_badge)) ? 0 : Number(icon_badge);
        if (Platform.OS === 'ios') {
            PushNotificationIOS.setApplicationIconBadgeNumber(count + 1);
        } else if (Platform.OS === 'android') {
        }
        await AsyncStorage.setItem('icon_badge', String(count + 1));
    };

    clearAppIconBadge = async () => {
        await AsyncStorage.setItem('icon_badge', '0');
        if (Platform.OS === 'ios') {
            PushNotificationIOS.setApplicationIconBadgeNumber(0);
        } else if (Platform.OS === 'android') {
        }
    };

    fetchBgNotificationsFromStorage = async () => {
        try {
            const bgNotiString = await AsyncStorage.getItem('background_notifications');
            let bgNotifications: Notification[] = [];
            if (!bgNotiString) return [];
            bgNotifications = JSON.parse(bgNotiString) as Notification[];
            bgNotifications = bgNotifications
                .filter((x, index, self) => self.findIndex((v) => v.id === x.id) === index)
                .filter((x) => moment(x.date).isAfter(moment().subtract(3, 'days')))
                .sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0));
            await AsyncStorage.setItem('background_notifications', JSON.stringify(bgNotifications));
            return bgNotifications;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    storeBgNotificationToStorage = async (data: Notification) => {
        let bgNotifications = await this.fetchBgNotificationsFromStorage();
        bgNotifications = [data, ...bgNotifications].filter(
            (x, index, self) => self.findIndex((v) => v.id === x.id) === index
        );
        await AsyncStorage.setItem('background_notifications', JSON.stringify(bgNotifications));
    };

    deleteNotification = async (id: string) => {
        let bgNotifications = await this.fetchBgNotificationsFromStorage();
        bgNotifications = bgNotifications.filter((x) => x.id !== id);
        await AsyncStorage.setItem('background_notifications', JSON.stringify(bgNotifications));
    };

    clearBgNotificationsFromStorage = async () => {
        await AsyncStorage.setItem('background_notifications', '');
    };

    requestUserPermission = async () => {
        const authStatus = await messaging().requestPermission();
        return (
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL
        );
    };

    isHeadless = async () => {
        return await messaging().getIsHeadless();
    };
}

export default NotificationService.getInstance();
