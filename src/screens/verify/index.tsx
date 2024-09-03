import React, { useMemo, useState } from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import { useAppDispatch } from '@store/hook';
import { handleError, showAlert } from '@store/actions';
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
import { UserApi } from '@services/api';

type FormValues = {
    code: string;
};

type ScreenProps = StackScreenProps<RootStackParamList, 'Verify'>;

const VerifyScreen = ({ route, navigation }: ScreenProps) => {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { user, club } = route.params;
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [loading, setLoading] = useState<boolean>(false);

    const { handleSubmit, control, formState } = useForm<FormValues>({
        defaultValues: {
            code: '',
        },
    });

    const onSubmit = async (value: FormValues) => {
        try {
            setLoading(true);
            const params = {
                userId: user._id,
                token: value.code,
                codeType: 'code',
            };
            await UserApi.verify(params);
            setLoading(false);
            dispatch(showAlert({ type: 'success', title: 'Success', message: 'Account has been activated.' }));
            navigation.reset({ index: 0, routes: [{ name: 'Init' }] });
        } catch (error) {
            setLoading(false);
            dispatch(handleError(error));
        }
    };

    if (!user || !club) return null;

    return (
        <View style={styles.containerStyle}>
            <BackHeader title="Verify Account" style={styles.headerStyle} />
            <KeyboardAwareScrollView>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.contentContainerStyle}>
                        <CTText
                            fontFamily={fonts.montserrat.regular}
                            center
                            style={getStyle(['mt-32', 'mb-16'])}
                            color={colors.text}
                        >
                            Please check your email{' '}
                            <CTText bold color={colors.text}>
                                ({user.email})
                            </CTText>{' '}
                            to get verification code
                        </CTText>
                        <CTTextInput
                            style={getStyle('mb-8')}
                            name="code"
                            label="Verification Code"
                            placeholder="3874"
                            required
                            validation={{ control, formState, rules: { required: true } }}
                        />
                        <CTButton loading={loading} onPress={handleSubmit(onSubmit)} style={getStyle('my-16')}>
                            <CTText fontFamily={fonts.montserrat.regular} bold color={colors.white} center>
                                Submit
                            </CTText>
                        </CTButton>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
        </View>
    );
};

export default VerifyScreen;
