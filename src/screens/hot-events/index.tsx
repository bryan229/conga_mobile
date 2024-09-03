import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import * as Progress from 'react-native-progress';
import { StackScreenProps } from '@react-navigation/stack';
import createStyles from './style';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { InitStackParamList } from '@navigation/types';
import { useTheme } from '@services/hooks/useTheme';
import { useAppNavigation } from '@services/hooks/useNavigation';
import { AuthApi, ClubEventApi, UserApi } from '@services/api';
import { handleError } from '@store/actions/ui';
import PublicHeader from '@navigation/components/public-header';
import { useIsFocused } from '@react-navigation/native';
import { Club, ClubEvent } from '@services/models';
import HotEventItem from './components/event-item';
import CTInfiniteFlatlist from '@shared/components/controls/ct-infinite-flatlist';
import {
    loginSuccess,
    putClub,
    putMemberTypes,
    putMyCircles,
    putMyGuestAccounts,
    putSponsors,
    showAlertModal,
} from '@store/actions';
import { CongaClubEventQuery } from '@services/types';
import { CLUBEVENT_REG_RESTRICT_TYPE, CLUB_TYPE, FILTER_DATE_REANGES } from '@shared/constants';
import HotEventSearchOptionPanel from './components/search-option-panel';
import { filterDateRangeToValues, mileToKm } from '@utils';

const LIMIT = 20;

type ScreenProps = StackScreenProps<InitStackParamList, 'HotEvents'>;

