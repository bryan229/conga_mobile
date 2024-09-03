import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { RequestStackParamList } from '@navigation/types';
import RequestTabNavigator from './RequestTabNavigator';

const Stack = createStackNavigator<RequestStackParamList>();

const RequestNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}
        >
            <Stack.Screen name="RequestTab" component={RequestTabNavigator} />
        </Stack.Navigator>
    );
};

export default RequestNavigator;
