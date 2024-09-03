import React, { useMemo } from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import createStyles from './style';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTheme } from '@services/hooks/useTheme';
import CTTextInput from '@shared/components/controls/ct-textinput';
import CPCircleControls from '@shared/components/circle-controls';
import CTCircleButton from '@shared/components/controls/ct-circle-icon-button';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import CTSelect from '@shared/components/controls/ct-select';
import { updateUser } from '@store/actions';
import { TouchableOpacity } from 'react-native';
import CTText from '@shared/components/controls/ct-text';
import ImagePicker from 'react-native-image-crop-picker';
import { CLUB_TYPE, GENDER, LEVEL_TYPE, VERSION_NUMBER } from '@shared/constants';
import { handleError, setLoading } from '@store/actions/ui';
import CPAvatar from '@shared/components/avatar';
import { getStyle } from '@shared/theme/themes';
import CTSwitch from '@shared/components/controls/ct-switch';
import { getActiveVenues } from '@services/helpers/club';
import { useAppNavigation } from '@services/hooks/useNavigation';

type FormValues = {
    firstName: string;
    lastName: string;
    gender: string;
    birthYear: string;
    email: string;
    phoneNumber?: string;
    zipCode: string;
    preferredVenue?: string;
    gameLevel: string;
    levelType: string;
    isRecevieNotification: boolean;
};

