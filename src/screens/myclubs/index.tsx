import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as Progress from 'react-native-progress';
import { View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useIsFocused } from '@react-navigation/native';
import createStyles from './style';
import { InitStackParamList } from '@navigation/types';
import { useTheme } from '@services/hooks/useTheme';
import NotificationService from '@services/notification';
import CTText from '@shared/components/controls/ct-text';
import { Club } from '@services/models';
import fonts from '@shared/theme/fonts';
import { getStyle } from '@shared/theme/themes';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { CLUB_TYPE, DEFAULT_LOGO } from '@shared/constants';
import { TouchableOpacity } from 'react-native';
import {
    handleError,
    loginSuccess,
    putClub,
    putClubs,
    putMemberTypes,
    putMyCircles,
    putMyClubs,
    putMyGuestAccounts,
    putSponsors,
} from '@store/actions';
import CPClubLogo from '@shared/components/club-logo';
import { useAppNavigation } from '@services/hooks/useNavigation';
import PublicHeader from '@navigation/components/public-header';
import { AuthApi, ClubApi, UserApi } from '@services/api';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import CTButton from '@shared/components/controls/ct-button';
import { NotificationEventType } from '@services/types';

type MyClubsScreenProps = StackScreenProps<InitStackParamList, 'MyClubs'>;

