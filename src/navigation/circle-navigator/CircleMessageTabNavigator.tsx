import React, { useCallback, useEffect, useState } from 'react';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from '@services/hooks/useTheme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, CircleMessageStackParamList } from '@navigation/types';
import BackHeader from '@navigation/components/back-header';
import CTText from '@shared/components/controls/ct-text';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { StyleSheet, View } from 'react-native';
import CircleMessageListScreen from '@screens/circles/circle-message/tab/message';
import NewCircleMessageScreen from '@screens/circles/circle-message/tab/new-message';
import CircleInfoScreen from '@screens/circles/circle-message/tab/circle-info';
import { Circle } from '@services/models';
import { CircleApi } from '@services/api';
import * as Progress from 'react-native-progress';
import { handleError, showAlertModal } from '@store/actions';
import { ScreenWidth } from '@freakycoder/react-native-helpers';
import { CIRCLE_STATUS } from '@shared/constants';
import fonts from '@shared/theme/fonts';
import { checkPermissionForCircle } from '@services/helpers/user';
import { AlertModalButton } from '@services/types';
import { useAppNavigation } from '@services/hooks/useNavigation';

export type ScreenProps = StackScreenProps<RootStackParamList, 'CircleMessage'>;
const Tab = createMaterialTopTabNavigator<CircleMessageStackParamList>();

const CircleMessageTabNavigator = ({ route }: ScreenProps) => {
    const club = useAppSelector((state) => state.club.club!);
    const user = useAppSelector((state) => state.auth.user!);
    const dispatch = useAppDispatch();
    const navigation = useAppNavigation();
    const theme = useTheme();
    const { colors } = theme;
    const initScreen = route.params.initScreen ?? 'CircleMessageList';
    const messageId = route.params.messageId;
    const commentId = route.params.commentId;
    const resourceId = route.params.resourceId;
    const [circle, setCircle] = useState<Circle>();
    const [loading, setLoading] = useState<boolean>(false);

    const fetchCircle = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await CircleApi.read({ _id: route.params.circleId });
            setCircle(data as Circle);
            setLoading(false);
        } catch (error) {
            dispatch(handleError(error));
            setLoading(false);
        }
    }, [route.params.circleId]);

    useEffect(() => {
        if (route.params.circleId) fetchCircle();
    }, [route.params.circleId]);

    useEffect(() => {
        if (circle) checkPermission();
    }, [circle]);

    const checkPermission = () => {
        const { valid, message, primaryButtonLabel, secondaryButtonLabel, reason } = checkPermissionForCircle(circle);
        if (!valid) {
            if (message) {
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
                            } else {
                                navigation.pop();
                            }
                        },
                    })
                );
            } else {
                navigation.pop();
            }
        }
    };

    const Loading = () => {
        if (!loading || circle) return null;
        return (
            <View style={style.loadingContainerStyle}>
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

    if (!circle) return null;

    const renderTabIcon = (route: any, focused: boolean, color: string) => {
        let iconName: string = 'home';
        switch (route.name) {
            case 'CircleMessageList':
                iconName = focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline';
                break;
            case 'CircleInfo':
                iconName = focused ? 'people' : 'people-outline';
                break;
            case 'NewMessage':
                iconName = focused ? 'paper-plane' : 'paper-plane-outline';
                break;
            default:
                iconName = focused ? 'megaphone' : 'chatbox-ellipses-outline';
                break;
        }
        return <Icon name={iconName} type={IconType.Ionicons} size={20} color={color} />;
    };

    const renderTabLabel = (route: any, focused: boolean) => {
        switch (route.name) {
            case 'CircleMessageList':
                return (
                    <CTText color={focused ? colors.primary : 'gray'} style={style.topTabLabelStyle}>
                        Messages
                    </CTText>
                );
            case 'CircleInfo':
                return (
                    <CTText color={focused ? colors.primary : 'gray'} style={style.topTabLabelStyle}>
                        Circle
                    </CTText>
                );
            case 'NewMessage':
                return (
                    <CTText color={focused ? colors.primary : 'gray'} style={style.topTabLabelStyle}>
                        New Message
                    </CTText>
                );
            default:
                return <CTText>Messages</CTText>;
        }
    };

    return (
        <>
            <BackHeader
                titleComponent={
                    <CTText h2 color={colors.text} fontFamily={fonts.montserrat.bold}>
                        {circle.name}
                    </CTText>
                }
            />
            <Loading />
            {circle && (
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
                    <Tab.Screen
                        name="CircleMessageList"
                        component={CircleMessageListScreen}
                        initialParams={{ circle, messageId, commentId }}
                    />
                    <Tab.Screen name="CircleInfo" component={CircleInfoScreen} initialParams={{ circle }} />
                    {circle.status === CIRCLE_STATUS.ACTIVATED && (
                        <Tab.Screen
                            name="NewMessage"
                            component={NewCircleMessageScreen}
                            initialParams={{ circle, resourceId }}
                        />
                    )}
                </Tab.Navigator>
            )}
        </>
    );
};

export default CircleMessageTabNavigator;

const style = StyleSheet.create({
    topTabLabelStyle: {
        fontSize: 12,
    },
    loadingContainerStyle: {
        width: ScreenWidth,
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
