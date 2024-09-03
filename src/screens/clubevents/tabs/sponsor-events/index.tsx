import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import * as Progress from 'react-native-progress';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { ClubEvent } from '@services/models';
import { ClubEventApi } from '@services/api';
import EventItem from '../../components/event-item';
import CTInfiniteFlatlist from '@shared/components/controls/ct-infinite-flatlist';
import { handleError, showAlertModal } from '@store/actions';
import CPBottomSheet from '@shared/components/bootom-sheet';
import ClubEventDetails from '@screens/clubevents/components/event-details';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import CPCircleControls from '@shared/components/circle-controls';
import CTCircleButton from '@shared/components/controls/ct-circle-icon-button';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import { useAppNavigation } from '@services/hooks/useNavigation';
import { AlertModalButton } from '@services/types';
import { checkSubscription } from '@services/helpers/user';

const LIMIT = 20;

const SponsorClubEventsScreen = () => {
    const club = useAppSelector((state) => state.club.club!);
    const user = useAppSelector((state) => state.auth.user!);
    const navigation = useAppNavigation();
    const isFocused = useIsFocused();
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [clubEvents, setClubEvents] = useState<ClubEvent[]>([]);
    const [isOpenDetails, setIsOpenDetails] = useState(false);
    const [selectedEvent, setEvent] = useState<ClubEvent>();
    const [isRefresh, setIsRefresh] = useState(false);
    const [isLoadMore, setIsLoadMore] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchClubEvents = useCallback(async (skip: number, displayLoading?: boolean) => {
        if (displayLoading) setLoading(true);
        try {
            const params = {
                club: club?._id,
                sponsor: user?._id,
                stDate: moment().startOf('day').format('YYYY-MM-DD'),
                skip: skip,
                limit: Math.min(200, Math.max((clubEvents ?? []).length, LIMIT)),
            };
            const res = await ClubEventApi.retrieve(params);
            if (skip === 0) setClubEvents(res.data);
            else
                setClubEvents((prev) =>
                    [...prev, ...res.data].filter((x, index, self) => self.findIndex((v) => v._id === x._id) === index)
                );
            setTotalCount(res.totalCount);
        } catch (error) {
            dispatch(handleError(error));
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (isFocused) fetchClubEvents(0, true);
    }, [isFocused]);

    const onSelectEvent = (event: ClubEvent) => {
        setEvent(event);
        setIsOpenDetails(true);
    };

    const renderItem = ({ item }: { item: ClubEvent; index?: number }) => {
        return <EventItem event={item} onPress={() => onSelectEvent(item)} />;
    };

    const onLoadMore = async () => {
        setIsLoadMore(true);
        await fetchClubEvents(clubEvents.length);
        setIsLoadMore(false);
    };

    const onRefresh = async () => {
        setIsRefresh(true);
        await fetchClubEvents(0);
        setIsRefresh(false);
    };

    const detailsCallback = () => {
        setIsOpenDetails(false);
        fetchClubEvents(0, true);
    };

    const toggle = () => {
        setIsOpenDetails(!isOpenDetails);
    };

    const gotoNewClubEvent = () => {
        const { valid, message, primaryButtonLabel, secondaryButtonLabel } = checkSubscription();
        if (valid) {
            navigation.navigate('CreateNewEvent', {});
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
                            return navigation.navigate('Subscription', { user, club });
                        }
                    },
                })
            );
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

    const CircleButtons = () => (
        <CPCircleControls style={styles.addButtonStyle}>
            <CTCircleButton color={colors.secondary} size={60} onPress={gotoNewClubEvent}>
                <Icon name="add" type={IconType.Ionicons} color={colors.dynamicWhite} size={30} />
            </CTCircleButton>
        </CPCircleControls>
    );

    return (
        <View style={styles.containerStyle}>
            <View style={styles.listContainerStyle}>
                <Loading />
                <CircleButtons />
                <CTInfiniteFlatlist<ClubEvent>
                    style={styles.listStyle}
                    renderItem={renderItem}
                    totalCount={totalCount}
                    data={clubEvents}
                    isLoadMore={isLoadMore}
                    onLoadMore={onLoadMore}
                    isRefresh={isRefresh}
                    onRefresh={onRefresh}
                />
            </View>
            <CPBottomSheet isVisible={isOpenDetails} toggle={toggle}>
                <ClubEventDetails event={selectedEvent} callBack={detailsCallback} toggle={toggle} />
            </CPBottomSheet>
        </View>
    );
};

export default SponsorClubEventsScreen;
