import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useAppSelector, useAppDispatch } from '@store/hook';
import { useTheme } from '@services/hooks/useTheme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/types';
import createStyles from './style';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import CPAvatar from '@shared/components/avatar';
import { getStyle } from '@shared/theme/themes';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import { ScrollView } from 'react-native';
import { useAppNavigation } from '@services/hooks/useNavigation';
import { logout, putClub, showAlertModal } from '@store/actions';
import { handleError, setLoading, showAlert } from '@store/actions/ui';
import { AuthApi } from '@services/api';
import BackHeader from '@navigation/components/back-header';
import { capitalizeString } from '@utils';
import { SUBSCRIPTION_STATUS } from '@shared/constants';
import moment from 'moment';

type AccountScreenProps = StackScreenProps<RootStackParamList, 'Account'>;

const AccountScreen: React.FC<AccountScreenProps> = () => {
    const dispatch = useAppDispatch();
    const navigation = useAppNavigation();
    const user = useAppSelector((state) => state.auth.user);
    const club = useAppSelector((state) => state.club.club);
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);

    if (!user) return null;

    const goProfile = () => {
        navigation.navigate('Profile');
    };

    const goSettings = () => {
        navigation.navigate('Settings');
    };

    const logOut = () => {
        dispatch(logout());
        dispatch(putClub(null));
        navigation.goBack();
    };

    const deleteAccount = () => {
        dispatch(
            showAlertModal({
                type: 'warning',
                title: 'Delete Account',
                message: 'Do you want to delete account? \n Are you sure?',
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
                    try {
                        const params = { _id: user?._id };
                        dispatch(setLoading(true));
                        const { message } = await AuthApi.delete(params);
                        dispatch(setLoading(false));
                        dispatch(showAlert({ type: 'success', title: 'Success', message }));
                        dispatch(logout());
                    } catch (error) {
                        dispatch(setLoading(false));
                        dispatch(handleError(error));
                    }
                },
            })
        );
    };

    return (
        <View style={styles.containerStyle}>
            <BackHeader title="Account" style={styles.headerStyle} />
            <ScrollView style={styles.menuContainerStyle}>
                <TouchableOpacity style={[styles.menuItemContainerStyle, getStyle('my-16')]} onPress={goProfile}>
                    <View style={styles.labelContainerStyle}>
                        <CPAvatar size={50} source={user.photoUrl} name={user.fullName} />
                        <View style={getStyle('ml-8')}>
                            <CTText
                                color={colors.text}
                                fontFamily={fonts.montserrat.semiBold}
                                style={styles.labelTextStyle}
                            >
                                {user.fullName}
                            </CTText>
                            <CTText fontFamily={fonts.montserrat.semiBold} style={styles.profileEmailTextStyle}>
                                {user.email}
                            </CTText>
                            <CTText style={styles.descriptionTextStyle}>Manage your profile</CTText>
                        </View>
                    </View>
                    <Icon name="chevron-forward" type={IconType.Ionicons} size={20} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.menuItemContainerStyle, getStyle('mb-16')]} onPress={goSettings}>
                    <View style={styles.labelContainerStyle}>
                        <Icon name="settings-outline" type={IconType.Ionicons} size={30} />
                        <View style={getStyle('ml-8')}>
                            <CTText
                                color={colors.text}
                                fontFamily={fonts.montserrat.medium}
                                style={[styles.labelTextStyle, getStyle('mb-4')]}
                            >
                                Settings
                            </CTText>
                            <CTText style={styles.descriptionTextStyle}>Manage notification setting</CTText>
                        </View>
                    </View>
                    <Icon name="chevron-forward" type={IconType.Ionicons} size={20} />
                </TouchableOpacity>
                {club?.setting?.isReqSubscription && user.subscription && (
                    <View style={[styles.menuItemContainerStyle, getStyle('mb-16')]}>
                        <View style={styles.labelContainerStyle}>
                            <Icon name="ribbon-outline" type={IconType.Ionicons} size={30} />
                            <View style={getStyle('ml-8')}>
                                <CTText
                                    color={colors.text}
                                    fontFamily={fonts.montserrat.medium}
                                    style={[styles.labelTextStyle, getStyle('mb-4')]}
                                >
                                    Subscription
                                </CTText>
                                <CTText style={styles.descriptionTextStyle}>
                                    Until {moment(new Date(user.subscription.nextPaymentDate)).format('MMM DD, YYYY')}
                                </CTText>
                            </View>
                        </View>
                        <CTText
                            fontFamily={fonts.montserrat.regular}
                            bold
                            color={
                                user.subscription.status === SUBSCRIPTION_STATUS.ACTIVE ? colors.primary : colors.text
                            }
                        >
                            {capitalizeString(user.subscription.status)}
                        </CTText>
                    </View>
                )}
                <TouchableOpacity style={[styles.menuItemContainerStyle, getStyle('mb-32')]} onPress={logOut}>
                    <View style={styles.labelContainerStyle}>
                        <Icon name="home-outline" type={IconType.Ionicons} size={30} color={colors.secondary} />
                        <View style={getStyle('ml-8')}>
                            <CTText
                                color={colors.secondary}
                                fontFamily={fonts.montserrat.medium}
                                style={[styles.labelTextStyle, getStyle('mb-4')]}
                            >
                                Logout
                            </CTText>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItemContainerStyle} onPress={deleteAccount}>
                    <View style={styles.labelContainerStyle}>
                        <Icon name="warning-outline" type={IconType.Ionicons} size={30} color={colors.danger} />
                        <View style={getStyle('ml-8')}>
                            <CTText
                                color={colors.danger}
                                fontFamily={fonts.montserrat.medium}
                                style={[styles.labelTextStyle, getStyle('mb-4')]}
                            >
                                Delete Account
                            </CTText>
                            <CTText color={colors.danger} style={styles.descriptionTextStyle}>
                                You can not use this account anymore
                            </CTText>
                        </View>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default AccountScreen;
