import React from 'react';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from '@services/hooks/useTheme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, CircleStackParamList } from '@navigation/types';
import BackHeader from '@navigation/components/back-header';
import CTText from '@shared/components/controls/ct-text';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { getStyle } from '@shared/theme/themes';
import fonts from '@shared/theme/fonts';
import MyCirclesScreen from '@screens/circles/tab/my-circles';
import CircleInvitationScreen from '@screens/circles/tab/invitations';
import CircleListScreen from '@screens/circles/tab/list';
import { checkSubscription } from '@services/helpers/user';
import { AlertModalButton } from '@services/types';
import { showAlertModal } from '@store/actions';

export type ScreenProps = StackScreenProps<RootStackParamList, 'Circles'>;
const Tab = createMaterialTopTabNavigator<CircleStackParamList>();

const CircleTabNavigator = ({ navigation, route }: ScreenProps) => {
    const dispatch = useAppDispatch();
    const club = useAppSelector((state) => state.club.club!);
    const user = useAppSelector((state) => state.auth.user!);
    const theme = useTheme();
    const { colors } = theme;
    const initScreen = route.params?.initScreen ?? 'MyCircles';

    const renderTabIcon = (route: any, focused: boolean, color: string) => {
        let iconName: string = 'home';
        switch (route.name) {
            case 'MyCircles':
                iconName = focused ? 'people-circle' : 'people-circle-outline';
                break;
            case 'Invitations':
                iconName = focused ? 'mail-unread' : 'mail-unread-outline';
                break;
            case 'CircleList':
                iconName = focused ? 'people' : 'people-outline';
                break;
            default:
                iconName = focused ? 'people' : 'people-outline';
                break;
        }
        return <Icon name={iconName} type={IconType.Ionicons} size={20} color={color} />;
    };

    const renderTabLabel = (route: any, focused: boolean) => {
        switch (route.name) {
            case 'MyCircles':
                return (
                    <CTText color={focused ? colors.primary : 'gray'} style={styles.topTabLabelStyle}>
                        My Circles
                    </CTText>
                );
            case 'Invitations':
                return (
                    <CTText color={focused ? colors.primary : 'gray'} style={styles.topTabLabelStyle}>
                        Invitations
                    </CTText>
                );
            case 'CircleList':
                return (
                    <CTText color={focused ? colors.primary : 'gray'} style={styles.topTabLabelStyle}>
                        Circles
                    </CTText>
                );
            default:
                return <CTText>Circles</CTText>;
        }
    };

    const goNewCircle = () => {
        const { valid, message, primaryButtonLabel, secondaryButtonLabel, reason } = checkSubscription();
        if (valid) {
            navigation.navigate('NewCircle');
        } else if (message) {
            const buttons: AlertModalButton[] = [];
            if (primaryButtonLabel) buttons.push({ type: 'ok', label: primaryButtonLabel, value: 'yes' });
            if (secondaryButtonLabel) buttons.push({ type: 'cancel', label: secondaryButtonLabel, value: 'no' });
            dispatch(
                showAlertModal({
                    type: 'warning',
                    title: 'Warning',
                    message,
                    buttons,
                    handler: async (value: string) => {
                        if (value === 'yes') {
                            if (reason === 'subscribe') return navigation.navigate('Subscription', { user, club });
                            else if (reason === 'profile') return navigation.navigate('Profile');
                        }
                    },
                })
            );
        }
    };

    return (
        <>
            <BackHeader title="Circles">
                <TouchableOpacity onPress={() => goNewCircle()}>
                    <View style={getStyle(['row', 'justify-center'])}>
                        <Icon type={IconType.Ionicons} name="add" size={25} color={colors.primary} />
                    </View>
                    <CTText color={colors.primary} size={8} fontFamily={fonts.montserrat.regular}>
                        Create Own Circle
                    </CTText>
                </TouchableOpacity>
            </BackHeader>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color }) => renderTabIcon(route, focused, color),
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: 'gray',
                    tabBarIndicatorStyle: { backgroundColor: colors.primary },
                    tabBarLabel: ({ focused }) => renderTabLabel(route, focused),
                    tabBarStyle: user ? { backgroundColor: colors.tabBar } : { display: 'none' },
                    lazy: true,
                })}
                initialRouteName={initScreen}
            >
                <Tab.Screen name="MyCircles" component={MyCirclesScreen} />
                <Tab.Screen name="Invitations" component={CircleInvitationScreen} />
                <Tab.Screen name="CircleList" component={CircleListScreen} />
            </Tab.Navigator>
        </>
    );
};

export default CircleTabNavigator;

const styles = StyleSheet.create({
    topTabLabelStyle: {
        fontSize: 12,
    },
});
