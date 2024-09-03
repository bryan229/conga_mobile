import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment-timezone';
import * as Progress from 'react-native-progress';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import { CPStyleProp, Notification } from '@services/types';
import NotificationService from '@services/notification';
import Header from '@navigation/components/main-header';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { deleteNotification, handleError, putNotifications } from '@store/actions';
import CTInfiniteFlatlist from '@shared/components/controls/ct-infinite-flatlist';
import { setNotiBadge } from '@store/actions/ui';
import { ClubMsgApi } from '@services/api';
import { Club, ClubMsg } from '@services/models';
import NotificationItem from './components/notification-item';
import { NOTIFICATION_SOURCE, CIRCLEDETAILS_NOTIDATA_TYPE, CIRCLE_NOTIDATA_TYPE } from '@shared/constants';
import { useAppNavigation } from '@services/hooks/useNavigation';

interface MessagesScreenProps {
    style?: CPStyleProp;
}

const MessagesScreen: React.FC<MessagesScreenProps> = ({}) => {
    const notifications = useAppSelector((state) => state.notification.notifications);
    const navigation = useAppNavigation();
    const club = useAppSelector((state) => state.club.club);
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const isFocused = useIsFocused();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const bgNotifications = await NotificationService.fetchBgNotificationsFromStorage();
            if (!club) return;
            const params = {
                club: club._id,
                date: moment().format('YYYY-MM-DD'),
            };
            const { data } = await ClubMsgApi.retrieve(params);
            const msgs: Notification[] = (data as ClubMsg[]).map((msg) => {
                return {
                    id: msg._id,
                    clubId: typeof msg.club === 'string' ? msg.club : (msg.club as Club)._id,
                    title: (msg.club as Club).displayName,
                    message: msg.content,
                    type: 'CLUB_MSG',
                    data: {
                        _id: msg._id,
                        club: msg.club,
                        type: msg.type,
                    },
                    date: msg.startDate,
                } as Notification;
            });
            dispatch(putNotifications([...bgNotifications, ...msgs]));
            setLoading(false);
        } catch (error) {
            dispatch(handleError(error));
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isFocused) {
            fetchNotifications();
            dispatch(setNotiBadge(false));
        }
    }, [isFocused]);

    const onPressNotification = (notification: Notification) => {
        if (notification.type === 'NOTIFICATION') {
            const { type, source } = notification.data;
            if (source === NOTIFICATION_SOURCE.CIRCLE) {
                const { circleId, messageId, commentId } = notification.data;
                if (type === CIRCLE_NOTIDATA_TYPE.INVITATIONS)
                    navigation.navigate('Circles', { initScreen: 'Invitations' });
                else if (type === CIRCLE_NOTIDATA_TYPE.MYCIRCLES)
                    navigation.navigate('Circles', { initScreen: 'MyCircles' });
                else if (type === CIRCLE_NOTIDATA_TYPE.CIRCLES)
                    navigation.navigate('Circles', { initScreen: 'CircleList' });
                else if (type === CIRCLEDETAILS_NOTIDATA_TYPE.MESSAGES)
                    navigation.navigate('CircleMessage', {
                        initScreen: 'CircleMessageList',
                        circleId,
                        messageId,
                        commentId,
                    });
                else if (type === CIRCLEDETAILS_NOTIDATA_TYPE.MEMBERS)
                    navigation.navigate('CircleMessage', { initScreen: 'CircleInfo', circleId });
            }
        }
    };

    const Loading = () => {
        if (!loading) return null;
        return (
            <View style={styles.loadingContainerStyle}>
                <Progress.Circle
                    size={25}
                    indeterminate={loading}
                    color="white"
                    borderWidth={3}
                    borderColor={colors.primary}
                />
            </View>
        );
    };

    const renderItem = ({ item }: { item: Notification }) => (
        <NotificationItem
            notification={item}
            onDelete={() => {
                dispatch(deleteNotification(item.id));
                NotificationService.deleteNotification(item.id);
            }}
            onPress={() => onPressNotification(item)}
        />
    );

    return (
        <View style={styles.containerStyle}>
            <Header title="Messages" style={styles.headerStyle} />
            <View style={styles.listContainerStyle}>
                <Loading />
                <CTInfiniteFlatlist<Notification> renderItem={renderItem} data={notifications} />
            </View>
        </View>
    );
};

export default MessagesScreen;
