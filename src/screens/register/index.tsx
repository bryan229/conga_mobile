import React, { useMemo, useState } from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { UserApi } from '@services/api';
import { handleError, putUserCredential } from '@store/actions';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import BackHeader from '@navigation/components/back-header';
import { getStyle } from '@shared/theme/themes';
import { useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CTTextInput from '@shared/components/controls/ct-textinput';
import CTButton from '@shared/components/controls/ct-button';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/types';
import CTSelect from '@shared/components/controls/ct-select';
import { GENDER } from '@shared/constants';

type FormValues = {
    club: string;
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
    phoneNumber: string;
};

type ScreenProps = StackScreenProps<RootStackParamList, 'Register'>;

const RegisterScreen = ({ route, navigation }: ScreenProps) => {
    const clubs = useAppSelector((state) => state.club.clubs);
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [loading, setLoading] = useState<boolean>(false);
    const club = route.params?.club;

    const { handleSubmit, control, formState } = useForm<FormValues>({
        defaultValues: {
            club: club?._id,
            firstName: '',
            lastName: '',
            gender: String(GENDER.NOPREFER),
            email: '',
            phoneNumber: '',
        },
    });

    const onSave = async (value: FormValues) => {
        try {
            setLoading(true);
            const { user } = await UserApi.signUp({ ...value, isMobileSignUp: true });
            dispatch(putUserCredential(value.email?.toLowerCase()));
            setLoading(false);
            if (user.isActivated) {
                navigation.goBack();
            } else navigation.replace('Verify', { user, club: club! });
        } catch (error) {
            setLoading(false);
            dispatch(handleError(error));
        }
    };

    const getGenderOptions = () => {
        return [
            { value: String(GENDER.MALE), label: 'MALE' },
            { value: String(GENDER.FEMALE), label: 'FEMALE' },
            { value: String(GENDER.NOPREFER), label: 'NOPREFER' },
        ];
    };

    const getClubOptions = () => {
        return clubs.map((x) => {
            return { value: x._id, label: x.displayName };
        });
    };

    if (!club) return null;

    return (
        <View style={styles.containerStyle}>
            <BackHeader title="Register" style={styles.headerStyle} />
            <KeyboardAwareScrollView>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.contentContainerStyle}>
                        <CTSelect
                            style={getStyle('mb-8')}
                            name="club"
                            label="Club"
                            options={getClubOptions()}
                            required
                            disabled
                            validation={{ control, formState, rules: { required: true } }}
                        />
                        <CTTextInput
                            style={getStyle('mb-8')}
                            name="firstName"
                            label="First Name"
                            placeholder="John"
                            required
                            validation={{ control, formState, rules: { required: true } }}
                        />
                        <CTTextInput
                            style={getStyle('mb-8')}
                            name="lastName"
                            label="Last Name"
                            placeholder="Michael"
                            required
                            validation={{ control, formState, rules: { required: true } }}
                        />
                        <CTTextInput
                            style={getStyle('mb-8')}
                            name="email"
                            keyboardType="email-address"
                            label={
                                <CTText fontFamily={fonts.montserrat.regular} size={10} style={getStyle('mb-4')}>
                                    Email
                                    <CTText color={colors.danger} size={12}>
                                        &nbsp;*
                                    </CTText>
                                    <CTText fontFamily={fonts.montserrat.regular} size={8} color={colors.danger}>
                                        (If you are already a member of CongaClubLives, we recommend to use the same email)
                                    </CTText>
                                </CTText>
                            }
                            placeholder="john@mail.com"
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
                            style={getStyle('mb-8')}
                            name="phoneNumber"
                            label="Phone Number"
                            placeholder="4568484383"
                            keyboardType="phone-pad"
                            required
                            validation={{ control, formState, rules: { required: true } }}
                        />
                        <CTSelect
                            style={getStyle('mb-8')}
                            name="gender"
                            label="Gender"
                            options={getGenderOptions()}
                            required
                            validation={{ control, formState, rules: { required: true } }}
                        />
                        <CTButton loading={loading} onPress={handleSubmit(onSave)} style={getStyle('my-32')}>
                            <CTText fontFamily={fonts.montserrat.regular} bold color={colors.white} center>
                                Register
                            </CTText>
                        </CTButton>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
        </View>
    );
};

export default RegisterScreen;
