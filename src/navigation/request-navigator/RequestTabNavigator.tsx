import React from 'react';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from '@services/hooks/useTheme';
import { StackScreenProps } from '@react-navigation/stack';
import { RequestStackParamList, RequestTabStackParamList } from '@navigation/types';
import Header from '@navigation/components/main-header';
import CTText from '@shared/components/controls/ct-text';
import { useAppSelector } from '@store/hook';
import { StyleSheet } from 'react-native';
import RequestsScreen from '@screens/requests/tab/list';
import SubmitRequest from '@screens/requests/tab/new';

export type RequestTabNavigatorProps = StackScreenProps<RequestStackParamList, 'RequestTab'>;
const Tab = createMaterialTopTabNavigator<RequestTabStackParamList>();

const RequestTabNavigator: React.FC<RequestTabNavigatorProps> = () => {
    const user = useAppSelector((state) => state.auth.user);
    const theme = useTheme();
    const { colors } = theme;

    const renderTabIcon = (route: any, focused: boolean, color: string) => {
        let iconName: string = 'home';
        switch (route.name) {
            case 'Requests':
                iconName = focused ? 'documents' : 'documents-outline';
                break;
            case 'SubmitRequest':
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
            case 'Requests':
                return (
                    <CTText color={focused ? colors.primary : 'gray'} style={style.topTabLabelStyle}>
                        Requests
                    </CTText>
                );
            case 'SubmitRequest':
                return (
                    <CTText color={focused ? colors.primary : 'gray'} style={style.topTabLabelStyle}>
                        Select
                    </CTText>
                );
            default:
                return <CTText>Requests</CTText>;
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
                <Tab.Screen name="Requests" component={RequestsScreen} />
                <Tab.Screen
                    name="SubmitRequest"
                    component={SubmitRequest}
                    listeners={({ navigation }) => ({
                        tabPress: (e) => {
                            e.preventDefault();
                            navigation.navigate('SubmitRequest');
                        },
                    })}
                />
            </Tab.Navigator>
        );
    };

    return (
        <>
            <Header title="Requests" />
            {renderContent()}
        </>
    );
};

export default RequestTabNavigator;

const style = StyleSheet.create({
    topTabLabelStyle: {
        fontSize: 12,
    },
});
