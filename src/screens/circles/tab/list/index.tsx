import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import * as Progress from 'react-native-progress';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { Circle } from '@services/models';
import { CircleApi } from '@services/api';
import { handleError, showAlertModal } from '@store/actions';
import { CIRCLE_MEMBER_STATUS, CIRCLE_STATUS } from '@shared/constants';
import { useIsFocused } from '@react-navigation/native';
import CTInfiniteFlatlist from '@shared/components/controls/ct-infinite-flatlist';
import OtherCircleItem from '../../components/other-circle-item';
import CPBottomSheet from '@shared/components/bootom-sheet';
import CircleDetails from '../../components/circle-details';
import { AlertModalButton, CircleQuery } from '@services/types';
import { useAppNavigation } from '@services/hooks/useNavigation';
import CircleSearchOptionPanel from '@screens/circles/components/search-option-panel';
import { checkPermissionForCircle } from '@services/helpers/user';

const CircleListScreen = () => {
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
    const [data, setData] = useState<Circle[]>([]);
    const [selectedCircle, setSelectedCircle] = useState<Circle>();
    const [isOpenDetails, setIsOpenDetails] = useState<boolean>(false);
    const [query, setQuery] = useState<CircleQuery>({});

    const fetchCircles = useCallback(
        async (showLoading: boolean = false) => {
            if (showLoading) setLoading(true);
            try {
                const params = {
                    club: club?._id,
                    state: query.state || undefined,
                    county: query.county || undefined,
                    city: query.city || undefined,
                    subClub: query.subClub || undefined,
                    status: CIRCLE_STATUS.ACTIVATED,
                };
                const { data } = await CircleApi.retrieve(params);
                setData(sortData(data as Circle[]));
            } catch (error) {
                dispatch(handleError(error));
            }
            setLoading(false);
        },
        [user?._id!, query]
    );

    const sortData = (data: Circle[]) => {
        return (data as Circle[])
            .filter((x) => !isOwnCircle(x) && (isRequestCircle(x) || isOtherCircle(x)))
            .sort((a, b) => (a.members.length > b.members.length ? -1 : a.members.length < b.members.length ? 1 : 0));
    };

    useEffect(() => {
        if (isFocused) fetchCircles(true);
    }, [user?._id, isFocused, query]);

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

    const toggle = () => {
        setIsOpenDetails(!isOpenDetails);
    };

    const isOwnCircle = (circle: Circle) => {
        return circle.leader._id === user._id;
    };

    const isRequestCircle = (circle: Circle) => {
        return circle.members.some((x) => x.user._id === user._id && x.status === CIRCLE_MEMBER_STATUS.REQUESTED);
    };

    const isOtherCircle = (circle: Circle) => {
        return !circle.members.some((x) => x.user._id === user._id);
    };

    const onSelectCircle = (circle: Circle) => {
        const { valid, message, primaryButtonLabel, secondaryButtonLabel, reason } = checkPermissionForCircle(circle);
        if (valid) {
            setSelectedCircle(circle);
            setIsOpenDetails(true);
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

    const renderItem = ({ item }: { item: Circle; index?: number }) => (
        <OtherCircleItem circle={item} onPress={() => onSelectCircle(item)} />
    );

    const onOpenFilter = () => {
        navigation.navigate('CircleSearchPanel', {
            title: 'Circle Filter',
            query: query,
            onChange: (query) => setQuery(query),
        });
    };
    return (
        <View style={styles.containerStyle}>
            <CircleSearchOptionPanel query={query} onOpenFilter={onOpenFilter} />
            <View style={styles.listContainerStyle}>
                <Loading />
                <CTInfiniteFlatlist<Circle>
                    style={styles.listStyle}
                    renderItem={renderItem}
                    totalCount={data.length}
                    data={data}
                    isRefresh={isRefresh}
                    onRefresh={onRefresh}
                />
            </View>
            <CPBottomSheet isVisible={isOpenDetails} toggle={toggle}>
                <CircleDetails
                    circle={selectedCircle}
                    callBack={() => {
                        toggle();
                        fetchCircles(true);
                    }}
                />
            </CPBottomSheet>
        </View>
    );
};

export default CircleListScreen;
