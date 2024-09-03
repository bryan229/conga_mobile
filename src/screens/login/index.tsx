import React, { useEffect, useMemo, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import createStyles from './style';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import CTTextInput from '@shared/components/controls/ct-textinput';
import CTButton from '@shared/components/controls/ct-button';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { putUserCredential } from '@store/actions';
import { RootStackParamList } from '@navigation/types';
import { useTheme } from '@services/hooks/useTheme';
import { useAppNavigation } from '@services/hooks/useNavigation';
import { ClubApi } from '@services/api';
import { handleError, showAlert } from '@store/actions/ui';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import { CLUB_TYPE } from '@shared/constants';

type LoginScreenProps = StackScreenProps<RootStackParamList, 'Login'>;
type FormValues = {
    credential?: string;
};

const LoginScreen: React.FC<LoginScreenProps> = () => {
    const clubs = useAppSelector((state) => state.club.clubs);
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { colors } = theme;
    const navigation = useAppNavigation();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const user = useAppSelector((state) => state.auth.user);
    const [loading, setLoading] = useState(false);

    const { handleSubmit, control, formState } = useForm({
        defaultValues: {
            credential: user?.email || user?.phoneNumber || '',
        },
    });

    useEffect(() => {
        return () => setLoading(false);
    }, [user]);

    const onSubmit = async (data: FormValues) => {
        let { credential } = data;
        credential = credential?.toLowerCase().trim();
        setLoading(true);
        try {
            const { data: myClubs } = await ClubApi.retrieveMyClubs({ user: credential });
            if (myClubs.length === 0) {
                dispatch(showAlert({ type: 'warning', title: 'Warning', message: 'Account does not exist.' }));
                setLoading(false);
            } else {
                dispatch(putUserCredential(credential!));
                setLoading(false);
                navigation.navigate('Init', { initScreen: 'MyClubs' });
            }
        } catch (error) {
            setLoading(false);
            dispatch(handleError(error));
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backBtnContainer} onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" type={IconType.Ionicons} size={25} />
            </TouchableOpacity>
            <View style={styles.contentContainer}>
                <Image resizeMode="cover" source={require('../../assets/images/logo.png')} style={styles.logoStyle} />
                <CTText
                    h1
                    bold
                    fontFamily={fonts.montserrat.extraBold}
                    color={theme.colors.title}
                    center
                    style={styles.titleTextStyle}
                >
                    Login
                </CTText>
                <CTTextInput
                    style={styles.emailTextFieldStyle}
                    name="credential"
                    label="Email Address or Phone Number"
                    keyboardType="email-address"
                    validation={{ control, formState, rules: { required: true } }}
                />
                <CTButton loading={loading} title="LOGIN" onPress={handleSubmit(onSubmit)} />
                <CTText center style={styles.regDescriptionTextStyle}>
                    If you don't have an account of Conga, Please contact your club.
                </CTText>

                <CTText center style={styles.regDescriptionTextStyle}>
                    If you want to register to "Conga Sports", Please register here.
                </CTText>
                <CTButton
                    title="Register to Conga"
                    color={colors.secondary}
                    onPress={() => {
                        const congaClub = clubs.find((x) => x.type === CLUB_TYPE.VIRTUAL);
                        navigation.replace('Register', { club: congaClub });
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

export default LoginScreen;
