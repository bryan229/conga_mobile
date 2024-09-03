import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import * as Progress from 'react-native-progress';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { Circle } from '@services/models';
import { CircleApi } from '@services/api';
import { handleError, putMyCircles, showAlertModal } from '@store/actions';
import { useIsFocused } from '@react-navigation/native';
import CTInfiniteFlatlist from '@shared/components/controls/ct-infinite-flatlist';
import { useAppNavigation } from '@services/hooks/useNavigation';
import { CIRCLE_MEMBER_STATUS } from '@shared/constants';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import { getStyle } from '@shared/theme/themes';
import OwnCircleItem from '../../components/own-circle-item';
import OtherCircleItem from '@screens/circles/components/other-circle-item';
import { checkPermissionForCircle } from '@services/helpers/user';
import { AlertModalButton } from '@services/types';

const MyCirclesScreen = () => {
    const club = useAppSelector((state) => state.club.club!);
    const user = useAppSelector((state) => state.auth.user!);
    const isFocused = useIsFocused();
    const dispatch = useAppDispatch();
    const navigation = useAppNavigation();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isRefresh, setIsRefresh] = useState(false);
    const [data, setData] = useState<(Circle | string)[]>([]);

    const fetchCircles = useCallback(
        async (showLoading: boolean = false) => {
            if (showLoading) setLoading(true);
            try {
                const params = { club: club?._id };
                const { data } = await CircleApi.retrieve(params);
                setData(sortData(data as Circle[]));
                dispatch(putMyCircles((data as Circle[]).filter((x) => isOwnCircle(x) || isJoinedCircle(x))));
            } catch (error) {
                dispatch(handleError(error));
            }
            setLoading(false);
        },
        [user?._id!]
    );

    const sortData = (data: Circle[]) => {
        const circles = (data as Circle[])
            .filter((x) => isOwnCircle(x) || isJoinedCircle(x))
            .sort((a, b) => (a.members.length > b.members.length ? -1 : a.members.length < b.members.length ? 1 : 0));
        const ownCircles = circles.filter((x) => isOwnCircle(x));
        const joinedCircles = circles.filter((x) => isJoinedCircle(x));
        let circleData: (Circle | string)[] = [];
        if (ownCircles.length > 0) circleData = ['Own Circles', ...ownCircles];
        if (joinedCircles.length > 0) circleData = [...circleData, 'Joined Circle', ...joinedCircles];
        return circleData;
    };

    useEffect(() => {
        if (isFocused) fetchCircles(true);
    }, [user?._id, isFocused]);

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

    const onRefresh = async () => {
        setIsRefresh(true);
        await fetchCircles();
        setIsRefresh(false);
    };

    const isJoinedCircle = (circle: Circle) => {
        return (
            circle.leader._id !== user._id &&
            circle.members.some((x) => x.user._id === user._id && x.status === CIRCLE_MEMBER_STATUS.APPROVED)
        );
    };

    const isOwnCircle = (circle: Circle) => {
        return circle.leader._id === user._id;
    };

    const onSelectCircle = (circle: Circle) => {
        const { valid, message, primaryButtonLabel, secondaryButtonLabel, reason } = checkPermissionForCircle(circle);
        if (valid) {
            navigation.navigate('CircleMessage', { circleId: circle._id });
        } else if (message) {
            const buttons: AlertModalButton[] = [];
            if (primaryButtonLabel) buttons.push({ type: 'ok', label: primaryButtonLabel, value: 'yes' });
            if (secondaryButtonLabel) buttons.push({ type: 'cancel', label: secondaryButtonLabel, value: 'no' });
            dispatch(
                showAlertModal({
                    type: 'warning',
                    title: 'Warning',
                    message,
                    buttons,
                    handler: async (value: string) => {
                        if (value === 'yes') {
                            if (reason === 'subscribe') return navigation.navigate('Subscription', { user, club });
                            else if (reason === 'profile') return navigation.navigate('Profile');
                        }
                    },
                })
            );
        }
    };

    const renderItem = ({ item }: { item: Circle | string; index?: number }) => {
        if (typeof item === 'string')
            return (
                <CTText fontFamily={fonts.montserrat.bold} bold style={getStyle('p-16')}>
                    {item}
                </CTText>
            );
        if (isOwnCircle(item)) return <OwnCircleItem circle={item} onPress={() => onSelectCircle(item)} />;
        return <OtherCircleItem circle={item} onPress={() => onSelectCircle(item)} />;
    };

    return (
        <View style={styles.containerStyle}>
            <View style={styles.listContainerStyle}>
                <Loading />
                <CTInfiniteFlatlist<Circle | string>
                    style={styles.listStyle}
                    renderItem={renderItem}
                    totalCount={data.length}
                    data={data}
                    isRefresh={isRefresh}
                    onRefresh={onRefresh}
                />
            </View>
        </View>
    );
};

export default MyCirclesScreen;
