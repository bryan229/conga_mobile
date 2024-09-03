import { useEffect } from 'react';
import NotificationService from '@services/notification';
import * as NavigationService from '@services/navigation';
import AppStateService, { ApplicationState } from '@services/appstate';
import { useAppDispatch } from '@store/hook';
import { addNotifications } from '@store/actions';
import moment from 'moment-timezone';
import { useAppNavigation } from '@services/hooks/useNavigation';
import { NotificationEventType } from '@services/types';
import { setNotiBadge } from '@store/actions/ui';

const NotificationManager = () => {
    const dispatch = useAppDispatch();
    const navigation = useAppNavigation();

    useEffect(() => {
        NotificationService.clearAppIconBadge();
        const onNotiOpenAppUnSubscribe = NotificationService.onNotificationOpenedApp(onNotification);
        const onNotiUnsubscribe = NotificationService.onNotification(onNotification);
        const appStateUnsubscribe = AppStateService.onAppStateChanged(onAppStateChanged);
        getInitNotificationData();

        return () => {
            onNotiOpenAppUnSubscribe();
            onNotiUnsubscribe();
            appStateUnsubscribe?.remove();
        };
    }, []);

    const checkBackgroundNotifications = async () => {
        // when receiving background notifications, they will be saved in storage and when click notification, can get from getInitialNotification.
        // but if user open app directly without tapping notification, no effect getInitialNotification.
        // so need to check background notification and redirect to Messages page
        const bgNotifications = await NotificationService.fetchBgNotificationsFromStorage();
        if (bgNotifications.length > 0) {
            if (NavigationService.getCurrentRouteName() !== 'Messages') navigation.navigate('Messages');
            else dispatch(addNotifications(bgNotifications));
        }
    };

    const getInitNotificationData = async () => {
        // get notification when open app from quit state
        const initNotiData = await NotificationService.getInitialNotification();
        if (initNotiData) onNotification(initNotiData, 'INIT_NOTIFICATION');
    };

    const onAppStateChanged = (state: ApplicationState) => {
        // when app is active, remove icon badge
        if (state === 'ACTIVE') {
            NotificationService.clearAppIconBadge();
            checkBackgroundNotifications();
        }
    };

    const onNotification = (notiData: any, type?: NotificationEventType) => {
        const {
            notification: { title, body },
            data: { id, ...customData },
        } = notiData;
        dispatch(
            addNotifications([
                {
                    id,
                    clubId: customData.clubId,
                    title,
                    message: body,
                    data: customData,
                    type: 'NOTIFICATION',
                    date: moment().format(),
                },
            ])
        );
        if (type === 'OPEN_APP_NOTIFICATION' || type === 'INIT_NOTIFICATION') navigation.navigate('Messages');
        else if (type === 'ON_NOTIFICATION' && NavigationService.getCurrentRouteName() !== 'Messages') {
            dispatch(setNotiBadge(true));
        }
    };

    return null;
};

export default NotificationManager;
