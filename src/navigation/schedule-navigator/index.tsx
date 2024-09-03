import React, { useEffect } from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { HomeStackParamList, ScheduleStackParamList } from '@navigation/types';
import ScheduleTabNavigator from './ScheduleTabNavigator';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useAppNavigation } from '@services/hooks/useNavigation';

const Stack = createStackNavigator<ScheduleStackParamList>();

const ScehduleNavigator = () => {
    const route = useRoute<RouteProp<HomeStackParamList, 'Reservations'>>();
    const navigation = useAppNavigation();

    useEffect(() => {
        if (route.params?.defaultScreen) navigation.navigate(route.params.defaultScreen as any);
    }, [route.params]);

    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}
        >
            <Stack.Screen name="ScheduleTab" component={ScheduleTabNavigator} />
        </Stack.Navigator>
    );
};

export default ScehduleNavigator;
