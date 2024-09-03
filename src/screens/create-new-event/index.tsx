import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Keyboard, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { ClubEventApi, ResourceApi } from '@services/api';
import { handleError, showAlert, showAlertModal } from '@store/actions';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import BackHeader from '@navigation/components/back-header';
import { getStyle } from '@shared/theme/themes';
import { useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CTTextInput from '@shared/components/controls/ct-textinput';
import CTTextArea from '@shared/components/controls/ct-textarea';
import CTButton from '@shared/components/controls/ct-button';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/types';
import CTDatePicker from '@shared/components/controls/ct-date-picker';
import CTSelect from '@shared/components/controls/ct-select';
import CTSwitch from '@shared/components/controls/ct-switch';
import moment from 'moment';
import { CLUBEVENT_REG_RESTRICT_TYPE, CLUB_TYPE, GENDER, VENUE_TYPE } from '@shared/constants';
import CTMultiSelect from '@shared/components/controls/ct-multi-select';
import CTClickableTextInput from '@shared/components/controls/ct-clickable-textinput';
import { CircleMessage, FacilityResource, UserDefinedFacilityResource } from '@services/models';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import CPBottomSheet from '@shared/components/bootom-sheet';
import { isUserDefinedResource } from '@services/helpers/resource';

type FormValues = {
    title: string;
    description: string;
    start: Date;
    end: Date;
    eventType: string;
    otherEventType?: string;
    venue?: string;
    courts?: number[];
    resource?: any;
    eligibleGender: 'male' | 'female' | 'mixed';
    noExpired?: boolean;
    minRegCount?: number;
    maxRegCount?: number;
    canRegMultiWeeks?: boolean;
    maxRegMultiWeeks?: number;
    regRestrictType: CLUBEVENT_REG_RESTRICT_TYPE;
    // isRequireReg: boolean; // this value is require but no need in ui. will be always true in api params
    invitedCircles: string[];
    eligibleLevelFrom?: number;
    eligibleLevelTo?: number;
    isPaidEvent: boolean;
    price?: number;
    isCreateNewCircleMessage: boolean;
    circleMessageContent: string;

    // only ui
    isRestrictedByLevel: boolean;
    repeatWeeks: number;
};

type ScreenProps = StackScreenProps<RootStackParamList, 'CreateNewEvent'>;

const CreateNewEventScreen = ({ route, navigation }: ScreenProps) => {
    const club = useAppSelector((state) => state.club.club!);
    const user = useAppSelector((state) => state.auth.user);
    const myCircles = useAppSelector((state) => state.club.myCircles);
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [circleMessage] = useState<CircleMessage | undefined>(route.params.circleMessage);
    const [selectedResource, setSelectedResource] = useState<
        FacilityResource | UserDefinedFacilityResource | undefined
    >();
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpenResource, setIsOpenResource] = useState(false);

    const { handleSubmit, control, formState, watch, getValues, setValue } = useForm<FormValues>({
        defaultValues: {
            title: '',
            description: '',
            noExpired: false,
            canRegMultiWeeks: true,
            maxRegMultiWeeks: 2,
            regRestrictType: circleMessage
                ? CLUBEVENT_REG_RESTRICT_TYPE.ONLY_CIRCLE_MEMBERS
                : CLUBEVENT_REG_RESTRICT_TYPE.ONLY_CLUB_MEMBERS,
            isPaidEvent: false,
            invitedCircles: circleMessage ? [circleMessage.circle] : [],

            // only ui
            isRestrictedByLevel: false,
            isCreateNewCircleMessage: false,
            circleMessageContent: '',
            repeatWeeks: 1,
        },
    });

    useEffect(() => {
        watch([
            'isRestrictedByLevel',
            'isCreateNewCircleMessage',
            'isPaidEvent',
            'canRegMultiWeeks',
            'noExpired',
            'repeatWeeks',
            'resource',
            'venue',
            'eventType',
            'regRestrictType',
        ]);
        const subscription = watch((value, { name }) => {
            if (name === 'noExpired') {
                if (value.noExpired) setValue('repeatWeeks', 52);
                else setValue('repeatWeeks', 1);
            }
            if (name === 'resource') {
                if (!value.resource) setSelectedResource(undefined);
            }
            if (name === 'venue') setValue('courts', undefined);
            if (name === 'isPaidEvent') {
                if (value.isPaidEvent) {
                    setValue('canRegMultiWeeks', false);
                    setValue('maxRegMultiWeeks', 1);
                }
            }
            if (name === 'regRestrictType') {
                if (value.regRestrictType === CLUBEVENT_REG_RESTRICT_TYPE.ONLY_CLUB_MEMBERS) {
                    setValue('invitedCircles', []);
                    setValue('isCreateNewCircleMessage', false);
                    setValue('circleMessageContent', '');
                }
            }
            if (name === 'isCreateNewCircleMessage' && !value.isCreateNewCircleMessage) {
                setValue('circleMessageContent', '');
            }
        });
        return () => subscription.unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch]);

    const fetchResource = useCallback(async () => {
        try {
            const { data } = await ResourceApi.read({ _id: circleMessage?.referenceResourceId! });
            onSelectedResource(data);
        } catch (error) {
            dispatch(handleError(error));
        }
    }, [circleMessage?.referenceResourceId]);

    useEffect(() => {
        if (circleMessage?.referenceResourceId) fetchResource();
    }, [circleMessage?.referenceResourceId]);

    const onSelectedResource = (resource: FacilityResource | UserDefinedFacilityResource) => {
        setSelectedResource(resource);
        if (isUserDefinedResource(resource)) setValue('resource', `${resource.clubName} ${resource.name}`);
        else setValue('resource', resource ? `${resource?.subClub?.name} ${resource.name}` : undefined);
    };

    const onCreate = async (formData: FormValues) => {
        dispatch(
            showAlertModal({
                type: 'info',
                title: 'Confirm',
                message: 'Would you like to create a event?\nAre you sure?',
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

                    const {
                        isRestrictedByLevel,
                        isPaidEvent,
                        price,
                        eligibleGender,
                        eligibleLevelFrom,
                        eligibleLevelTo,
                        repeatWeeks,
                        minRegCount,
                        maxRegCount,
                        canRegMultiWeeks,
                        maxRegMultiWeeks,
                        resource,
                        eventType,
                        otherEventType,
                        invitedCircles,
                        isCreateNewCircleMessage,
                        circleMessageContent,
                        ...data
                    } = formData;
                    let params: any = {
                        club: club?._id,
                        referenceCircleMessageId: circleMessage?._id,
                        ...data,
                        start: moment(data.start).format('YYYY-MM-DD HH:mm'),
                        end: moment(data.end).format('YYYY-MM-DD HH:mm'),
                        eventType: eventType !== 'other' ? eventType : otherEventType,
                        isRequireReg: true,
                        isRepeat: true,
                        sponsor: user?._id,
                        eligibleGender:
                            eligibleGender === 'male'
                                ? Number(GENDER.MALE)
                                : eligibleGender === 'female'
                                ? Number(GENDER.FEMALE)
                                : undefined,
                        eligibleLevel: isRestrictedByLevel
                            ? { from: Number(eligibleLevelFrom), to: Number(eligibleLevelTo) }
                            : undefined,
                        isFree: !isPaidEvent,
                        price: isPaidEvent ? Number(price) : undefined,
                        repeatWeeks: Number(repeatWeeks),
                        minRegCount: minRegCount ? Number(minRegCount) : undefined,
                        maxRegCount: maxRegCount ? Number(maxRegCount) : undefined,
                        canRegMultiWeeks: !isPaidEvent ? canRegMultiWeeks : false,
                        maxRegMultiWeeks: !isPaidEvent && canRegMultiWeeks ? Number(maxRegMultiWeeks) : undefined,
                    };
                    if (isVirtualClub()) {
                        const fctyResource = selectedResource as any;
                        delete fctyResource.distance;
                        delete fctyResource.location;
                        params = {
                            ...params,
                            resource: fctyResource,
                        };
                    }
                    if (data.regRestrictType === CLUBEVENT_REG_RESTRICT_TYPE.ONLY_CIRCLE_MEMBERS) {
                        params = { ...params, invitedCircles };
                        if (!circleMessage && isCreateNewCircleMessage) {
                            params = { ...params, isCreateNewCircleMessage, circleMessageContent };
                        }
                    }

                    setLoading(true);
                    try {
                        const { message } = await ClubEventApi.create(params);
                        setLoading(false);
                        dispatch(showAlert({ type: 'success', title: 'Success', message }));
                        navigation.goBack();
                    } catch (error) {
                        setLoading(false);
                        dispatch(handleError(error));
                    }
                },
            })
        );
    };

    const toggleOpenResource = () => {
        setIsOpenResource(!isOpenResource);
    };

    const getEventTypeOptions = () => {
        return [
            ...(club?.setting?.eventTypes ?? [])
                .sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))
                .map((type) => {
                    return { value: type, label: type };
                }),
            { value: 'other', label: 'Other' },
        ];
    };

    const getVenueOptions = () => {
        return (club?.venues ?? [])
            .filter((x) => x.type === VENUE_TYPE.REAL)
            .map((x) => {
                return { value: x._id, label: x.displayName };
            });
    };

    const getCourtsOptions = () => {
        if (!getValues().venue) return [];
        const venue = (club?.venues ?? []).find((x) => x._id === getValues().venue);
        if (!venue) return [];
        return (venue.setting?.curtActivatedCourts ?? []).map((x) => {
            return { value: `${x}`, label: `${venue.courtDisplayName} ${x + 1}` };
        });
    };

    const getInvitedCirclesOptions = () => {
        return myCircles.map((x) => {
            return { value: x._id, label: x.name };
        });
    };

    const getGenderOptions = () => {
        return [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'mixed', label: 'Mixed' },
        ];
    };

    const getEligibleMemberGroupOptions = () => {
        return [
            { value: CLUBEVENT_REG_RESTRICT_TYPE.ONLY_CLUB_MEMBERS, label: 'Only Club Members' },
            { value: CLUBEVENT_REG_RESTRICT_TYPE.ONLY_CIRCLE_MEMBERS, label: 'Only Circle Members' },
        ];
    };

    const isVirtualClub = () => {
        return club.type === CLUB_TYPE.VIRTUAL;
    };

    const BottomActionSheetButtons = () => (
        <View>
            <View style={styles.bottomSheetButtonGroupStyle}>
                <TouchableOpacity
                    style={[styles.bottomSheetButtonStyle, styles.borderBottomStyle]}
                    onPress={() => {
                        toggleOpenResource();
                        navigation.navigate('SearchResources', {
                            callback: onSelectedResource,
                        });
                    }}
                >
                    <Icon name="search-outline" type={IconType.Ionicons} size={20} color={colors.primary} />
                    <CTText
                        color={colors.primary}
                        fontFamily={fonts.montserrat.semiBold}
                        style={styles.bottomSheetButtonTextStyle}
                    >
                        Search Resource
                    </CTText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.bottomSheetButtonStyle, styles.borderBottomStyle]}
                    onPress={() => {
                        toggleOpenResource();
                        navigation.navigate('AddResource', {
                            callback: onSelectedResource,
                        });
                    }}
                >
                    <Icon name="add-outline" type={IconType.Ionicons} size={20} color={colors.primary} />
                    <CTText
                        color={colors.primary}
                        fontFamily={fonts.montserrat.semiBold}
                        style={styles.bottomSheetButtonTextStyle}
                    >
                        Add Resource
                    </CTText>
                </TouchableOpacity>
            </View>
            <View style={styles.buttomSheetCancelButtonContainer}>
                <TouchableOpacity style={styles.bottomSheetCancelButtonStyle} onPress={toggleOpenResource}>
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
            <BackHeader title="Create New Event" style={styles.headerStyle} />
            <KeyboardAwareScrollView>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.contentContainerStyle}>
                        <CTTextInput
                            style={getStyle('mb-8')}
                            name="title"
                            label="Title"
                            placeholder="Tennis single game"
                            required
                            validation={{ control, formState, rules: { required: true } }}
                        />
                        <CTTextArea
                            style={getStyle('mb-8')}
                            name="description"
                            label="Description"
                            placeholder="Description Here"
                            required
                            validation={{ control, formState, rules: { required: true } }}
                        />
                        <CTDatePicker
                            style={getStyle('mb-8')}
                            name="start"
                            label="Start Date Time"
                            mode="datetime"
                            dateFormat="DD MMMM, YYYY, h:mm A"
                            required
                            validation={{ control, formState, rules: { required: true } }}
                        />
                        <CTDatePicker
                            style={getStyle('mb-8')}
                            name="end"
                            label="End Date Time"
                            mode="datetime"
                            dateFormat="DD MMMM, YYYY, h:mm A"
                            required
                            validation={{ control, formState, rules: { required: true } }}
                        />
                        <CTSelect
                            style={getStyle('mb-8')}
                            name="eventType"
                            label="Event Type"
                            options={getEventTypeOptions()}
                            required
                            validation={{ control, formState, rules: { required: true } }}
                        />
                        {getValues().eventType === 'other' && (
                            <CTTextInput
                                style={getStyle('mb-8')}
                                name="otherEventType"
                                label="Please Input Event type"
                                placeholder="Social Event"
                                required
                                validation={{ control, formState, rules: { required: true } }}
                            />
                        )}
                        {isVirtualClub() ? (
                            <CTClickableTextInput
                                style={getStyle('mb-8')}
                                name="resource"
                                label="Resource"
                                required
                                clearable
                                onPress={toggleOpenResource}
                                validation={{ control, formState, rules: { required: true } }}
                            />
                        ) : (
                            <>
                                <CTSelect
                                    style={getStyle('mb-8')}
                                    name="venue"
                                    label="Venue"
                                    clearable
                                    options={getVenueOptions()}
                                    validation={{ control, formState, rules: { required: false } }}
                                />
                                {getValues().venue && (
                                    <CTMultiSelect
                                        style={getStyle('mb-8')}
                                        name="courts"
                                        label="Courts"
                                        options={getCourtsOptions()}
                                        required
                                        validation={{ control, formState, rules: { required: true } }}
                                    />
                                )}
                            </>
                        )}
                        <CTSelect
                            style={getStyle('mb-8')}
                            name="regRestrictType"
                            label="Eligible Member Group"
                            options={getEligibleMemberGroupOptions()}
                            required
                            validation={{ control, formState, rules: { required: true } }}
                        />
                        {getValues().regRestrictType === CLUBEVENT_REG_RESTRICT_TYPE.ONLY_CIRCLE_MEMBERS && (
                            <CTMultiSelect
                                style={getStyle('mb-8')}
                                name="invitedCircles"
                                label="Invited Circles"
                                options={getInvitedCirclesOptions()}
                                required
                                validation={{ control, formState, rules: { required: true } }}
                            />
                        )}
                        <CTSelect
                            style={getStyle('mb-8')}
                            name="eligibleGender"
                            label="Eligible Gender"
                            options={getGenderOptions()}
                            clearable
                            validation={{ control, formState, rules: { required: false } }}
                        />
                        <CTSwitch
                            name="isRestrictedByLevel"
                            label="Is restricted by game level of members?"
                            style={[getStyle(['mb-16', 'mt-8'])]}
                            validation={{ control, formState, rules: { required: false } }}
                        />
                        {getValues().isRestrictedByLevel && (
                            <View style={getStyle('mb-8')}>
                                <CTText
                                    style={getStyle(['mr-4', 'mb-4'])}
                                    size={10}
                                    fontFamily={fonts.montserrat.regular}
                                >
                                    Eligible Game Level
                                    <CTText color={colors.danger} size={12}>
                                        &nbsp;*
                                    </CTText>
                                </CTText>
                                <View style={getStyle('row')}>
                                    <CTTextInput
                                        style={getStyle(['col', 'mr-8'])}
                                        name="eligibleLevelFrom"
                                        placeholder="3.5"
                                        required
                                        keyboardType="numeric"
                                        validation={{ control, formState, rules: { required: true } }}
                                    />
                                    <CTTextInput
                                        style={getStyle('col')}
                                        name="eligibleLevelTo"
                                        placeholder="5.0"
                                        required
                                        keyboardType="numeric"
                                        validation={{ control, formState, rules: { required: true } }}
                                    />
                                </View>
                            </View>
                        )}
                        <CTSwitch
                            name="isPaidEvent"
                            label="Is required to charge to register?"
                            style={[getStyle(['mb-16', 'mt-8'])]}
                            validation={{ control, formState, rules: { required: false } }}
                        />
                        {getValues().isPaidEvent && (
                            <CTTextInput
                                style={getStyle('mb-8')}
                                name="price"
                                label="Price ($)"
                                placeholder="10"
                                required
                                keyboardType="numeric"
                                validation={{ control, formState, rules: { required: true } }}
                            />
                        )}
                        <View style={getStyle(['row', 'align-items-center', 'mb-8'])}>
                            <CTTextInput
                                style={getStyle(['col', 'mr-4'])}
                                name="minRegCount"
                                label="Minimum Attendees "
                                placeholder="5"
                                keyboardType="number-pad"
                                validation={{ control, formState, rules: { required: false } }}
                            />
                            <CTTextInput
                                style={getStyle(['col', 'ml-4'])}
                                name="maxRegCount"
                                label="Maximum Attendees "
                                placeholder="20"
                                keyboardType="number-pad"
                                validation={{ control, formState, rules: { required: false } }}
                            />
                        </View>
                        <CTSwitch
                            name="noExpired"
                            label="Continue Event Every Week? (52 weeks)"
                            style={[getStyle(['mb-16', 'mt-8'])]}
                            validation={{ control, formState, rules: { required: false } }}
                        />
                        {!getValues().noExpired && (
                            <CTTextInput
                                style={getStyle('mb-8')}
                                name="repeatWeeks"
                                label="How many weeks do you want to repeat?"
                                placeholder="2"
                                required
                                keyboardType="numeric"
                                validation={{ control, formState, rules: { required: true } }}
                            />
                        )}
                        {!getValues().isPaidEvent && getValues().repeatWeeks > 1 && (
                            <>
                                <CTSwitch
                                    name="canRegMultiWeeks"
                                    label="The members can sign up for multiple weeks?"
                                    style={[getStyle(['mb-16', 'mt-8'])]}
                                    validation={{ control, formState, rules: { required: false } }}
                                />
                                {getValues().canRegMultiWeeks && (
                                    <CTTextInput
                                        style={getStyle('mb-8')}
                                        name="maxRegMultiWeeks"
                                        label="How many weeks in advance?"
                                        placeholder="2"
                                        required
                                        keyboardType="numeric"
                                        validation={{ control, formState, rules: { required: true } }}
                                    />
                                )}
                            </>
                        )}
                        {getValues().regRestrictType === CLUBEVENT_REG_RESTRICT_TYPE.ONLY_CIRCLE_MEMBERS &&
                            !circleMessage && (
                                <>
                                    <CTSwitch
                                        name="isCreateNewCircleMessage"
                                        label="Would you like to notify circle members through a circle message?"
                                        style={[getStyle(['mb-16', 'mt-8'])]}
                                        validation={{ control, formState, rules: { required: false } }}
                                    />
                                    {getValues().isCreateNewCircleMessage && (
                                        <CTTextArea
                                            style={getStyle('mb-8')}
                                            name="circleMessageContent"
                                            label="Circle Message"
                                            placeholder="Message Here"
                                            required
                                            validation={{ control, formState, rules: { required: true } }}
                                        />
                                    )}
                                </>
                            )}
                        <CTButton loading={loading} onPress={handleSubmit(onCreate)} style={getStyle('my-32')}>
                            <CTText fontFamily={fonts.montserrat.regular} bold color={colors.white} center>
                                Create
                            </CTText>
                        </CTButton>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
            <CPBottomSheet
                isVisible={isOpenResource}
                toggle={toggleOpenResource}
                style={styles.bottomSheetStyle}
                isHideButton={false}
            >
                <BottomActionSheetButtons />
            </CPBottomSheet>
        </View>
    );
};

export default CreateNewEventScreen;
