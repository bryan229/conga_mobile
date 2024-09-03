import { ViewStyle, StyleSheet } from 'react-native';

interface Style {
    containerStyle: ViewStyle;
    tabBarIconContainerStyle: ViewStyle;
    messageIconBadgeStyle: ViewStyle;
}

export default () => {
    return StyleSheet.create<Style>({
        containerStyle: {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        tabBarIconContainerStyle: {
            position: 'relative',
        },
        messageIconBadgeStyle: {
            position: 'absolute',
            top: -2,
            right: -2,
        },
    });
};
