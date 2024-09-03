import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { Request, RequestTemplate } from '@services/models';
import { RequestApi } from '@services/api';
import RequestItem from '../../components/request-item';
import { handleError } from '@store/actions';
import { getActiveRealVenues } from '@services/helpers/club';
import { getTimeZoneMoment } from '@utils';
import { TEMPLATE_STATUS } from '@shared/constants';
import { useIsFocused } from '@react-navigation/native';
import CPBottomSheet from '@shared/components/bootom-sheet';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import CPAlertModal from '@shared/components/alert-modal';
import { AlertModalState } from '@services/types';
import { useAppNavigation } from '@services/hooks/useNavigation';

const RequestsScreen = () => {
    const club = useAppSelector((state) => state.club.club);
    const user = useAppSelector((state) => state.auth.user);
    const navigate = useAppNavigation();
    const isFocused = useIsFocused();
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [requests, setRequests] = useState<Request[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<Request>();
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpenAction, setIsOpenAction] = useState<boolean>(false);
    const [isOpenAlert, setIsOpenAlert] = useState<boolean>(false);
    const [alertData, setAlertData] = useState<AlertModalState>({ message: '' });

    const fetchMyRequest = useCallback(async () => {
        setLoading(true);
        try {
            let templates: RequestTemplate[] = [];
            getActiveRealVenues(club!).forEach((venue) => templates.push(...(venue.releasedTemplates || [])));
            templates = templates.filter(
                (x) =>
                    x.etDate > getTimeZoneMoment(club!.timezone).format('YYYY-MM-DD') &&
                    x.status === TEMPLATE_STATUS.PUBLISHED
            );
            templates.sort((a, b) => (a.stDate < b.stDate ? -1 : a.stDate > b.stDate ? 1 : 0));
            if (templates.length > 0) {
                const params = {
                    club: club?._id!,
                    user: user?._id!,
                    stDate: templates[0].stDate!,
                    etDate: templates[templates.length - 1].etDate!,
                };
                const { data } = await RequestApi.retrieve(params);
                setRequests(sortByVenueAndDate(data as Request[]));
            }
        } catch (error) {
            dispatch(handleError(error));
        }
        setLoading(false);
    }, [user?._id!]);

    useEffect(() => {
        if (isFocused) fetchMyRequest();
    }, [user?._id, isFocused]);

    const sortByVenueAndDate = (data: Request[]) => {
        return data.sort((a, b) => {
            if (user?.preferredVenue === a.venue && user?.preferredVenue !== b.venue) return -1;
            else if (user?.preferredVenue !== a.venue && user?.preferredVenue === b.venue) return 1;
            if (a.venue < b.venue) return -1;
            else if (a.venue > b.venue) return 1;
            if (a.date < b.date) return -1;
            else if (a.date > b.date) return 1;
            return 0;
        });
    };

    const showAlertModal = (alrtData: AlertModalState) => {
        setIsOpenAlert(true);
        setAlertData(alrtData);
    };

    const onCancelRequest = () => {
        showAlertModal({
            type: 'warning',
            title: 'Cancel Request',
            message: 'Do you want to cancel this request"? \n Are you sure?',
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
                setIsOpenAction(false);
                const params = { _id: selectedRequest?._id };
                setLoading(true);
                await RequestApi.delete(params);
                const newRequests = [...requests].filter((x) => x._id !== selectedRequest?._id);
                setRequests(newRequests);
                setLoading(false);
            },
        });
    };

    const onEditRequest = () => {
        setIsOpenAction(false);
        navigate.navigate('SubmitRequest', { request: selectedRequest });
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

    const BottomActionSheetButtons = () => (
        <View>
            <View style={styles.bottomSheetButtonGroupStyle}>
                <TouchableOpacity style={[styles.bottomSheetButtonStyle, styles.borderBottom]} onPress={onEditRequest}>
                    <Icon name="edit" type={IconType.Feather} size={20} color={colors.primary} />
                    <CTText
                        color={colors.primary}
                        fontFamily={fonts.montserrat.semiBold}
                        style={styles.bottomSheetButtonTextStyle}
                    >
                        Edit Idea
                    </CTText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomSheetButtonStyle} onPress={onCancelRequest}>
                    <Icon name="trash-outline" type={IconType.Ionicons} size={20} color={colors.danger} />
                    <CTText
                        color={colors.danger}
                        fontFamily={fonts.montserrat.semiBold}
                        style={styles.bottomSheetButtonTextStyle}
                    >
                        Cancel Request
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
                <ScrollView style={styles.listStyle}>
                    {requests.map((x) => (
                        <RequestItem
                            request={x}
                            key={x._id}
                            onPress={() => {
                                setSelectedRequest(x);
                                setIsOpenAction(true);
                            }}
                        />
                    ))}
                </ScrollView>
            </View>
            <CPBottomSheet
                isVisible={isOpenAction}
                toggle={() => setIsOpenAction(false)}
                style={styles.bottomSheetStyle}
                isHideButton={false}
            >
                <BottomActionSheetButtons />
            </CPBottomSheet>
        </View>
    );
};

export default RequestsScreen;
