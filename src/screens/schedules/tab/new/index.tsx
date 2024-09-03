import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import { useAppDispatch, useAppSelector } from '@store/hook';
import * as Progress from 'react-native-progress';
import { Schedule } from '@services/models';
import { ClubApi, ScheduleApi } from '@services/api';
import { handleError, putClub, showAlertModal } from '@store/actions';
import { getActiveRealVenues, getVenue } from '@services/helpers/club';
import { convertTimeString, getTimeZoneMoment } from '@utils';
import { useAppNavigation } from '@services/hooks/useNavigation';
import moment from 'moment';
import { getStyle } from '@shared/theme/themes';
import { useIsFocused } from '@react-navigation/native';
import CTText from '@shared/components/controls/ct-text';
import OpenScheduleSearchPanel from '@screens/schedules/components/search-panel';
import { OpenScheduleQuery } from '@services/types';
import CTInfiniteFlatlist from '@shared/components/controls/ct-infinite-flatlist';
import {
    getCurrentScheduleDates,
    isAvailableTimeSlotCourt,
    isChallengeSchedule,
    isInMemberTypePermission,
    isMySchedule,
    isOpenSchedule,
} from '@services/helpers/schedule';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import fonts from '@shared/theme/fonts';
import CPBottomSheet from '@shared/components/bootom-sheet';
import OpenScheduleDetails from '@screens/schedules/components/open-schedule-details';
import { SCHEDULE_STATUS } from '@shared/constants';