const MyClubsScreen: React.FC<MyClubsScreenProps> = () => {
    const myClubs = useAppSelector((state) => state.club.myClubs);
    const clubs = useAppSelector((state) => state.club.clubs);
    const credential = useAppSelector((state) => state.auth.credential);
    const notiToken = useAppSelector((state) => state.auth.deviceToken);
    const isFocursed = useIsFocused();
    const navigation = useAppNavigation();
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [loading, setLoading] = useState<boolean>(false);
    const [initClubId, setInitClubId] = useState<string>();

    const fetchClubs = useCallback(async () => {
        setLoading(true);
        try {
            const { data: _clubs } = await ClubApi.retrieve({});
            dispatch(putClubs(_clubs.filter((x: Club) => x.allowReservations || x.type === CLUB_TYPE.VIRTUAL)));
            if (credential) {
                const { data: _myclubIds } = await ClubApi.retrieveMyClubs({ user: credential });
                const _myClubs = _clubs.filter((x: Club) => _myclubIds.includes(x._id));
                dispatch(putMyClubs(_myClubs));
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            dispatch(handleError(error));
        }
    }, [credential]);

    useEffect(() => {
        if (credential || isFocursed) fetchClubs();
    }, [credential, isFocursed]);

    useEffect(() => {
        NotificationService.clearAppIconBadge();
        const onNotiOpenAppUnSubscribe = NotificationService.onNotificationOpenedApp(onNotification);
        return () => {
            onNotiOpenAppUnSubscribe();
        };
    }, []);

    useEffect(() => {
        if (myClubs.length > 0 && initClubId) {
            const initClub = myClubs.find((x) => x._id === initClubId);
            if (initClub) {
                setInitClubId(undefined);
                loginToClub(initClub);
            }
        }
    }, [initClubId, myClubs]);

    const onNotification = (notiData: any, type?: NotificationEventType) => {
        if (type === 'OPEN_APP_NOTIFICATION') setInitClubId(notiData.data.clubId);
    };

    const isCongaMember = () => {
        return (myClubs ?? []).some((x) => x.type === CLUB_TYPE.VIRTUAL);
    };

    const loginToClub = async (club: Club) => {
        try {
            let params: any = { club: club._id, user: credential };
            if (notiToken) params = { ...params, notiToken };
            setLoading(true);
            const { user, token, refreshToken, memberTypes, myCircles, myGuestAccounts } = await AuthApi.login(params);
            const { data: _sponsors } = await UserApi.retrieveSponsors({ club: club?._id });
            dispatch(putSponsors(_sponsors));
            dispatch(putClub(club));
            dispatch(loginSuccess({ user, token, refreshToken }));
            dispatch(putMemberTypes(memberTypes));
            dispatch(putMyCircles(myCircles));
            dispatch(putMyGuestAccounts(myGuestAccounts));
            setLoading(false);
            if (club.allowUserSignUp && !user.isActivated) return navigation.navigate('Verify', { user, club });
            navigation.navigate('Home');
        } catch (error) {
            setLoading(false);
            dispatch(handleError(error));
        }
    };

    const regCongaClub = async () => {
        try {
            setLoading(true);
            const congaClub = clubs.find((x) => x.type === CLUB_TYPE.VIRTUAL);
            const referClub = myClubs[0];
            const params = {
                club: congaClub?._id,
                referClub: referClub._id,
                credential,
            };
            const { user } = await UserApi.signUp(params);
            setLoading(false);
            if (congaClub?.allowUserSignUp) {
                if (!user.isActivated) return navigation.navigate('Verify', { user, club: congaClub });
            }
            fetchClubs();
        } catch (error) {
            setLoading(false);
            dispatch(handleError(error));
        }
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

    const NoCredential = () => {
        return (
            <View style={getStyle(['mt-64', 'px-32'])}>
                <CTButton
                    title="Register to Conga"
                    style={getStyle('mb-32')}
                    color={colors.secondary}
                    onPress={() => {
                        const congaClub = clubs.find((x) => x.type === CLUB_TYPE.VIRTUAL);
                        navigation.navigate('Register', { club: congaClub });
                    }}
                />
                <CTButton
                    title="Login to My Clubs"
                    onPress={() => navigation.navigate('Login')}
                />
            </View>
        );
    };

    const CongaBadge = () => {
        if (isCongaMember()) return null;
        if (loading || !isFocursed) return null;
        if (myClubs?.length > 0)
            return (
                <TouchableOpacity style={styles.congaBadgeStyle} onPress={regCongaClub}>
                    <View>
                        <CTText fontFamily={fonts.montserrat.regular} size={10} color={colors.white} bold>
                            You can enjoy more events in Conga Sports.
                        </CTText>
                        <CTText fontFamily={fonts.montserrat.regular} size={10} color={colors.white} bold>
                            Register for Conga Sports in ONE CLICK
                        </CTText>
                    </View>
                    <Icon type={IconType.Ionicons} name="arrow-forward" color={colors.white} />
                </TouchableOpacity>
            );
        else
            return (
                <TouchableOpacity
                    style={styles.congaBadgeStyle}
                    onPress={() => {
                        const congaClub = clubs.find((x) => x.type === CLUB_TYPE.VIRTUAL);
                        navigation.navigate('Register', { club: congaClub });
                    }}
                >
                    <View>
                        <CTText fontFamily={fonts.montserrat.regular} size={10} color={colors.white} bold>
                            You can enjoy more events in Conga Sports.
                        </CTText>
                        <CTText fontFamily={fonts.montserrat.regular} size={10} color={colors.white} bold>
                            Please register to Conga Sports
                        </CTText>
                    </View>
                    <Icon type={IconType.Ionicons} name="arrow-forward" color={colors.white} />
                </TouchableOpacity>
            );
    };

    const ClubItem = ({ club }: { club: Club }) => {
        return (
            <TouchableOpacity style={styles.itemContainerStyle} activeOpacity={0.7} onPress={() => loginToClub(club)}>
                <CPClubLogo source={club.logoUrl || DEFAULT_LOGO} name={club.displayName} size={50} />
                <View style={getStyle('ml-8')}>
                    <CTText fontFamily={fonts.montserrat.medium} color={colors.primary}>
                        {club.displayName}
                    </CTText>
                    <CTText fontFamily={fonts.montserrat.medium} color={colors.text} size={10} style={getStyle('my-4')}>
                        {club.email}
                    </CTText>
                    <CTText fontFamily={fonts.montserrat.medium} color={colors.text} size={10}>
                        {club.mobilePhone}
                    </CTText>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.containerStyle}>
            <PublicHeader title="My Clubs" />
            <View style={styles.contentStyle}>
                <Loading />
                {credential ? (
                    <>
                        <CongaBadge />
                        <View style={styles.listContainerStyle}>
                            {myClubs.map((x) => (
                                <ClubItem club={x} key={x._id} />
                            ))}
                        </View>
                    </>
                ) : (
                    <NoCredential />
                )}
            </View>
        </View>
    );
};

export default MyClubsScreen;
