import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useAppDispatch, useAppSelector } from '@store/hook';
import * as Progress from 'react-native-progress';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import { UserApi } from '@services/api';
import { handleError, showAlert } from '@store/actions/ui';
import { GENDER, WEEKDAYS } from '@shared/constants';
import { User } from '@services/models';
import CTInfiniteFlatlist from '@shared/components/controls/ct-infinite-flatlist';
import CTSelect from '@shared/components/controls/ct-select';
import { getStyle } from '@shared/theme/themes';
import CTTextInput from '@shared/components/controls/ct-textinput';
import CTButton from '@shared/components/controls/ct-button';
import OpponentItem from './components/opponent-item';
import { useForm } from 'react-hook-form';
import CPBottomSheet from '@shared/components/bootom-sheet';
import { TouchableOpacity } from 'react-native';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import CPAlertModal from '@shared/components/alert-modal';
import { AlertModalState } from '@services/types';
import { getTimeZoneMoment } from '@utils';

type FormValues = {
    weekDay: string;
    timeSlot: string;
    name?: string;
    gender?: string;
    fromGameLevel?: string;
    toGameLevel?: string;
};

const FindOpponents = () => {
    const dispatch = useAppDispatch();
    const club = useAppSelector((state) => state.club.club!);
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [opponents, setOpponents] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [sendLoading, setSendLoading] = useState<boolean>(false);
    const [isOpenAction, setIsOpenAction] = useState<boolean>(false);
    const [isOpenAlert, setIsOpenAlert] = useState<boolean>(false);
    const [alertData, setAlertData] = useState<AlertModalState>({ message: '' });
    const [selectedOpponent, setSelectedOpponent] = useState<User>();
    const { handleSubmit, control, formState, watch } = useForm<FormValues>({
        defaultValues: {
            weekDay: '',
            timeSlot: '',
            name: '',
            gender: 'all',
            fromGameLevel: '',
            toGameLevel: '',
        },
    });
    const watchFields = watch(['weekDay', 'timeSlot']);

    const getWeekdayOptions = () => {
        return WEEKDAYS.map((x, index) => {
            return { value: String(index), label: x };
        });
    };

    const getAvtTimeslotOptions = () => {
        return (club?.setting?.avtTimeSlots || []).map((x) => {
            return { value: x.name, label: `${x.name} (${x.stTime}~${x.etTime})` };
        });
    };

    const getGenderOptions = () => {
        return [
            { value: 'all', label: 'All' },
            { value: String(GENDER.MALE), label: 'MALE' },
            { value: String(GENDER.FEMALE), label: 'FEMALE' },
        ];
    };

    const findOpponents = async (data: FormValues) => {
        const { gender, name, fromGameLevel, toGameLevel, weekDay, timeSlot } = data;
        setLoading(true);
        try {
            const params = {
                club: club._id,
                gender: gender === 'all' ? undefined : Number(gender),
                name: name || undefined,
                fromGameLevel: fromGameLevel ? Number(fromGameLevel) : undefined,
                toGameLevel: toGameLevel ? Number(toGameLevel) : undefined,
                weekDay: Number(weekDay),
                timeSlot,
            };
            const res = await UserApi.searchOpponents(params);
            setOpponents(res.data);
        } catch (error) {
            dispatch(handleError(error));
        }
        setLoading(false);
    };

    const showAlertModal = (alrtData: AlertModalState) => {
        setIsOpenAlert(true);
        setAlertData(alrtData);
    };

    const toggle = () => {
        setIsOpenAction(!isOpenAction);
    };

    const onSendEmail = async () => {
        showAlertModal({
            type: 'info',
            title: 'Confirm',
            message: 'Do you want to contact with this opponent? \n Are you sure?',
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
                if (!selectedOpponent) return;
                toggle();
                setSendLoading(true);
                try {
                    const params = {
                        opponent: selectedOpponent._id,
                        matchedTimeSlots: getMatchedTimeSlot(),
                    };
                    const { message } = await UserApi.sendOpponentContactEmail(params);
                    dispatch(showAlert({ type: 'success', title: 'Success', message }));
                } catch (error) {
                    dispatch(handleError(error));
                }
                setSendLoading(false);
            },
        });
    };

    const getMatchedTimeSlot = () => {
        let matchAvt = (selectedOpponent!.availability || []).find(
            (x) =>
                x.weekDay === Number(watchFields[0]) &&
                (x.timeSlot === watchFields[1] || x.timeSlot.toLowerCase() === 'any date time')
        );
        return matchAvt
            ? `${matchAvt.timeSlot} on ${getTimeZoneMoment(club.timezone)
                  .startOf('week')
                  .add(matchAvt!.weekDay, 'days')
                  .format('dddd')}`
            : '';
    };

    const BottomActionSheetButtons = () => (
        <View>
            <View style={styles.bottomSheetButtonGroupStyle}>
                <TouchableOpacity style={[styles.bottomSheetButtonStyle, styles.borderBottom]} onPress={onSendEmail}>
                    <Icon name="mail-outline" type={IconType.Ionicons} size={20} color={colors.text} />
                    <CTText
                        color={colors.text}
                        fontFamily={fonts.montserrat.semiBold}
                        style={styles.bottomSheetButtonTextStyle}
                    >
                        Send Email
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

    const renderItem = ({ item }: { item: User; index?: number }) => {
        return (
            <OpponentItem
                opponent={item}
                loading={item._id === selectedOpponent?._id && sendLoading}
                onPress={() => {
                    setSelectedOpponent(item);
                    toggle();
                }}
            />
        );
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
            <View style={getStyle('p-16')}>
                <View style={getStyle(['row', 'mb-8'])}>
                    <CTSelect
                        style={getStyle(['col', 'mr-4'])}
                        name="weekDay"
                        label="Weekday"
                        required
                        options={getWeekdayOptions()}
                        validation={{ control, formState, rules: { required: true } }}
                    />
                    <CTSelect
                        style={getStyle(['col', 'mr-4'])}
                        name="timeSlot"
                        label="Time"
                        required
                        options={getAvtTimeslotOptions()}
                        validation={{ control, formState, rules: { required: true } }}
                    />
                </View>
                <View style={getStyle(['row', 'mb-8'])}>
                    <CTTextInput
                        style={getStyle(['col', 'mr-4'])}
                        name="name"
                        label="Name"
                        validation={{ control, formState, rules: { required: false } }}
                    />
                    <CTSelect
                        style={getStyle(['col', 'mr-4'])}
                        name="gender"
                        label="Gender"
                        options={getGenderOptions()}
                        validation={{ control, formState, rules: { required: false } }}
                    />
                </View>
                <View style={getStyle(['row', 'mb-16'])}>
                    <CTTextInput
                        style={getStyle(['col', 'mr-4'])}
                        name="fromGameLevel"
                        label="From Game Level"
                        validation={{ control, formState, rules: { required: false } }}
                    />
                    <CTTextInput
                        style={getStyle(['col', 'mr-4'])}
                        name="toGameLevel"
                        label="To Game Level"
                        validation={{ control, formState, rules: { required: false } }}
                    />
                </View>
                <CTButton title="Find Opponents" onPress={handleSubmit(findOpponents)} />
            </View>
            <View style={styles.listContainerStyle}>
                <Loading />
                <CTInfiniteFlatlist<User>
                    style={styles.listStyle}
                    renderItem={renderItem}
                    totalCount={opponents.length}
                    data={opponents}
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

export default FindOpponents;
