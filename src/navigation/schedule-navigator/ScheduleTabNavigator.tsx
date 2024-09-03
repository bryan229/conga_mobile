import React from 'react';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from '@services/hooks/useTheme';
import { StackScreenProps } from '@react-navigation/stack';
import { ScheduleStackParamList, ScheduleTabStackParamList } from '@navigation/types';
import Header from '@navigation/components/main-header';
import CTText from '@shared/components/controls/ct-text';
import { useAppSelector } from '@store/hook';
import { StyleSheet } from 'react-native';
import MySchedulesScreen from '@screens/schedules/tab/list';
import SubmitSchedule from '@screens/schedules/tab/new';
import CheckInSchedulesScreen from '@screens/schedules/tab/checkin';
import { isCheckInSponsor } from '@services/helpers/user';

export type ScheduleTabNavigatorProps = StackScreenProps<ScheduleStackParamList, 'ScheduleTab'>;
const Tab = createMaterialTopTabNavigator<ScheduleTabStackParamList>();

const ScheduleTabNavigator: React.FC<ScheduleTabNavigatorProps> = () => {
    const user = useAppSelector((state) => state.auth.user!);
    const theme = useTheme();
    const { colors } = theme;

    const renderTabIcon = (route: any, focused: boolean, color: string) => {
        let iconName: string = 'home';
        switch (route.name) {
            case 'MySchedules':
                iconName = focused ? 'documents' : 'documents-outline';
                break;
            case 'CheckInSchedules':
                iconName = focused ? 'documents' : 'documents-outline';
                break;
            case 'SubmitSchedule':
                iconName = focused ? 'add' : 'add-outline';
                break;
            default:
                iconName = focused ? 'home' : 'home-outline';
                break;
        }
        return <Icon name={iconName} type={IconType.Ionicons} size={20} color={color} />;
    };

    const renderTabLabel = (route: any, focused: boolean) => {
        switch (route.name) {
            case 'MySchedules':
                return (
                    <CTText color={focused ? colors.primary : 'gray'} style={style.topTabLabelStyle}>
                        My Schedules
                    </CTText>
                );
            case 'CheckInSchedules':
                return (
                    <CTText color={focused ? colors.primary : 'gray'} style={style.topTabLabelStyle}>
                        Check In
                    </CTText>
                );
            case 'SubmitSchedule':
                return (
                    <CTText color={focused ? colors.primary : 'gray'} style={style.topTabLabelStyle}>
                        Reserve
                    </CTText>
                );
            default:
                return <CTText>Schedules</CTText>;
        }
    };

    const renderContent = () => {
        return (
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
            >
                <Tab.Screen name="MySchedules" component={MySchedulesScreen} />
                {isCheckInSponsor() && <Tab.Screen name="CheckInSchedules" component={CheckInSchedulesScreen} />}
                <Tab.Screen name="SubmitSchedule" component={SubmitSchedule} />
            </Tab.Navigator>
        );
    };

    return (
        <>
            <Header title="Schedules" />
            {renderContent()}
        </>
    );
};

export default ScheduleTabNavigator;

const style = StyleSheet.create({
    topTabLabelStyle: {
        fontSize: 12,
    },
});