const HotEventsScreen: React.FC<ScreenProps> = () => {
    const dispatch = useAppDispatch();
    const credential = useAppSelector((state) => state.auth.credential);
    const notiToken = useAppSelector((state) => state.auth.deviceToken);
    const userLocation = useAppSelector((state) => state.auth.location);
    const myClubs = useAppSelector((state) => state.club.myClubs);
    const clubs = useAppSelector((state) => state.club.clubs);
    const theme = useTheme();
    const { colors } = theme;
    const navigation = useAppNavigation();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const isFocursed = useIsFocused();
    const [query, setQuery] = useState<CongaClubEventQuery>({
        dateRange: FILTER_DATE_REANGES.THIRTY_DAYS,
        aroundMe: !!userLocation,
        address: !userLocation,
        radius: 30,
    });
    const [hotEvents, setHotEvents] = useState<ClubEvent[]>([]);
    const [isRefresh, setIsRefresh] = useState(false);
    const [isLoadMore, setIsLoadMore] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchClubEvents = useCallback(
        async (skip: number, displayLoading?: boolean) => {
            if (displayLoading) setLoading(true);
            try {
                const { data, totalCount } = await ClubEventApi.retrieveHotEvents({
                    stDate: filterDateRangeToValues(query.dateRange).from,
                    etDate: filterDateRangeToValues(query.dateRange).to,
                    coordinates: query.aroundMe ? userLocation : undefined,
                    state: query.address ? query.state : undefined,
                    county: query.address ? query.county : undefined,
                    city: query.address ? query.city : undefined,
                    radius: mileToKm(query.radius),
                    skip: skip,
                    limit: LIMIT,
                });
                if (skip === 0) setHotEvents(data);
                else
                    setHotEvents((prev) =>
                        [...prev, ...data].filter((x, index, self) => self.findIndex((v) => v._id === x._id) === index)
                    );
                setTotalCount(totalCount);
            } catch (error) {
                dispatch(handleError(error));
            }
            setLoading(false);
        },
        [query]
    );

    useEffect(() => {
        if (isFocursed) fetchClubEvents(0, true);
    }, [isFocursed, query]);

    const loginToClub = async (club: Club) => {
        try {
            let params: any = { club: club._id, user: credential };
            if (notiToken) params = { ...params, notiToken };
            setLoading(true);
            const { user, token, refreshToken, memberTypes, myCircles, myGuestAccounts } = await AuthApi.login(params);
            const { data: _sponsors } = await UserApi.retrieveSponsors({ club: club?._id });
            dispatch(putSponsors(_sponsors));
            dispatch(putClub(club));
            dispatch(loginSuccess({ user, token, refreshToken }));
            dispatch(putMemberTypes(memberTypes));
            dispatch(putMyCircles(myCircles));
            dispatch(putMyGuestAccounts(myGuestAccounts));
            setLoading(false);
            if (club.allowUserSignUp && !user.isActivated) return navigation.navigate('Verify', { user, club });
            navigation.navigate('Home', { initScreen: 'ClubEvents' });
        } catch (error) {
            setLoading(false);
            dispatch(handleError(error));
        }
    };

    const regCongaClub = async (club: Club) => {
        try {
            setLoading(true);
            const referClub = myClubs[0];
            const params = {
                club: club?._id,
                referClub: referClub._id,
                credential,
            };
            await UserApi.signUp(params);
            setLoading(false);
            loginToClub(club);
        } catch (error) {
            setLoading(false);
            dispatch(handleError(error));
        }
    };

    const onSelectEvent = (item: ClubEvent) => {
        let eventClub = clubs.find((x) => x._id === item.club._id);
        if (!eventClub) return;
        const congaClub = clubs.find((x) => x.type === CLUB_TYPE.VIRTUAL);

        if (
            item.regRestrictType === CLUBEVENT_REG_RESTRICT_TYPE.ALL_MEMBERS ||
            item.regRestrictType === CLUBEVENT_REG_RESTRICT_TYPE.PARTICULAR_AREA
        )
            eventClub = congaClub;
        else if (!eventClub?.allowUserSignUp)
            return dispatch(
                showAlertModal({
                    type: 'info',
                    title: 'Alert',
                    message: `This is a event of ${eventClub.displayName} but this club doesn't allow members to self-registration.\nIf you want to register for this club, Please contact to this club \n Contact: ${eventClub.email}, ${eventClub.mobilePhone}`,
                })
            );

        if (!credential || myClubs.length == 0) return navigation.navigate('Register', { club: eventClub });
        let isMyClub = myClubs.some((x) => x._id === eventClub?._id);
        if (isMyClub) return loginToClub(eventClub!);
        dispatch(
            showAlertModal({
                type: 'info',
                title: 'Confirm',
                message: `This is an event of ${eventClub?.displayName}.\nDo you want to register for ${eventClub?.displayName}?`,
                buttons: [
                    {
                        type: 'ok',
                        label: 'Yes',
                        value: 'yes',
                    },
                    {
                        type: 'ok',
                        label: 'No',
                        value: 'no',
                    },
                ],
                handler: async (value: string) => {
                    if (value === 'no') return;
                    regCongaClub(eventClub!);
                },
            })
        );
    };

    const renderItem = ({ item }: { item: ClubEvent; index?: number }) => {
        return <HotEventItem event={item} onPress={() => onSelectEvent(item)} />;
    };

    const onLoadMore = async () => {
        setIsLoadMore(true);
        await fetchClubEvents(hotEvents.length);
        setIsLoadMore(false);
    };

    const onRefresh = async () => {
        setIsRefresh(true);
        await fetchClubEvents(0);
        setIsRefresh(false);
    };

    const openFilter = () => {
        navigation.navigate('EventSearchPanel', { title: 'Hot Event Filter', query, onChange: setQuery });
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

    return (
        <View style={styles.containerStyle}>
            <PublicHeader title="Hot Events" />
            <HotEventSearchOptionPanel query={query} onOpenFilter={openFilter} />
            <View style={styles.listContainerStyle}>
                <Loading />
                <CTInfiniteFlatlist<ClubEvent>
                    style={styles.listStyle}
                    renderItem={renderItem}
                    totalCount={totalCount}
                    data={hotEvents}
                    isLoadMore={isLoadMore}
                    onLoadMore={onLoadMore}
                    isRefresh={isRefresh}
                    onRefresh={onRefresh}
                />
            </View>
        </View>
    );
};

export default HotEventsScreen;
