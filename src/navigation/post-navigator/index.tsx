import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { PostStackParamList } from '@navigation/types';
import PostTabNavigator from './PostTabNavigator';

const Stack = createStackNavigator<PostStackParamList>();

const PostNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}
        >
            <Stack.Screen name="PostTab" component={PostTabNavigator} />
        </Stack.Navigator>
    );
};

export default PostNavigator;
