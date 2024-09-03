import { ScreenWidth } from '@freakycoder/react-native-helpers';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet } from 'react-native';

interface Style {
    container: ViewStyle;
    leftBubbleContainer: ViewStyle;
    rightBubbleContainer: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        container: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            marginBottom: 8,
        },
        rightBubbleContainer: {
            padding: 8,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            borderTopRightRadius: 16,
            marginRight: 4,
            backgroundColor: colors.primary,
            overflow: 'hidden',
            maxWidth: ScreenWidth - 96,
        },
        leftBubbleContainer: {
            padding: 8,
            borderWidth: 1,
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
            borderTopLeftRadius: 16,
            marginLeft: 4,
            borderColor: colors.borderColor,
            backgroundColor: colors.dynamicBackground,
            overflow: 'hidden',
            maxWidth: ScreenWidth - 96,
        },
    });
};
