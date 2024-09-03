import React, { useEffect } from 'react';
import Geolocation from '@react-native-community/geolocation';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@services/hooks/useTheme';
import { palette } from '@shared/theme/themes';
import { StackScreenProps } from '@react-navigation/stack';
import { InitStackParamList, RootStackParamList } from '../types';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { View } from 'react-native';
import MyClubsScreen from '@screens/myclubs';
import { logout, putClub, putNotifications, putUserLocation } from '@store/actions';
import createStyles from './style';
import HotEventsScreen from '@screens/hot-events';
import { putClubEventQuery, putCongaClubEventQuery } from '@store/actions/clubevent';
import { useIsFocused } from '@react-navigation/native';
type NavigatorProps = StackScreenProps<RootStackParamList, 'Init'>;
const Tab = createBottomTabNavigator<InitStackParamList>();

const InitNavigator: React.FC<NavigatorProps> = ({ route }) => {
    const dispatch = useAppDispatch();
    const isFocursed = useIsFocused();
    const credential = useAppSelector((state) => state.auth.credential);
    const theme = useTheme();
    const { colors } = theme;
    const styles = createStyles();
    const initScreen = route.params?.initScreen;

    useEffect(() => {
        if (isFocursed) {
            Geolocation.getCurrentPosition((info) => {
                if (info) dispatch(putUserLocation([info.coords.longitude, info.coords.latitude]));
                // if (info) dispatch(putUserLocation([-122.551403, 37.001115]));
            });
            dispatch(putClub(null));
            dispatch(logout());
            dispatch(putNotifications([]));
            dispatch(putClubEventQuery());
            dispatch(putCongaClubEventQuery());
        }
    }, [isFocursed]);

    const renderTabIcon = (route: any, focused: boolean, color: string, size: number) => {
        let iconName: string = 'home';
        switch (route.name) {
            case 'MyClubs':
                iconName = focused ? 'home' : 'home-outline';
                break;
            case 'HotEvents':
                iconName = focused ? 'megaphone' : 'megaphone-outline';
                break;
            default:
                iconName = focused ? 'megaphone' : 'megaphone-outline';
                break;
        }
        return (
            <View style={styles.tabBarIconContainerStyle}>
                <Icon name={iconName} type={IconType.Ionicons} size={size} color={color} />
            </View>
        );
    };

    const renderTabLabel = (route: any) => {
        switch (route.name) {
            case 'MyClubs':
                return 'My Clubs';
            case 'HotEvents':
                return 'Hot Events';
            default:
                return 'Hot Events';
        }
    };

    return (
        <Tab.Navigator
            initialRouteName={initScreen ?? credential ? 'MyClubs' : 'HotEvents'}
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => renderTabIcon(route, focused, color, size),
                tabBarLabel: renderTabLabel(route),
                tabBarActiveTintColor: palette.primary,
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    backgroundColor: colors.tabBar,
                },
            })}
        >
            <Tab.Screen name="HotEvents" component={HotEventsScreen} />
            <Tab.Screen name="MyClubs" component={MyClubsScreen} />
        </Tab.Navigator>
    );
};

export default InitNavigator;
