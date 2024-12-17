import React, { useEffect } from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import NotificationService from '@services/notification';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { useToast } from 'react-native-toast-notifications';
import HomeNavigator from '@navigation/home-navigator';
import { RootStackParamList } from './types';
import CPDropUpPicker from '@shared/components/bottom-sheet-picker';
import { useTheme } from '@services/hooks/useTheme';
import { isReadyRef, navigationRef } from '@services/navigation';
import CPFullLoading from '@shared/components/full-loading';
import LoginScreen from '@screens/login';
import AccountScreen from '@screens/account';
import ProfileScreen from '@screens/profile';
import ScanScreen from '@screens/scan';
import CheckInScreen from '@screens/check-in';
import SettingScreen from '@screens/settings';
import PostNavigator from './post-navigator';
import OpponentScreen from '@screens/opponents';
import ChatListScreen from '@screens/chat/list';
import ChatRoomScreen from '@screens/chat/room';
import NewCircleScreen from '@screens/circles/new';
import CircleMessageTabNavigator from './circle-navigator/CircleMessageTabNavigator';
import InitNavigator from './init-navigator';
import { putDeviceToken } from '@store/actions';
import RegisterScreen from '@screens/register';
import CreateNewEventScreen from '@screens/create-new-event';
import SearchResourcesScreen from '@screens/search-resources';
import VerifyScreen from '@screens/verify';
import ScripeCheckoutScreen from '@screens/stripe-checkout';
import SubscriptionScreen from '@screens/subscription';
import EditEventScreenScreen from '@screens/event-edit';
import EventSearchPanelScreen from '@screens/event-search-panel';
import ResourceSearchPanelScreen from '@screens/resource-search-panel';
import OrganizationSearchPanelScreen from '@screens/organization-search-panel';
import AddResourceScreen from '@screens/add-resource';
import CircleSearchPanelScreen from '@screens/circle-search-panel';
import FacilityResourcesScreen from '@screens/facility-resources';

const Stack = createStackNavigator<RootStackParamList>();

const MainNavigation = () => {
    const theme = useTheme();
    const alert = useAppSelector((state) => state.ui.alert);
    const user = useAppSelector((state) => state.auth.user);
    const club = useAppSelector((state) => state.club.club);
    const deviceToken = useAppSelector((state) => state.auth.deviceToken);
    const dispatch = useAppDispatch();
    const toast = useToast();

    useEffect(() => {
        getDeviceToken();
    }, []);

    useEffect(() => {
        if (alert?.message && toast.show) {
            toast.show(alert.message, {
                type: `${alert.type}_toast`,
                animationDuration: 100,
                data: {
                    title: alert.title,
                },
            });
        }
    }, [alert, toast]);

    const getDeviceToken = async () => {
        const newDeviceToken = await NotificationService.getDeviceToken();
        if (newDeviceToken && (!deviceToken || newDeviceToken !== deviceToken))
            dispatch(putDeviceToken(newDeviceToken));
    };

    const isUserLoggedIn = () => {
        return !!user && !!club;
    };

    return (
        <>
            <NavigationContainer
                onReady={() => {
                    isReadyRef.current = true;
                }}
                ref={navigationRef}
                theme={theme}
            >
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    }}
                    initialRouteName="Init"
                >
                    <Stack.Screen name="Init" component={InitNavigator} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Verify" component={VerifyScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                    <Stack.Screen name="ScanQRCode" component={ScanScreen} />
                    <Stack.Screen name="CheckIn" component={CheckInScreen} />
                    <Stack.Screen name="EventSearchPanel" component={EventSearchPanelScreen} />
                    <Stack.Screen name="ResourceSearchPanel" component={ResourceSearchPanelScreen} />
                    <Stack.Screen name="OrganizationSearchPanel" component={OrganizationSearchPanelScreen} />
                    <Stack.Screen name="CircleSearchPanel" component={CircleSearchPanelScreen} />
                    <Stack.Screen name="AddResource" component={AddResourceScreen} />
                    {isUserLoggedIn() && (
                        <Stack.Group>
                            <Stack.Screen name="Home" component={HomeNavigator} />
                            <Stack.Screen name="Account" component={AccountScreen} />
                            <Stack.Screen name="Profile" component={ProfileScreen} />
                            <Stack.Screen name="Settings" component={SettingScreen} />
                            <Stack.Screen name="Posts" component={PostNavigator} />
                            <Stack.Screen name="Opponents" component={OpponentScreen} />
                            <Stack.Screen name="ChatList" component={ChatListScreen} />
                            <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
                            <Stack.Screen name="Resources" component={FacilityResourcesScreen} />
                            <Stack.Screen name="NewCircle" component={NewCircleScreen} />
                            <Stack.Screen name="CreateNewEvent" component={CreateNewEventScreen} />
                            <Stack.Screen name="EditClubEvent" component={EditEventScreenScreen} />
                            <Stack.Screen name="SearchResources" component={SearchResourcesScreen} />
                            <Stack.Screen name="CircleMessage" component={CircleMessageTabNavigator} />
                            <Stack.Screen name="StripeCheckout" component={ScripeCheckoutScreen} />
                            <Stack.Screen name="Subscription" component={SubscriptionScreen} />
                        </Stack.Group>
                    )}
                </Stack.Navigator>
            </NavigationContainer>
            <CPDropUpPicker />
            <CPFullLoading />
        </>
    );
};

export default MainNavigation;
