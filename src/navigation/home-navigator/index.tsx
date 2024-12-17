import React, { useCallback, useEffect } from 'react';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@services/hooks/useTheme';
import { getStyle, palette } from '@shared/theme/themes';
import { StackScreenProps } from '@react-navigation/stack';
import { HomeStackParamList, RootStackParamList } from '../types';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { TouchableOpacity, View } from 'react-native';
import IconBadge from '@shared/components/icon-badge';
import CTText from '@shared/components/controls/ct-text';
import MessagesScreen from '@screens/messages';
import createStyles from './style';
import ClubEventNavigator from '@navigation/clubevent-navigator';
import RequestNavigator from '@navigation/request-navigator';
import ScehduleNavigator from '@navigation/schedule-navigator';
import NotificationManager from '@navigation/components/notification-manager';
import { CLUB_TYPE } from '@shared/constants';
import CircleTabNavigator from '@navigation/circle-navigator/CircleTabNavigator';
import ParticipatingOrganizationsScreen from '@screens/participating-organizations';
import { SubClubApi } from '@services/api';
import { putSubClubs } from '@store/actions';

type HomeNavigatorProps = StackScreenProps<RootStackParamList, 'Home'>;
const Tab = createBottomTabNavigator<HomeStackParamList>();

const HomeNavigator: React.FC<HomeNavigatorProps> = ({ route }) => {
    const user = useAppSelector((state) => state.auth.user);
    const credential = useAppSelector((state) => state.auth.credential);
    const club = useAppSelector((state) => state.club.club);
    const dispatch = useAppDispatch();
    const initScreen = route.params?.initScreen ?? 'Messages';
    const isNewNoti = useAppSelector((state) => state.ui.isNewNoti);
    const theme = useTheme();
    const { colors } = theme;
    const styles = createStyles();

    const fetchSubClubs = useCallback(async () => {
        try {
            const { data } = await SubClubApi.retrieve({ club: club?._id });
            dispatch(putSubClubs(data));
        } catch (error) {
            console.log(error);
        }
    }, [club?._id]);

    useEffect(() => {
        if (user && credential && club && club.type === CLUB_TYPE.VIRTUAL) fetchSubClubs();
    }, [club?._id]);

    if (!user && !credential) return null;

    const renderTabIcon = (route: any, focused: boolean, color: string, size: number) => {
        let iconName: string = 'home';
        switch (route.name) {
            case 'MyClubs':
                iconName = focused ? 'home' : 'home-outline';
                break;
            case 'Messages':
                iconName = focused ? 'notifications' : 'notifications-outline';
                break;
            case 'ClubEvents':
                iconName = focused ? 'calendar' : 'calendar-outline';
                break;
            case 'Requests':
                iconName = focused ? 'documents' : 'documents-outline';
                break;
            case 'Reservations':
                iconName = focused ? 'watch' : 'watch-outline';
                break;
            case 'Circles':
                iconName = focused ? 'people' : 'people-outline';
                break;
            case 'Organizations':
                iconName = focused ? 'business' : 'business-outline';
                break;
            default:
                iconName = focused ? 'home' : 'home-outline';
                break;
        }
        return (
            <View style={styles.tabBarIconContainerStyle}>
                <Icon name={iconName} type={IconType.Ionicons} size={size} color={color} />
                {route.name === 'Messages' && (
                    <IconBadge count={isNewNoti ? -1 : 0} size={10} style={styles.messageIconBadgeStyle} />
                )}
            </View>
        );
    };

    const renderTabLabel = (route: any) => {
        if (route.name === 'Messages') return 'Messages';
        else if (route.name === 'ClubEvents') return 'Club Events';
        else if (route.name === 'Requests') return 'Requests';
        else if (route.name === 'Reservations') return 'Reservations';
        else if (route.name === 'Circles') return 'Circles';
        else if (route.name === 'Organizations') return 'Organizations';
        return 'Messages';
    };

    const isUserLoggedIn = () => {
        return !!user && !!club;
    };

    const isVirtualClub = () => {
        return club?.type === CLUB_TYPE.VIRTUAL;
    };

    return (
        <>
            <NotificationManager />
            <Tab.Navigator
                initialRouteName={initScreen ?? 'Messages'}
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
                {isUserLoggedIn() && (
                    <>
                        <Tab.Screen name="Messages" component={MessagesScreen} options={{ unmountOnBlur: true }} />
                        <Tab.Screen name="ClubEvents" component={ClubEventNavigator} />
                        {isVirtualClub() ? (
                            <>
                                <Tab.Screen name="Organizations" component={ParticipatingOrganizationsScreen} />
                                <Tab.Screen name="Circles" component={CircleTabNavigator} />
                            </>
                        ) : (
                            <>
                                <Tab.Screen name="Requests" component={RequestNavigator} />
                                <Tab.Screen name="Reservations" component={ScehduleNavigator} />
                                <Tab.Screen
                                    name="Scan"
                                    component={EmptyComponent}
                                    options={({ navigation }) => ({
                                        tabBarButton: (props) => (
                                            <TouchableOpacity
                                                {...props}
                                                onPress={() => {
                                                    navigation.navigate('ScanQRCode');
                                                }}
                                            >
                                                <View style={styles.tabBarIconContainerStyle}>
                                                    <Icon
                                                        name="qr-code-outline"
                                                        type={IconType.Ionicons}
                                                        size={25}
                                                        color={'gray'}
                                                    />
                                                    <CTText size={8} style={getStyle('mt-4')}>
                                                        Scan
                                                    </CTText>
                                                </View>
                                            </TouchableOpacity>
                                        ),
                                    })}
                                />
                            </>
                        )}
                    </>
                )}
            </Tab.Navigator>
        </>
    );
};

export default HomeNavigator;

export const EmptyComponent = () => null;
