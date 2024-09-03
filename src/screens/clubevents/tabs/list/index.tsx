import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import * as Progress from 'react-native-progress';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { Circle, ClubEvent } from '@services/models';
import { CircleApi, ClubEventApi } from '@services/api';
import EventItem from '../../components/event-item';
import CTInfiniteFlatlist from '@shared/components/controls/ct-infinite-flatlist';
import { handleError, putMyCircles, showAlert, showAlertModal } from '@store/actions';
import CPBottomSheet from '@shared/components/bootom-sheet';
import ClubEventDetails from '@screens/clubevents/components/event-details';
import { useIsFocused } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { ClubEventStackParamList } from '@navigation/types';
import CongaSearchOptionPanel from '@screens/clubevents/components/conga-search-option-panel';
import { CLUB_TYPE } from '@shared/constants';
import ClubEventSearchPanel from '../../components/search-panel';
import { filterDateRangeToValues, mileToKm } from '@utils';
import { useAppNavigation } from '@services/hooks/useNavigation';
import { putCongaClubEventQuery } from '@store/actions/clubevent';
import { AlertModalButton } from '@services/types';
import CircleJoinModal from '@screens/clubevents/components/circle-join-modal';
import { checkPermissionForEvent } from '@services/helpers/user';

const LIMIT = 20;

type ScreenProps = StackScreenProps<ClubEventStackParamList, 'ClubEventList'>;

const ClubEventsScreen = ({}: ScreenProps) => {
    const { query, congaClubEventQuery } = useAppSelector((state) => state.clubEvent);
    const userLocation = useAppSelector((state) => state.auth.location);
    const club = useAppSelector((state) => state.club.club!);
    const user = useAppSelector((state) => state.auth.user!);
    const myCircles = useAppSelector((state) => state.club.myCircles);
    const dispatch = useAppDispatch();
    const navigation = useAppNavigation();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const isFocused = useIsFocused();
    const [clubEvents, setClubEvents] = useState<ClubEvent[]>([]);
    const [isOpenDetails, setIsOpenDetails] = useState(false);
    const [selectedEvent, setEvent] = useState<ClubEvent>();
    const [isRefresh, setIsRefresh] = useState(false);
    const [isLoadMore, setIsLoadMore] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isOpenJoin, setIsOpenJoin] = useState(false);

    const fetchClubEvents = useCallback(
        async (skip: number, displayLoading?: boolean) => {
            if (displayLoading) setLoading(true);
            try {
                let params: any = {};
                if (club?.type === CLUB_TYPE.VIRTUAL) {
                    params = {
                        club: club?._id,
                        stDate: filterDateRangeToValues(congaClubEventQuery.dateRange).from,
                        etDate: filterDateRangeToValues(congaClubEventQuery.dateRange).to,
                        coordinates: userLocation && congaClubEventQuery.aroundMe ? userLocation : undefined,
                        state: congaClubEventQuery.address ? congaClubEventQuery.state : undefined,
                        county: congaClubEventQuery.address ? congaClubEventQuery.county : undefined,
                        city: congaClubEventQuery.address ? congaClubEventQuery.city : undefined,
                        circles:
                            congaClubEventQuery.onlyMyCicle && myCircles.length > 0
                                ? myCircles.map((x) => x._id)
                                : undefined,
                        eventType: congaClubEventQuery.eventType,
                        organization: congaClubEventQuery.organization,
                        radius: mileToKm(congaClubEventQuery.radius),
                        skip: skip,
                        limit: Math.min(200, Math.max((clubEvents ?? []).length, LIMIT)),
                    };
                } else {
                    params = {
                        club: club?._id,
                        stDate: query.from,
                        etDate: query.to,
                        venue: query.venue,
                        court: query.court,
                        sponsor: query.sponsor,
                        eventType: query.eventType,
                        'eventType.exists': query.eventType ? undefined : true,
                        invitedMemberTypes: query.invitedMemberTypes,
                        skip: skip,
                        limit: Math.min(200, Math.max((clubEvents ?? []).length, LIMIT)),
                    };
                }
                const res = await ClubEventApi.retrieve(params);
                if (skip === 0) setClubEvents(res.data);
                else
                    setClubEvents((prev) =>
                        [...prev, ...res.data].filter(
                            (x, index, self) => self.findIndex((v) => v._id === x._id) === index
                        )
                    );
                setTotalCount(res.totalCount);
            } catch (error) {
                dispatch(handleError(error));
            }
            setLoading(false);
        },
        [query, congaClubEventQuery]
    );

    useEffect(() => {
        if (isFocused) fetchClubEvents(0, true);
    }, [query, congaClubEventQuery, isFocused]);

    const onSelectItem = (event: ClubEvent) => {
        const { valid, message, primaryButtonLabel, secondaryButtonLabel, reason } = checkPermissionForEvent(event);
        if (reason === 'multi_circle_join') {
            setEvent(event);
            setIsOpenJoin(true);
            return;
        }
        if (valid) {
            setEvent(event);
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
                            else if (reason === 'one_circle_join') return joinCircle(event.invitedCircles?.[0]);
                        }
                    },
                })
            );
        }
    };

    const joinCircle = async (circle?: Circle) => {
        if (!circle) return;
        setLoading(true);
        try {
            let params: any = { _id: circle._id };
            const { data } = await CircleApi.joinRequest(params);
            dispatch(putMyCircles([...myCircles, data]));
            dispatch(
                showAlert({
                    type: 'success',
                    title: 'Success',
                    message: `You has been joined for ${circle.name}`,
                })
            );
        } catch (error) {
            dispatch(handleError(error));
        }
        setLoading(false);
    };

    const renderItem = ({ item }: { item: ClubEvent; index?: number }) => {
        return <EventItem event={item} onPress={() => onSelectItem(item)} />;
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

    const toggle = () => {
        setIsOpenDetails(!isOpenDetails);
    };

    const detailsCallback = () => {
        setIsOpenDetails(false);
        fetchClubEvents(0, true);
    };

    const onOpenFilter = () => {
        navigation.navigate('EventSearchPanel', {
            title: 'Club Event Filter',
            query: congaClubEventQuery,
            onChange: (query) => dispatch(putCongaClubEventQuery(query)),
        });
    };

    return (
        <View style={styles.containerStyle}>
            <Loading />

            {club?.type === CLUB_TYPE.VIRTUAL ? (
                <CongaSearchOptionPanel onOpenFilter={onOpenFilter} />
            ) : (
                <ClubEventSearchPanel />
            )}
            <View style={styles.listContainerStyle}>
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
            <CircleJoinModal
                isOpen={isOpenJoin}
                toggle={() => setIsOpenJoin(false)}
                circles={selectedEvent?.invitedCircles ?? []}
            />
            <CPBottomSheet isVisible={isOpenDetails} toggle={toggle}>
                <ClubEventDetails event={selectedEvent} callBack={detailsCallback} toggle={toggle} />
            </CPBottomSheet>
        </View>
    );
};

export default ClubEventsScreen;