const Profile = () => {
    const dispatch = useAppDispatch();
    const navigation = useAppNavigation();
    const user = useAppSelector((state) => state.auth.user);
    const club = useAppSelector((state) => state.club.club);
    const token = useAppSelector((state) => state.auth.token);
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const { handleSubmit, control, formState } = useForm<FormValues>({
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            gender: String(user?.gender),
            birthYear: String(user?.birthYear ?? ''),
            email: user?.email || '',
            phoneNumber: user?.phoneNumber || '',
            zipCode: user?.zipCode || '',
            preferredVenue: user?.preferredVenue,
            gameLevel: user?.gameLevel ? String(user?.gameLevel) : '',
            levelType: String(user?.levelType),
            isRecevieNotification: user?.isRecevieNotification,
        },
    });

    const onSave = (data: FormValues) => {
        const { gameLevel, gender, birthYear, levelType, preferredVenue, ...profileData } = data;
        let params: any = {
            ...profileData,
            _id: user?._id,
            gender: Number(gender),
            birthYear: String(birthYear),
            levelType: Number(levelType),
            gameLevel: Number(gameLevel),
        };
        if (preferredVenue) params.preferredVenue = preferredVenue;

        dispatch(updateUser(params));
        navigation.pop();
    };

    const getGenderOptions = () => {
        return [
            { value: String(GENDER.MALE), label: 'MALE' },
            { value: String(GENDER.FEMALE), label: 'FEMALE' },
            { value: String(GENDER.NOPREFER), label: 'NOPREFER' },
        ];
    };

    const getGameLevelTypeOptions = () => {
        return [
            { value: String(LEVEL_TYPE.UTR), label: 'UTR' },
            { value: String(LEVEL_TYPE.USTA), label: 'USTA' },
            { value: String(LEVEL_TYPE.SELF), label: 'SELF' },
            { value: String(LEVEL_TYPE.PRO), label: 'PRO' },
        ];
    };

    const getVenueOptions = () => {
        return getActiveVenues(club!).map((x) => {
            return { value: x._id, label: x.displayName };
        });
    };

    const onCapturePhoto = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
        }).then((image) => {
            dispatch(setLoading(true));
            const formData = new FormData();
            formData.append('file', {
                uri: image.path,
                type: image.mime,
                name: `profile_${new Date().getTime()}.jpg`,
            });
            formData.append('type', 'profile');
            fetch(`${process.env.SERVER_URL}/api/upload/general`, {
                method: 'POST',
                headers: new Headers({
                    authorization: token || '',
                    'Content-Type': 'multipart/form-data',
                    versionNumber: `${VERSION_NUMBER}`,
                }),
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    const params = {
                        _id: user?._id,
                        photoUrl: data.data,
                    };
                    dispatch(updateUser(params));
                })
                .catch((error) => {
                    dispatch(setLoading(false));
                    dispatch(handleError(error));
                });
        });
    };

    const CircleButtons = () => (
        <CPCircleControls style={styles.saveButtonStyle}>
            <CTCircleButton color={colors.secondary} size={60} onPress={handleSubmit(onSave)}>
                <Icon name="save-outline" type={IconType.Ionicons} color={colors.dynamicWhite} />
            </CTCircleButton>
        </CPCircleControls>
    );

    const isVirtualClub = () => {
        return club?.type === CLUB_TYPE.VIRTUAL;
    };

    return (
        <View style={styles.containerStyle}>
            <CircleButtons />
            <KeyboardAwareScrollView>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={getStyle('mb-40')}>
                        <View style={styles.photoContainerStyle}>
                            <CPAvatar source={user?.photoUrl} name={user?.fullName} size={80} />
                            <TouchableOpacity onPress={onCapturePhoto} style={getStyle('ml-8')}>
                                <Icon
                                    name="camera-outline"
                                    type={IconType.Ionicons}
                                    color={colors.iconPrimary}
                                    size={35}
                                />
                                <CTText color={colors.iconPrimary} style={styles.cameraTextStyle}>
                                    Change
                                </CTText>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.contentContainerStyle}>
                            <CTTextInput
                                style={styles.controlStyle}
                                name="firstName"
                                label="First Name"
                                placeholder="John"
                                required
                                validation={{ control, formState, rules: { required: true } }}
                            />
                            <CTTextInput
                                style={styles.controlStyle}
                                name="lastName"
                                label="Last Name"
                                placeholder="Michael"
                                required
                                validation={{ control, formState, rules: { required: true } }}
                            />
                            <CTTextInput
                                style={styles.controlStyle}
                                name="email"
                                label="Email Address"
                                placeholder="john@mail.com"
                                keyboardType="email-address"
                                required
                                validation={{
                                    control,
                                    formState,
                                    rules: {
                                        required: true,
                                        pattern:
                                            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                    },
                                }}
                            />
                            <CTTextInput
                                style={styles.controlStyle}
                                name="phoneNumber"
                                label="Phone Number"
                                placeholder="85632147568"
                                keyboardType="number-pad"
                                validation={{ control, formState, rules: { required: false } }}
                            />
                            <CTSelect
                                style={styles.controlStyle}
                                name="gender"
                                label="Gender"
                                options={getGenderOptions()}
                                required
                                validation={{ control, formState, rules: { required: true } }}
                            />
                            <CTTextInput
                                style={styles.controlStyle}
                                name="birthYear"
                                label="Birth Year"
                                placeholder="1986"
                                keyboardType="number-pad"
                                required
                                validation={{ control, formState, rules: { required: true } }}
                            />
                            {!isVirtualClub() && (
                                <CTTextInput
                                    style={styles.controlStyle}
                                    label="Status"
                                    readOnly
                                    placeholder="---"
                                    value={user?.memberType?.name || ''}
                                />
                            )}
                            <CTTextInput
                                style={styles.controlStyle}
                                name="zipCode"
                                label="Zip Code"
                                placeholder="94129"
                                required
                                validation={{ control, formState, rules: { required: true } }}
                            />
                            <View style={styles.rowContainerStyle}>
                                <View style={[styles.colContainerStyle, getStyle('mr-4')]}>
                                    <CTTextInput
                                        style={styles.controlStyle}
                                        name="gameLevel"
                                        label="Game Level"
                                        placeholder="5"
                                        required
                                        keyboardType="decimal-pad"
                                        validation={{ control, formState, rules: { required: true } }}
                                    />
                                </View>
                                <View style={[styles.colContainerStyle, getStyle('ml-4')]}>
                                    <CTSelect
                                        style={styles.controlStyle}
                                        name="levelType"
                                        label=" "
                                        options={getGameLevelTypeOptions()}
                                        validation={{ control, formState, rules: { required: true } }}
                                    />
                                </View>
                            </View>
                            <CTSwitch
                                name="isRecevieNotification"
                                label="Do you want receive a notification?"
                                style={[styles.controlStyle, getStyle(['mb-16', 'mt-16'])]}
                                validation={{ control, formState, rules: { required: false } }}
                            />
                            {!isVirtualClub() && (
                                <CTSelect
                                    style={[styles.controlStyle, getStyle('mb-16')]}
                                    name="preferredVenue"
                                    label="Preferred Venue"
                                    options={getVenueOptions()}
                                    validation={{ control, formState, rules: { required: false } }}
                                />
                            )}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
        </View>
    );
};

export default Profile;
