import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { Schedule } from '@services/models';
import { ScheduleApi } from '@services/api';
import ScheduleItem from '../../components/schedule-item';
import { handleError } from '@store/actions';
import { getActiveRealVenues, getVenue } from '@services/helpers/club';
import { getTimeZoneMoment } from '@utils';
import { SCHEDULE_STATUS } from '@shared/constants';
import { useIsFocused } from '@react-navigation/native';
import CPBottomSheet from '@shared/components/bootom-sheet';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import CPAlertModal from '@shared/components/alert-modal';
import { AlertModalState } from '@services/types';
import { isOwnerSchedule, isSharedSchedule } from '@services/helpers/schedule';
import ScheduleDetails from '@screens/schedules/components/schedule-details';
import CTInfiniteFlatlist from '@shared/components/controls/ct-infinite-flatlist';

const MySchedulesScreen = () => {
    const club = useAppSelector((state) => state.club.club!);
    const user = useAppSelector((state) => state.auth.user!);
    const isFocused = useIsFocused();
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

    const fetchMySchedules = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                club: club?._id,
                owner: user?._id,
                'status.ne': SCHEDULE_STATUS.CANCELED,
                'date.gte': getTimeZoneMoment(club?.timezone!).format('YYYY-MM-DD'),
                isIncludeSharedSched: true,
                sort_by: 'date,time',
                order_by: 'asc,asc',
            };
            const { data } = await ScheduleApi.retrieve(params);
            setSchedules(sortByVenueAndDate(data as Schedule[]));
        } catch (error) {
            dispatch(handleError(error));
        }
        setLoading(false);
    }, [user?._id!]);

    useEffect(() => {
        if (isFocused) fetchMySchedules();
    }, [user?._id, isFocused]);

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

    const onConfirmSchedule = async () => {
        toggle();
        if (!selectedSchedule) return;
        setLoading(true);
        try {
            let params: any = {
                _id: selectedSchedule?._id,
                status: SCHEDULE_STATUS.CONFIRM,
            };
            await ScheduleApi.update(params);
            const newSchedules = [...schedules].map((x) => {
                if (x._id === selectedSchedule._id) return { ...x, status: SCHEDULE_STATUS.CONFIRM };
                return x;
            });
            setSchedules(newSchedules);
        } catch (error) {
            dispatch(handleError(error));
        }
        setLoading(false);
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
                {isOwnerSchedule(selectedSchedule!, user) && selectedSchedule?.status === SCHEDULE_STATUS.PENDING && (
                    <TouchableOpacity
                        style={[styles.bottomSheetButtonStyle, styles.borderBottom]}
                        onPress={onConfirmSchedule}
                    >
                        <Icon name="checkmark-circle" type={IconType.Ionicons} size={20} color={colors.primary} />
                        <CTText
                            color={colors.primary}
                            fontFamily={fonts.montserrat.semiBold}
                            style={styles.bottomSheetButtonTextStyle}
                        >
                            Confirm Schedule
                        </CTText>
                    </TouchableOpacity>
                )}
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

    return (
        <View style={styles.containerStyle}>
            <View style={styles.listContainerStyle}>
                <Loading />
                <CTInfiniteFlatlist<Schedule>
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
                style={!shouldShowDetails() && styles.bottomSheetStyle}
                isHideButton={shouldShowDetails()}
            >
                {selectedSchedule && (
                    <>
                        {shouldShowDetails() ? (
                            <ScheduleDetails
                                schedule={selectedSchedule}
                                toggle={toggle}
                                callback={() => {
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

export default MySchedulesScreen;
