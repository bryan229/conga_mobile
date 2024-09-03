import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import * as Progress from 'react-native-progress';
import ReactNativeModal from 'react-native-modal';
import createStyles from './style';
import { useTheme } from '@services/hooks/useTheme';
import CTText from '@shared/components/controls/ct-text';
import { getStyle } from '@shared/theme/themes';
import fonts from '@shared/theme/fonts';
import { QRCODE_TYPE } from '@shared/constants';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { useAppNavigation } from '@services/hooks/useNavigation';
import { loginSuccess, putClub, putMemberTypes, putMyCircles, putMyGuestAccounts } from '@store/actions';
import { AuthApi } from '@services/api';
import { TouchableOpacity } from 'react-native';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';

type Props = {
    data: any;
    isOpen: boolean;
    toggle: () => void;
};

const QRCodeCheckModal = ({ data, isOpen, toggle }: Props) => {
    const club = useAppSelector((state) => state.club.club);
    const credential = useAppSelector((state) => state.auth.credential!);
    const notiToken = useAppSelector((state) => state.auth.deviceToken);
    const myClubs = useAppSelector((state) => state.club.myClubs || []);
    const navigation = useAppNavigation();
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [loading, setLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<string>('');
    const [scanClubId, setClubId] = useState<string>();

    useEffect(() => {
        if (!data) return;
        const clubId = data?._id || data?.club;
        const scanClub = myClubs.find((x) => x._id === clubId);
        if (!scanClub) {
            setMessage('You are not a member of this club.');
            setLoading(false);
            return;
        }
        setClubId(clubId);
        if (club) {
            if (club._id !== clubId) {
                setMessage(`You are on ${club.displayName} now. \n Do you want to login to ${scanClub.displayName}?`);
                setLoading(false);
                return;
            }
            toggle();
            if (data.type === QRCODE_TYPE.CLUB) return navigation.replace('CheckIn', {});
            else if (data.type === QRCODE_TYPE.COURT)
                return navigation.replace('CheckIn', { venue: data.venue, court: data.court });
        } else {
            loginToClub(clubId);
        }
    }, [data]);

    useEffect(() => {
        if (!isOpen) {
            setMessage('');
            setClubId(undefined);
        }
    }, [isOpen]);

    const loginToClub = async (clubId: string) => {
        setLoading(true);
        try {
            let params: any = { club: clubId, user: credential };
            if (notiToken) params = { ...params, notiToken };
            const { user, token, refreshToken, memberTypes, myCircles, myGuestAccounts } = await AuthApi.login(params);
            dispatch(putClub(myClubs.find((x) => x._id === clubId)!));
            dispatch(loginSuccess({ user, token, refreshToken }));
            dispatch(putMemberTypes(memberTypes));
            dispatch(putMyCircles(myCircles));
            dispatch(putMyGuestAccounts(myGuestAccounts));
            setLoading(false);
            toggle();
            if (data.type === QRCODE_TYPE.CLUB) return navigation.replace('CheckIn', {});
            else if (data.type === QRCODE_TYPE.COURT)
                return navigation.replace('CheckIn', { venue: data.venue, court: data.court });
        } catch (error) {
            setLoading(false);
            navigation.goBack();
        }
    };

    if (!data) return null;

    return (
        <ReactNativeModal
            isVisible={isOpen}
            statusBarTranslucent={false}
            hasBackdrop={true}
            backdropOpacity={0.8}
            animationIn="fadeIn"
            animationInTiming={100}
            animationOut="fadeOut"
            animationOutTiming={200}
            // onBackdropPress={toggle}
        >
            <View style={styles.container}>
                {loading ? (
                    <>
                        <CTText
                            style={getStyle(['py-16'])}
                            size={12}
                            center
                            color={colors.text}
                            fontFamily={fonts.montserrat.semiBold}
                        >
                            Checking...
                        </CTText>
                        <View style={styles.loadingContainer}>
                            <Progress.Circle
                                size={40}
                                indeterminate={loading}
                                borderWidth={3}
                                borderColor={colors.primary}
                            />
                        </View>
                    </>
                ) : (
                    <>
                        <CTText
                            style={getStyle(['py-32'])}
                            size={12}
                            center
                            color={colors.text}
                            fontFamily={fonts.montserrat.semiBold}
                        >
                            {message}
                        </CTText>
                        {scanClubId ? (
                            <View style={getStyle(['row', 'justify-center', 'align-items-center', 'mt-16'])}>
                                <TouchableOpacity
                                    style={getStyle(['row', 'justify-center', 'align-items-center', 'mr-80'])}
                                    onPress={() => {
                                        toggle();
                                        navigation.goBack();
                                    }}
                                >
                                    <Icon name="close" color={colors.text} type={IconType.Ionicons} size={25} />
                                    <CTText fontFamily={fonts.montserrat.semiBold} color={colors.text}>
                                        No
                                    </CTText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={getStyle(['row', 'justify-center', 'align-items-center'])}
                                    onPress={() => {
                                        loginToClub(scanClubId);
                                    }}
                                >
                                    <Icon name="checkmark" color={colors.text} type={IconType.Ionicons} size={25} />
                                    <CTText fontFamily={fonts.montserrat.semiBold} color={colors.text}>
                                        Yes
                                    </CTText>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={getStyle(['row', 'justify-center', 'align-items-center', 'mt-16'])}
                                onPress={() => {
                                    toggle();
                                    navigation.goBack();
                                }}
                            >
                                <Icon name="close" color={colors.danger} type={IconType.Ionicons} size={25} />
                                <CTText fontFamily={fonts.montserrat.semiBold} color={colors.danger}>
                                    Close
                                </CTText>
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </View>
        </ReactNativeModal>
    );
};

export default QRCodeCheckModal;
