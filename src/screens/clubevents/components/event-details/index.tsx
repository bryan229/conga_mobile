import React, { useMemo, useState } from 'react';
import { ClubEvent } from '@services/models';
import { Keyboard, LayoutChangeEvent, TouchableWithoutFeedback, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import CPAnimateButtonGroup from '@shared/components/button-animate-group';
import CTTextInput from '@shared/components/controls/ct-textinput';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@store/hook';
import CTButton from '@shared/components/controls/ct-button';
import CPAlertModal from '@shared/components/alert-modal';
import { AlertModalState } from '@services/types';
import { handleError, showAlert } from '@store/actions/ui';
import { ScreenWidth } from '@freakycoder/react-native-helpers';
import EventDetails from './Details';
import Attendees from './Attendees';
import {
    canEventAddGuest,
    canEventRegMultiWeeks,
    canRegForEvent,
    getEventMaxRegWeeks,
    getTotalRegUserCount,
    isEventFull,
    isMemberOfCircle,
    isOnlyCircleEvent,
    isSponsor,
} from '@services/helpers/clubevent';
import { ClubEventApi } from '@services/api';
import moment from 'moment';
import EmergencyModal from './EmergencyModal';
import { useAppNavigation } from '@services/hooks/useNavigation';
import SendCircleMsgModal from './SendCircleMsgModal';
import { CLUBEVENT_CREATE_BY } from '@shared/constants';

interface Props {
    event?: ClubEvent;
    callBack: () => void;
    toggle?: () => void;
    showCircleMsgOption?: boolean;
}

type FormValues = {
    repeatWeeks: string;
    guests: string;
};

const ClubEventDetails = ({ event, callBack, toggle, showCircleMsgOption = true }: Props) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const navigation = useAppNavigation();
    const { colors, getStyle } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const user = useAppSelector((state) => state.auth.user);
    const myClubs = useAppSelector((state) => state.club.myClubs);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<string>('Details');
    const [sheetHeight, setSheetHeight] = useState<number>(200);
    const [isOpenAlert, setIsOpenAlert] = useState<boolean>(false);
    const [alertData, setAlertData] = useState<AlertModalState>({ message: '' });
    const [isOpenEmergency, setIsOpenEmergency] = useState<boolean>(false);
    const [isOpenCircleMsg, setIsOpenCircleMsg] = useState<boolean>(false);

    const { handleSubmit, control, formState, watch } = useForm<FormValues>({
        defaultValues: {
            repeatWeeks: String(getEventMaxRegWeeks(event!)),
            guests: '0',
        },
    });
    const watchFields = watch(['repeatWeeks', 'guests']);

    const hasDiscount = () => {
        return myClubs.some((x) => x._id === event?.club._id) && !event?.isFree && event?.price && event?.discount;
    };

    if (!event) return null;

    const onSubmit = async (data: FormValues) => {
        const { guests } = data;
        if (
            event.maxRegCount &&
            event.maxRegCount < getTotalRegUserCount(event) + 1 + (canEventAddGuest(event) ? Number(guests ?? 0) : 0)
        ) {
            dispatch(
                showAlert({
                    type: 'warning',
                    title: 'Warning',
                    message: 'Attendees are overflow. Please consider count of guests.',
                })
            );
            return;
        }
        register(data);
    };

    const register = async (data: FormValues) => {
        const { repeatWeeks, guests } = data;
        const params: any = {
            _id: event?._id,
            user: user?._id,
            repeatWeeks: event.canRegMultiWeeks ? Number(repeatWeeks) : undefined,
            guests: canEventAddGuest(event) ? Number(guests) : undefined,
        };
        setLoading(true);
        try {
            const { message, sessionId } = await ClubEventApi.regUser(params);
            if (sessionId) {
                navigation.navigate('StripeCheckout', { sessionId });
                toggle?.();
            } else {
                dispatch(showAlert({ type: 'success', title: 'Success', message: message }));
                callBack();
            }
        } catch (error) {
            dispatch(handleError(error));
        }
        setLoading(false);
    };

    const unRegister = (data: FormValues) => {
        const { repeatWeeks } = data;
        showAlertModal({
            type: 'warning',
            title: 'Cancel Registration For Event',
            message: 'Do you want to cancel registration for event? \n Are you sure?',
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
                // we should find correct user id because Conga club member account is used for the public event. (conga case)
                const eventUser = event.regUsers.map((x) => x.user).find((x) => x.email === user?.email);
                if (!eventUser) return;
                const params = {
                    _id: event._id,
                    user: eventUser?._id,
                    repeatWeeks: canEventRegMultiWeeks(event) ? Number(repeatWeeks || '1') : undefined,
                };
                setLoading(true);
                try {
                    await ClubEventApi.unRegUser(params);
                    callBack();
                } catch (error) {
                    dispatch(handleError(error));
                }
                setLoading(false);
            },
        });
    };

    const onEditEvent = () => {
        toggle?.();
        navigation.navigate('EditClubEvent', { eventId: event._id });
    };

    const showAlertModal = (alrtData: AlertModalState) => {
        setIsOpenAlert(true);
        setAlertData(alrtData);
    };

    const regPrice = () => {
        if (event.isFree ?? true) return 0;
        return (event.price ?? 0) - (hasDiscount() ? (event.price ?? 0) * (event.discount ?? 0) : 0);
    };

    const RegButtonControls = () => (
        <View style={getStyle(['mt-16'])}>
            <CTButton
                loading={loading}
                style={getStyle(['mb-8'])}
                color={canRegForEvent(event, user!) ? colors.primary : colors.secondary}
                onPress={canRegForEvent(event, user!) ? handleSubmit(onSubmit) : handleSubmit(unRegister)}
            >
                <CTText fontFamily={fonts.montserrat.regular} color={colors.white} bold center>
                    {canRegForEvent(event, user!)
                        ? event.isFree ?? true
                            ? 'Register'
                            : `Register And Pay $${regPrice()}`
                        : 'Unregister'}
                </CTText>
            </CTButton>
            {showCircleMsgOption && isOnlyCircleEvent(event) && isMemberOfCircle(event.invitedCircles ?? []) && (
                <CTButton
                    onPress={() => setIsOpenCircleMsg(true)}
                    color={colors.dynamicWhite}
                    borderColor={colors.primary}
                >
                    <CTText fontFamily={fonts.montserrat.regular} color={colors.primary} bold center>
                        Message To Circle Members
                    </CTText>
                </CTButton>
            )}
        </View>
    );

    const SponsorButtonControls = () => (
        <View style={getStyle('mt-16')}>
            {event.createdBy === CLUBEVENT_CREATE_BY.USER && (
                <View style={getStyle(['row', 'align-items-center', 'mb-8'])}>
                    {event.isRequireReg &&
                        !isEventFull(event) &&
                        (!isOnlyCircleEvent(event) || isMemberOfCircle(event.invitedCircles ?? [])) && (
                            <CTButton
                                loading={loading}
                                style={[getStyle(['col', 'mr-8'])]}
                                color={!canRegForEvent(event, user!) ? colors.secondary : colors.primary}
                                onPress={
                                    canRegForEvent(event, user!) ? handleSubmit(onSubmit) : handleSubmit(unRegister)
                                }
                            >
                                <CTText fontFamily={fonts.montserrat.regular} color={colors.white} bold center>
                                    {canRegForEvent(event, user!)
                                        ? event.isFree ?? true
                                            ? 'Register'
                                            : `Register And Pay $${regPrice()}`
                                        : 'Unregister'}
                                </CTText>
                            </CTButton>
                        )}
                    <CTButton style={getStyle(['col'])} onPress={onEditEvent}>
                        <CTText center fontFamily={fonts.montserrat.regular} color={colors.white} bold>
                            Edit
                        </CTText>
                    </CTButton>
                </View>
            )}

            <View style={getStyle(['row', 'align-items-center'])}>
                <CTButton
                    color={colors.dynamicWhite}
                    borderColor={colors.secondary}
                    style={getStyle(['col', 'mr-8'])}
                    onPress={() => setIsOpenEmergency(true)}
                >
                    <CTText center fontFamily={fonts.montserrat.regular} color={colors.secondary} bold>
                        Emergency
                    </CTText>
                </CTButton>
                {isOnlyCircleEvent(event) && isMemberOfCircle(event.invitedCircles ?? []) && (
                    <CTButton
                        style={getStyle(['col'])}
                        color={colors.dynamicWhite}
                        borderColor={colors.primary}
                        onPress={() => setIsOpenCircleMsg(true)}
                    >
                        <CTText center fontFamily={fonts.montserrat.regular} color={colors.primary} bold>
                            Send Circle Message
                        </CTText>
                    </CTButton>
                )}
            </View>
        </View>
    );

    return (
        <View>
            {(event.regUsers || []).length > 0 && (
                <CPAnimateButtonGroup
                    buttons={['Details', 'Attendees']}
                    onSelect={setActiveTab}
                    width={ScreenWidth - 34}
                    activeBtn={activeTab}
                    style={styles.buttonGroupStyle}
                />
            )}
            {activeTab === 'Details' && (
                <KeyboardAwareScrollView style={styles.containerStyle}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View
                            onLayout={(layoutEvent: LayoutChangeEvent) => {
                                setSheetHeight(layoutEvent.nativeEvent.layout.height);
                            }}
                        >
                            <EventDetails event={event} />
                            {isSponsor(event, user!) ? (
                                <SponsorButtonControls />
                            ) : (
                                <>
                                    {canRegForEvent(event, user!) && canEventAddGuest(event) && (
                                        <CTTextInput
                                            style={getStyle('mt-8')}
                                            name="guests"
                                            label="Besides yourself, how many guests are you planning to invite?"
                                            placeholder="0"
                                            keyboardType="number-pad"
                                            validation={{ control, formState, rules: { required: false } }}
                                        />
                                    )}
                                    {canEventRegMultiWeeks(event) && (
                                        <>
                                            <CTTextInput
                                                style={getStyle('mt-8')}
                                                name="repeatWeeks"
                                                label={
                                                    canRegForEvent(event, user!)
                                                        ? `How many weeks will you attend in the future? (Max: ${getEventMaxRegWeeks(
                                                              event
                                                          )})`
                                                        : 'How many weeks will you unregister in the future?'
                                                }
                                                placeholder="1"
                                                keyboardType="number-pad"
                                                required={canRegForEvent(event, user!)}
                                                validation={{
                                                    control,
                                                    formState,
                                                    rules: { required: true, max: getEventMaxRegWeeks(event) },
                                                }}
                                            />
                                            {canRegForEvent(event, user!) && (
                                                <CTText size={8} color={colors.primary}>
                                                    You can attend at this event from{' '}
                                                    {moment(event.start).format('MMM DD, YYYY')} to{' '}
                                                    {moment(event.start)
                                                        .add(Number(watchFields[0]) - 1, 'weeks')
                                                        .format('MMM DD, YYYY')}
                                                </CTText>
                                            )}
                                        </>
                                    )}
                                    {event.isRequireReg && !isEventFull(event) && <RegButtonControls />}
                                </>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAwareScrollView>
            )}
            {activeTab === 'Attendees' && <Attendees event={event} height={sheetHeight} />}
            <CPAlertModal isVisible={isOpenAlert} toggle={() => setIsOpenAlert(false)} alertData={alertData} />
            <EmergencyModal isOpen={isOpenEmergency} toggle={() => setIsOpenEmergency(false)} event={event} />
            <SendCircleMsgModal isOpen={isOpenCircleMsg} toggle={() => setIsOpenCircleMsg(false)} event={event} />
        </View>
    );
};

export default ClubEventDetails;
