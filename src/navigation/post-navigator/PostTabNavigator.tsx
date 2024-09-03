import React from 'react';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from '@services/hooks/useTheme';
import { StackScreenProps } from '@react-navigation/stack';
import { PostStackParamList, PostTabStackParamList } from '@navigation/types';
import BackHeader from '@navigation/components/back-header';
import CTText from '@shared/components/controls/ct-text';
import { useAppSelector } from '@store/hook';
import { StyleSheet } from 'react-native';
import PostsScreen from '@screens/posts/tabs/list';
import MyPostsScreen from '@screens/posts/tabs/myposts';

export type PostTabNavigatorProps = StackScreenProps<PostStackParamList, 'PostTab'>;
const Tab = createMaterialTopTabNavigator<PostTabStackParamList>();

const PostTabNavigator: React.FC<PostTabNavigatorProps> = () => {
    const user = useAppSelector((state) => state.auth.user!);
    const theme = useTheme();
    const { colors } = theme;

    const renderTabIcon = (route: any, focused: boolean, color: string) => {
        let iconName: string = 'home';
        switch (route.name) {
            case 'Posts':
                iconName = focused ? 'megaphone' : 'megaphone-outline';
                break;
            case 'MyPosts':
                iconName = focused ? 'newspaper' : 'newspaper-outline';
                break;
            default:
                iconName = focused ? 'megaphone' : 'megaphone-outline';
                break;
        }
        return <Icon name={iconName} type={IconType.Ionicons} size={20} color={color} />;
    };

    const renderTabLabel = (route: any, focused: boolean) => {
        switch (route.name) {
            case 'Posts':
                return (
                    <CTText color={focused ? colors.primary : 'gray'} style={style.topTabLabelStyle}>
                        Talk to Mgmt
                    </CTText>
                );
            case 'MyPosts':
                return (
                    <CTText color={focused ? colors.primary : 'gray'} style={style.topTabLabelStyle}>
                        My Posts
                    </CTText>
                );
            default:
                return <CTText>Posts</CTText>;
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
                <Tab.Screen name="Posts" component={PostsScreen} />
                <Tab.Screen name="MyPosts" component={MyPostsScreen} />
            </Tab.Navigator>
        );
    };

    return (
        <>
            <BackHeader title="Posts" />
            {renderContent()}
        </>
    );
};

export default PostTabNavigator;

const style = StyleSheet.create({
    topTabLabelStyle: {
        fontSize: 12,
    },
});
