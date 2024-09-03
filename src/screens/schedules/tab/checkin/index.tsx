import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { Schedule, Venue } from '@services/models';
import { ScheduleApi } from '@services/api';
import { handleError } from '@store/actions';
import { getVenue } from '@services/helpers/club';
import { getTimeZoneMoment } from '@utils';
import { SCHEDULE_STATUS } from '@shared/constants';
import { useIsFocused } from '@react-navigation/native';
import CPBottomSheet from '@shared/components/bootom-sheet';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import { getCheckInVenues } from '@services/helpers/user';
import CheckInScheduleItem from '@screens/schedules/components/checkin-schedule-item';
import CTInfiniteFlatlist from '@shared/components/controls/ct-infinite-flatlist';
import { getStyle } from '@shared/theme/themes';
import CTSelect from '@shared/components/controls/ct-select';

type ResultType = Schedule | string;

const CheckInSchedulesScreen = () => {
    const club = useAppSelector((state) => state.club.club!);
    const user = useAppSelector((state) => state.auth.user!);
    const isFocused = useIsFocused();
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [schedules, setSchedules] = useState<ResultType[]>([]);
    const [venue, setVenue] = useState<Venue>(getCheckInVenues()[0]);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule>();
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpenAction, setIsOpenAction] = useState<boolean>(false);
    const [isRefresh, setIsRefresh] = useState(false);

    const fetchCheckInSchedules = useCallback(async () => {
        setLoading(true);
        try {
            let checkInVenueIds = getCheckInVenues()
                .map((x) => x._id)
                .join(',');
            const params = {
                'venue.or': checkInVenueIds,
                status: SCHEDULE_STATUS.CONFIRM,
                date: getTimeZoneMoment(club.timezone).format('YYYY-MM-DD'),
                'time.gte': getTimeZoneMoment(club.timezone).format('HH:mm'),
                sort_by: 'time',
                order_by: 'asc',
            };
            const { data } = await ScheduleApi.retrieve(params);
            setSchedules(sortByTime(data as Schedule[]));
        } catch (error) {
            dispatch(handleError(error));
        }
        setLoading(false);
    }, [user?._id!]);

    useEffect(() => {
        if (isFocused) fetchCheckInSchedules();
    }, [user?._id, isFocused]);

    const sortByTime = (data: Schedule[]) => {
        const times = Array.from(new Set(data.map((x) => x.time))).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
        const result: ResultType[] = [];
        for (const time of times) {
            const timeResult = data.filter((x) => x.time === time);
            result.push(time, ...timeResult);
        }
        return result;
    };

    const onCheckInSchedule = async () => {
        toggle();
        setLoading(true);
        try {
            let params: any = {
                _id: selectedSchedule?._id,
                isArrived: !selectedSchedule?.isArrived,
            };
            await ScheduleApi.update(params);
            const newSchedules = [...schedules];
            const index = newSchedules.findIndex((x) => typeof x !== 'string' && x._id === selectedSchedule?._id);
            newSchedules.splice(index, 1, { ...selectedSchedule, isArrived: !selectedSchedule?.isArrived } as Schedule);
            setSchedules(newSchedules);
        } catch (error) {
            dispatch(handleError(error));
        }
        setLoading(false);
    };

    const toggle = () => {
        setIsOpenAction(!isOpenAction);
    };

    const onRefresh = async () => {
        setIsRefresh(true);
        await fetchCheckInSchedules();
        setIsRefresh(false);
    };

    const getVenueOptions = () => {
        return getCheckInVenues().map((x) => {
            return { value: x._id, label: x.displayName };
        });
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

    const renderItem = ({ item }: { item: Schedule | string; index?: number }) => {
        if (typeof item === 'string')
            return (
                <CTText style={getStyle(['ml-16', 'py-8'])} color={colors.text} fontFamily={fonts.montserrat.bold}>
                    {item}
                </CTText>
            );
        return (
            <CheckInScheduleItem
                schedule={item}
                onPress={() => {
                    setSelectedSchedule(item);
                    setIsOpenAction(true);
                }}
            />
        );
    };

    const BottomActionSheetButtons = () => (
        <View>
            <View style={styles.bottomSheetButtonGroupStyle}>
                <TouchableOpacity style={styles.bottomSheetButtonStyle} onPress={onCheckInSchedule}>
                    <Icon
                        name={selectedSchedule?.isArrived ? 'checkmark-circle' : 'checkmark-done-circle'}
                        type={IconType.Ionicons}
                        size={20}
                        color={colors.secondary}
                    />
                    <CTText
                        color={colors.secondary}
                        fontFamily={fonts.montserrat.semiBold}
                        style={styles.bottomSheetButtonTextStyle}
                    >
                        {selectedSchedule?.isArrived ? 'Cancel Check-In' : 'Check-In Timeslot'}
                    </CTText>
                </TouchableOpacity>
            </View>
            <View style={styles.buttomSheetCancelButtonContainer}>
                <TouchableOpacity style={styles.bottomSheetCancelButtonStyle} onPress={toggle}>
                    <CTText
                        fontFamily={fonts.montserrat.semiBold}
                        style={styles.bottomSheetCancelButtonTextStyle}
                        color={colors.primary}
                    >
                        Close
                    </CTText>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.containerStyle}>
            {getCheckInVenues().length > 1 && (
                <CTSelect
                    name="venue"
                    style={getStyle(['mx-16', 'mt-16'])}
                    required
                    options={getVenueOptions()}
                    value={venue._id}
                    onChange={(value) => setVenue(getVenue(club, value)!)}
                />
            )}
            <View style={styles.listContainerStyle}>
                <Loading />
                <CTInfiniteFlatlist<Schedule | string>
                    style={styles.listStyle}
                    renderItem={renderItem}
                    totalCount={schedules.length}
                    data={schedules}
                    isRefresh={isRefresh}
                    onRefresh={onRefresh}
                />
            </View>
            <CPBottomSheet
                isVisible={isOpenAction}
                toggle={toggle}
                style={styles.bottomSheetStyle}
                isHideButton={false}
            >
                <BottomActionSheetButtons />
            </CPBottomSheet>
        </View>
    );
};

export default CheckInSchedulesScreen;
