import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { Schedule } from '@services/models';
import { ScheduleApi } from '@services/api';
import ScheduleItem from '../schedules/components/schedule-item';
import { handleError, showAlert } from '@store/actions';
import { getActiveRealVenues, getVenue } from '@services/helpers/club';
import { getTimeZoneMoment } from '@utils';
import { SCHEDULE_STATUS } from '@shared/constants';
import { RouteProp, useRoute } from '@react-navigation/native';
import CPBottomSheet from '@shared/components/bootom-sheet';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import CPAlertModal from '@shared/components/alert-modal';
import { AlertModalState } from '@services/types';
import { isForwardSchedule, isOwnerSchedule, isSharedSchedule } from '@services/helpers/schedule';
import ScheduleDetails from '@screens/schedules/components/schedule-details';
import CTInfiniteFlatlist from '@shared/components/controls/ct-infinite-flatlist';
import { RootStackParamList } from '@navigation/types';
import BackHeader from '@navigation/components/back-header';
import { getStyle } from '@shared/theme/themes';
import { useAppNavigation } from '@services/hooks/useNavigation';

const CheckInScreen = () => {
    const club = useAppSelector((state) => state.club.club!);
    const user = useAppSelector((state) => state.auth.user!);
    const route = useRoute<RouteProp<RootStackParamList, 'CheckIn'>>();
    const navigation = useAppNavigation();
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule>();
    const [loading, setLoading] = useState<boolean>(false);
    const [isRefresh, setIsRefresh] = useState(false);
    const [isOpenAction, setIsOpenAction] = useState<boolean>(false);
    const [isOpenAlert, setIsOpenAlert] = useState<boolean>(false);
    const [alertData, setAlertData] = useState<AlertModalState>({ message: '' });

    const fetchMySchedules = useCallback(
        async (isInit?: boolean) => {
            setLoading(true);
            try {
                let params: any = {
                    owner: user?._id,
                    'status.ne': SCHEDULE_STATUS.CANCELED,
                    date: getTimeZoneMoment(club?.timezone!).format('YYYY-MM-DD'),
                    isIncludeSharedSched: true,
                    sort_by: 'date,time',
                    order_by: 'asc,asc',
                };
                if (route.params?.venue) params = { ...params, venue: route.params.venue, court: route.params.court };
                else params = { ...params, club: club?._id };

                const { data } = await ScheduleApi.retrieve(params);
                let result = sortByVenueAndDate(data as Schedule[]).filter((x) => isForwardSchedule(x, club));
                if (isInit) {
                    const checkInSchedules = result.filter((x) => {
                        const venue = getVenue(club, x.venue._id);
                        return venue?.setting?.ruleSettings?.isRequireCheckIn && isOwnerSchedule(x, user);
                    });
                    await autoCheckIn(checkInSchedules);
                    if (checkInSchedules.length > 0)
                        dispatch(
                            showAlert({ type: 'success', title: club.displayName, message: 'Thank for checking in.' })
                        );
                    result = result.map((x) => {
                        if (checkInSchedules.some((v) => v._id === x._id)) return { ...x, isArrived: true };
                        return x;
                    });
                }
                setSchedules(result);
            } catch (error) {
                dispatch(handleError(error));
            }
            setLoading(false);
        },
        [route.params]
    );

    useEffect(() => {
        if (!user || !club) return;
        fetchMySchedules(true);
    }, [user?._id, route.params]);

    if (!user || !club) return null;

    const autoCheckIn = async (checkInSchedules: Schedule[]) => {
        try {
            const params = { schedules: checkInSchedules.map((x) => x._id) };
            await ScheduleApi.autoCheckIn(params);
        } catch (error) {
            dispatch(handleError(error));
        }
    };

    const sortByVenueAndDate = (data: Schedule[]) => {
        const result: Schedule[] = [];
        getActiveRealVenues(club).forEach((x) => {
            const venueSchedules = data
                .filter((v) => v.venue._id === x._id)
                .sort((a, b) =>
                    a.date > b.date ? 1 : a.date < b.date ? -1 : a.time > b.time ? 1 : a.time < b.time ? -1 : 0
                );
            result.push(...venueSchedules);
        });
        return result;
    };

    const showAlertModal = (alrtData: AlertModalState) => {
        setIsOpenAlert(true);
        setAlertData(alrtData);
    };

    const onCancelSchedule = async () => {
        if (!selectedSchedule) return;
        showAlertModal({
            type: 'warning',
            title:
                isOwnerSchedule(selectedSchedule, user) || isSharedSchedule(selectedSchedule, user)
                    ? 'Cancel Schedule'
                    : 'Reject Invitation',
            message:
                isOwnerSchedule(selectedSchedule, user) || isSharedSchedule(selectedSchedule, user)
                    ? 'Do you want to cancel this schedule?'
                    : 'Do you want to reject this invitation?',
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
                if (isOwnerSchedule(selectedSchedule, user)) cancelSchedule();
                else cancelSharedSchedule();
                toggle();
            },
        });
    };

    const cancelSchedule = async () => {
        setLoading(true);
        try {
            let params: any = {
                _id: selectedSchedule?._id,
                status: SCHEDULE_STATUS.CANCELED,
            };
            await ScheduleApi.update(params);
            const newSchedules = [...schedules].filter((x) => x._id !== selectedSchedule?._id);
            setSchedules(newSchedules);
        } catch (error) {
            dispatch(handleError(error));
        }
        setLoading(false);
    };

    const cancelSharedSchedule = async () => {
        setLoading(true);
        try {
            let params: any = {
                _id: selectedSchedule?._id,
            };
            await ScheduleApi.cancelShared(params);
            const newSchedules = [...schedules].filter((x) => x._id !== selectedSchedule?._id);
            setSchedules(newSchedules);
        } catch (error) {
            dispatch(handleError(error));
        }
        setLoading(false);
    };

    const onRefresh = async () => {
        setIsRefresh(true);
        await fetchMySchedules();
        setIsRefresh(false);
    };

    const shouldShowDetails = () => {
        return (
            selectedSchedule &&
            isOwnerSchedule(selectedSchedule, user) &&
            getVenue(club, selectedSchedule?.venue._id)?.setting.ruleSettings.isReqOtherPyName
        );
    };

    const toggle = () => {
        setIsOpenAction(!isOpenAction);
    };

    const renderItem = ({ item }: { item: Schedule; index?: number }) => (
        <ScheduleItem
            schedule={item}
            onPress={() => {
                setSelectedSchedule(item);
                setIsOpenAction(true);
            }}
        />
    );

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

    const BottomActionSheetButtons = () => (
        <View>
            <View style={styles.bottomSheetButtonGroupStyle}>
                <TouchableOpacity style={styles.bottomSheetButtonStyle} onPress={onCancelSchedule}>
                    <Icon name="trash-outline" type={IconType.Ionicons} size={20} color={colors.danger} />
                    <CTText
                        color={colors.danger}
                        fontFamily={fonts.montserrat.semiBold}
                        style={styles.bottomSheetButtonTextStyle}
                    >
                        {isOwnerSchedule(selectedSchedule!, user) || isSharedSchedule(selectedSchedule!, user)
                            ? 'Cancel Schedule'
                            : 'Reject Invitation'}
                    </CTText>
                </TouchableOpacity>
            </View>
            <View style={styles.buttomSheetCancelButtonContainer}>
                <TouchableOpacity style={styles.bottomSheetCancelButtonStyle} onPress={() => setIsOpenAction(false)}>
                    <CTText
                        fontFamily={fonts.montserrat.semiBold}
                        style={styles.bottomSheetCancelButtonTextStyle}
                        color={colors.primary}
                    >
                        Close
                    </CTText>
                </TouchableOpacity>
            </View>
            <CPAlertModal isVisible={isOpenAlert} toggle={() => setIsOpenAlert(false)} alertData={alertData} />
        </View>
    );

    const NoDataMessage = () => {
        return (
            <View style={getStyle(['mt-80', 'px-16'])}>
                <View>
                    <CTText
                        fontFamily={fonts.montserrat.semiBold}
                        center
                        color={colors.text}
                        size={12}
                        style={getStyle('mb-8')}
                    >
                        {route.params.venue
                            ? "You don't have schedule at this court today."
                            : "You don't have schedule at this club today."}
                    </CTText>
                    <CTText fontFamily={fonts.montserrat.semiBold} center color={colors.text} size={12}>
                        Do you want to reserve open time slots?
                    </CTText>
                    <View style={getStyle(['row', 'align-items-center', 'justify-center', 'mt-32'])}>
                        <TouchableOpacity
                            style={getStyle(['row', 'align-items-center', 'mr-48'])}
                            onPress={() => navigation.goBack()}
                        >
                            <Icon name="close" color={colors.text} type={IconType.Ionicons} size={25} />
                            <CTText
                                fontFamily={fonts.montserrat.semiBold}
                                center
                                color={colors.text}
                                size={14}
                                style={getStyle('ml-8')}
                            >
                                No
                            </CTText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={getStyle(['row', 'align-items-center'])}
                            onPress={() => navigation.navigate('Reservations', { defaultScreen: 'SubmitSchedule' })}
                        >
                            <Icon name="checkmark" color={colors.primary} type={IconType.Ionicons} size={25} />
                            <CTText
                                fontFamily={fonts.montserrat.semiBold}
                                center
                                color={colors.primary}
                                size={14}
                                style={getStyle('ml-8')}
                            >
                                Yes
                            </CTText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.containerStyle}>
            <BackHeader title="Check In" />
            <View style={styles.listContainerStyle}>
                <Loading />
                {schedules.length > 0 && (
                    <CTInfiniteFlatlist<Schedule>
                        style={styles.listStyle}
                        renderItem={renderItem}
                        totalCount={schedules.length}
                        data={schedules}
                        isRefresh={isRefresh}
                        onRefresh={onRefresh}
                    />
                )}
                {schedules.length === 0 && !loading && <NoDataMessage />}
            </View>
            <CPBottomSheet
                isVisible={isOpenAction}
                toggle={toggle}
                style={!shouldShowDetails() && styles.bottomSheetStyle}
                isHideButton={shouldShowDetails()}
            >
                {selectedSchedule && (
                    <>
                        {shouldShowDetails() ? (
                            <ScheduleDetails
                                schedule={selectedSchedule}
                                callback={() => {
                                    toggle();
                                    fetchMySchedules();
                                }}
                            />
                        ) : (
                            <BottomActionSheetButtons />
                        )}
                    </>
                )}
            </CPBottomSheet>
        </View>
    );
};

export default CheckInScreen;