const SubmitSchedule = () => {
    const club = useAppSelector((state) => state.club.club!);
    const user = useAppSelector((state) => state.auth.user!)!;
    const isFocused = useIsFocused();
    const navigate = useAppNavigation();
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const venues = getActiveRealVenues(club!);
    const [query, setQuery] = useState<OpenScheduleQuery>(() => {
        const time = getTimeZoneMoment(club.timezone!).format('HH:mm') > '12:00' ? 'any_afternoon' : 'any_morning';
        return { venue: venues[0]._id, time };
    });
    const [schedules, setSchedules] = useState<Schedule[][]>([]);
    const [isRefresh, setIsRefresh] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule>();
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpenAction, setIsOpenAction] = useState<boolean>(false);

    const fetchOpenSchedules = useCallback(
        async (displayLoading?: boolean) => {
            if (displayLoading) setLoading(true);
            try {
                const { data: _club } = await ClubApi.read({ _id: club._id });
                dispatch(putClub(_club));
                let params: any = {
                    venue: query.venue,
                    sort_by: 'date,time,court',
                    order_by: 'asc,asc,asc',
                };
                if (query.date) params = { ...params, date: query.date };
                else {
                    const venue = getVenue(_club, query.venue);
                    const dates = getCurrentScheduleDates(_club, venue!);
                    if (dates.length > 0)
                        params = { ...params, 'date.gte': dates[0], 'date.lte': dates[dates.length - 1] };
                }
                const { data } = await ScheduleApi.retrieve(params);
                const openSchedules = filterOpenSchedules(data as Schedule[]);
                const _schedules: Schedule[][] = [];
                for (let i = 0; i < openSchedules.length; i += 2) {
                    _schedules.push(openSchedules.slice(i, i + 2));
                }
                setSchedules(_schedules);
            } catch (error) {
                dispatch(handleError(error));
            }
            setLoading(false);
        },
        [query]
    );

    useEffect(() => {
        if (isFocused) fetchOpenSchedules(true);
    }, [query, isFocused]);

    const filterOpenSchedules = (totalSchedules: Schedule[]) => {
        const venue = getVenue(club, query.venue)!;
        return totalSchedules.filter(
            (x) =>
                isAvailableTimeSlotCourt(venue, x) &&
                (isOpenSchedule(x) ||
                    (venue.setting?.ruleSettings?.isReqOtherPyName && x.isSharing && !isMySchedule(venue, x, user))) &&
                !isChallengeSchedule(club, venue, x) &&
                isInMemberTypePermission(x, user, club) &&
                isRangeOfFilterTime(x)
        );
    };

    const isRangeOfFilterTime = (schedule: Schedule): boolean => {
        if (!query.time) return true;
        if (query.time === 'any_morning' && schedule.time < '12:00') return true;
        if (query.time === 'any_afternoon' && schedule.time >= '12:00') return true;
        return query.time === schedule.time;
    };

    const showConfirmAlert = (schedule: Schedule) => {
        dispatch(
            showAlertModal({
                type: 'info',
                title: 'Confirm',
                message: <AlertMessage schedule={schedule} />,
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
                    onReserveSchedule();
                },
            })
        );
    };

    const onReserveSchedule = async () => {
        if (!selectedSchedule) return;
        setLoading(true);
        try {
            let params: any = {
                _id: selectedSchedule?._id,
                owner: user._id,
                status: SCHEDULE_STATUS.CONFIRM,
            };
            await ScheduleApi.update(params);
            navigate.navigate('MySchedules');
        } catch (error) {
            dispatch(handleError(error));
        }
        setLoading(false);
    };

    const AlertMessage = ({ schedule }: { schedule: Schedule }) => {
        return (
            <>
                <CTText style={getStyle('my-8')}>Do you want to reserve this open time slot?</CTText>
                <View style={getStyle(['row', 'align-items-center', 'mb-8'])}>
                    <Icon name="calendar-outline" size={18} type={IconType.Ionicons} color={colors.iconPrimary} />
                    <View style={getStyle(['ml-4', 'mr-8'])}>
                        <CTText size={9} fontFamily={fonts.montserrat.bold} color={colors.text}>
                            {moment(schedule.date).format('dddd, MMM DD, YYYY')}{' '}
                            {convertTimeString(schedule.time, 'hh:mm A')}
                        </CTText>
                    </View>
                </View>
                <View style={getStyle(['row', 'align-items-center'])}>
                    <Icon name="location" size={18} type={IconType.Entypo} color={colors.iconPrimary} />
                    <View style={getStyle(['ml-8', 'mr-16'])}>
                        <CTText size={9} fontFamily={fonts.montserrat.bold} color={colors.text}>
                            {schedule.venue.displayName}, {schedule.venue.courtDisplayName} {schedule.court + 1}
                        </CTText>
                    </View>
                </View>
            </>
        );
    };

    const renderItem = ({ item }: { item: Schedule[]; index?: number }) => {
        return (
            <View style={getStyle(['row', 'align-items-center'])}>
                <TouchableOpacity
                    style={[
                        styles.itemContainer,
                        item[0].isSharing ? { backgroundColor: colors.purple } : {},
                        getStyle(['ml-16', 'mr-8']),
                    ]}
                    onPress={() => {
                        setSelectedSchedule(item[0]);
                        if (shouldShowDetails(item[0])) toggle();
                        else showConfirmAlert(item[0]);
                    }}
                >
                    <CTText
                        size={10}
                        style={getStyle('mb-4')}
                        fontFamily={fonts.montserrat.bold}
                        color={item[0].isSharing ? colors.white : colors.text}
                        center
                    >
                        {item[0].venue.displayName}
                    </CTText>
                    <CTText
                        size={9}
                        style={getStyle('mb-4')}
                        fontFamily={fonts.montserrat.medium}
                        color={item[0].isSharing ? colors.white : colors.text}
                        center
                    >
                        {item[0].venue.courtDisplayName} {item[0].court + 1}
                    </CTText>
                    <CTText
                        size={11}
                        style={getStyle('mb-4')}
                        fontFamily={fonts.montserrat.bold}
                        color={item[0].isSharing ? colors.white : colors.text}
                        center
                    >
                        {moment(item[0].date).format('ddd, MMM DD')}
                    </CTText>
                    <CTText
                        size={9}
                        fontFamily={fonts.montserrat.medium}
                        color={item[0].isSharing ? colors.white : colors.text}
                        center
                    >
                        {convertTimeString(item[0].time, 'hh:mm A')}
                    </CTText>
                </TouchableOpacity>
                {item.length > 1 && (
                    <TouchableOpacity
                        style={[
                            styles.itemContainer,
                            item[1].isSharing ? { backgroundColor: colors.purple } : {},
                            getStyle(['ml-8', 'mr-16']),
                        ]}
                        onPress={() => {
                            setSelectedSchedule(item[1]);
                            if (shouldShowDetails(item[1])) toggle();
                            else showConfirmAlert(item[1]);
                        }}
                    >
                        <CTText
                            size={10}
                            style={getStyle('mb-4')}
                            fontFamily={fonts.montserrat.bold}
                            color={item[1].isSharing ? colors.white : colors.text}
                            center
                        >
                            {item[1].venue.displayName}
                        </CTText>
                        <CTText
                            size={9}
                            style={getStyle('mb-4')}
                            fontFamily={fonts.montserrat.medium}
                            color={item[1].isSharing ? colors.white : colors.text}
                            center
                        >
                            {item[1].venue.courtDisplayName} {item[1].court + 1}
                        </CTText>
                        <CTText
                            size={11}
                            style={getStyle('mb-4')}
                            fontFamily={fonts.montserrat.bold}
                            color={item[1].isSharing ? colors.white : colors.text}
                            center
                        >
                            {moment(item[1].date).format('ddd, MMM DD')}
                        </CTText>
                        <CTText
                            size={9}
                            fontFamily={fonts.montserrat.medium}
                            color={item[1].isSharing ? colors.white : colors.text}
                            center
                        >
                            {convertTimeString(item[1].time, 'hh:mm A')}
                        </CTText>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const onRefresh = async () => {
        setIsRefresh(true);
        await fetchOpenSchedules();
        setIsRefresh(false);
    };

    const shouldShowDetails = (schedule: Schedule) => {
        return getVenue(club, schedule?.venue._id)?.setting.ruleSettings.isReqOtherPyName;
    };

    const toggle = () => {
        setIsOpenAction(!isOpenAction);
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
            <Loading />
            <OpenScheduleSearchPanel query={query} onChange={setQuery} />
            <View style={styles.listContainerStyle}>
                <CTInfiniteFlatlist<Schedule[]>
                    style={styles.listStyle}
                    renderItem={renderItem}
                    totalCount={schedules.length}
                    data={schedules}
                    isRefresh={isRefresh}
                    onRefresh={onRefresh}
                />
            </View>
            <CPBottomSheet isVisible={isOpenAction} toggle={toggle}>
                {selectedSchedule && (
                    <OpenScheduleDetails
                        schedule={selectedSchedule}
                        callback={() => {
                            toggle();
                            navigate.navigate('MySchedules');
                        }}
                    />
                )}
            </CPBottomSheet>
        </View>
    );
};

export default SubmitSchedule;
