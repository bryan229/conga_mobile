import React from 'react';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from '@services/hooks/useTheme';
import { StackScreenProps } from '@react-navigation/stack';
import { ClubEventStackParamList, HomeStackParamList } from '@navigation/types';
import Header from '@navigation/components/main-header';
import CTText from '@shared/components/controls/ct-text';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { StyleSheet } from 'react-native';
import ClubEventsScreen from '@screens/clubevents/tabs/list';
import RegistrationClubEventsScreen from '@screens/clubevents/tabs/registered-events';
import SponsorClubEventsScreen from '@screens/clubevents/tabs/sponsor-events';
import { checkSubscription } from '@services/helpers/user';
import { AlertModalButton } from '@services/types';
import { showAlertModal } from '@store/actions';

export type ScreenProps = StackScreenProps<HomeStackParamList, 'ClubEvents'>;
const Tab = createMaterialTopTabNavigator<ClubEventStackParamList>();

const ClubEventNavigator: React.FC<ScreenProps> = () => {
    const user = useAppSelector((state) => state.auth.user);
    const club = useAppSelector((state) => state.club.club);
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { colors } = theme;

    const renderTabIcon = (route: any, focused: boolean, color: string) => {
        let iconName: string = 'home';
        switch (route.name) {
            case 'ClubEventList':
                iconName = focused ? 'newspaper' : 'newspaper-outline';
                break;
            case 'RegisteredEvents':
                iconName = focused ? 'bookmarks' : 'bookmarks-outline';
                break;
            case 'CreateEvent':
                iconName = focused ? 'add' : 'add-outline';
                break;
            case 'SponsorEvents':
                iconName = focused ? 'brush' : 'brush-outline';
                break;
            default:
                iconName = focused ? 'home' : 'home-outline';
                break;
        }
        return (
            <Icon name={iconName} type={IconType.Ionicons} size={iconName.includes('add') ? 25 : 20} color={color} />
        );
    };

    const renderTabLabel = (route: any, focused: boolean) => {
        switch (route.name) {
            case 'ClubEventList':
                return (
                    <CTText color={focused ? colors.primary : 'gray'} style={style.topTabLabelStyle}>
                        List
                    </CTText>
                );
            case 'RegisteredEvents':
                return (
                    <CTText color={focused ? colors.primary : 'gray'} style={style.topTabLabelStyle}>
                        Registered
                    </CTText>
                );
            case 'CreateEvent':
                return (
                    <CTText color={focused ? colors.primary : 'gray'} style={style.topTabLabelStyle}>
                        Create Event
                    </CTText>
                );
            case 'SponsorEvents':
                return (
                    <CTText color={focused ? colors.primary : 'gray'} style={style.topTabLabelStyle} size={8}>
                        My Sponsored Events
                    </CTText>
                );
            default:
                return <CTText>Club Events</CTText>;
        }
    };

    const goCreateNewEvent = (navigation: any) => {
        const { valid, message, primaryButtonLabel, secondaryButtonLabel } = checkSubscription();
        if (valid) {
            navigation.navigate('CreateNewEvent', {});
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
                            return navigation.navigate('Subscription', { user, club });
                        }
                    },
                })
            );
        }
    };

    return (
        <>
            <Header title="Club Events" />
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color }) => renderTabIcon(route, focused, color),
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: 'gray',
                    tabBarIndicatorStyle: { backgroundColor: colors.primary },
                    tabBarLabel: ({ focused }) => renderTabLabel(route, focused),
                    tabBarStyle: user ? { backgroundColor: colors.tabBar } : { display: 'none' },
                })}
            >
                <Tab.Screen name="ClubEventList" component={ClubEventsScreen} />
                <Tab.Screen name="RegisteredEvents" component={RegistrationClubEventsScreen} />
                <Tab.Screen
                    name="CreateEvent"
                    component={EmptyComponent}
                    listeners={({ navigation }) => ({
                        tabPress: (e) => {
                            e.preventDefault();
                            goCreateNewEvent(navigation);
                        },
                    })}
                />
                <Tab.Screen name="SponsorEvents" component={SponsorClubEventsScreen} />
            </Tab.Navigator>
        </>
    );
};

export default ClubEventNavigator;

const style = StyleSheet.create({
    topTabLabelStyle: {
        fontSize: 12,
    },
});

export const EmptyComponent = () => null;
