import { ExtendedTheme } from '@services/hooks/useTheme';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { ScreenWidth } from '@freakycoder/react-native-helpers';

interface Style {
    containerStyle: ViewStyle;
    alertContainerStyle: ViewStyle;
    messageContainerStyle: ViewStyle;
    titleStyle: TextStyle;
    buttonContainerStyle: ViewStyle;
    normalButtonStyle: ViewStyle;
    dangerButtonStyle: ViewStyle;
    cancelButtonStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;

    return StyleSheet.create<Style>({
        containerStyle: {
            width: ScreenWidth * 0.9,
            maxWidth: 500,
            alignSelf: 'center',
            backgroundColor: colors.background,
            borderRadius: 8,
            borderColor: colors.borderColor,
            borderWidth: 1,
            shadowColor: colors.shadow,
            shadowRadius: 5,
            shadowOpacity: 0.7,
            shadowOffset: {
                width: 0,
                height: 3,
            },
        },
        alertContainerStyle: {
            marginLeft: 8,
            padding: 16,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
        },
        messageContainerStyle: {
            flex: 1,
            marginLeft: 8,
        },
        titleStyle: {
            paddingVertical: 4,
        },
        buttonContainerStyle: {
            paddingVertical: 8,
            paddingHorizontal: 8,
            display: 'flex',
            flexDirection: 'row-reverse',
            justifyContent: 'flex-start',
            alignItems: 'center',
            backgroundColor: colors.separator,
            borderBottomRightRadius: 8,
            borderBottomLeftRadius: 8,
        },
        normalButtonStyle: {
            paddingVertical: 4,
            paddingHorizontal: 24,
        },
        dangerButtonStyle: {
            paddingVertical: 4,
            paddingHorizontal: 24,
        },
        cancelButtonStyle: {
            paddingVertical: 4,
            paddingHorizontal: 24,
        },
    });
};
