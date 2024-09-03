import { ScreenWidth } from '@freakycoder/react-native-helpers';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet } from 'react-native';

interface Style {
    container: ViewStyle;
    avatarContainer: ViewStyle;
    unReadBadgeStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        container: {
            padding: 8,
            marginBottom: 8,
            position: 'relative',
            borderWidth: 1,
            borderRadius: 8,
            marginHorizontal: 16,
            borderColor: colors.borderColor,
            backgroundColor: colors.dynamicBackground,
            overflow: 'hidden',
            maxWidth: ScreenWidth - 32,
        },
        avatarContainer: {
            flexShrink: 0,
            position: 'relative',
        },
        unReadBadgeStyle: {
            position: 'absolute',
            height: 10,
            width: 10,
            backgroundColor: colors.danger,
            borderRadius: 10,
            top: 0,
            right: 0,
        },
    });
};
