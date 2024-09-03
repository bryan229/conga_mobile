import { ScreenWidth } from '@freakycoder/react-native-helpers';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet } from 'react-native';

interface Style {
    container: ViewStyle;
    titleContainer: ViewStyle;
    badgeContainer: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        container: {
            padding: 16,
            marginVertical: 8,
            position: 'relative',
            borderWidth: 1,
            borderRadius: 8,
            marginHorizontal: 16,
            borderColor: colors.borderColor,
            backgroundColor: colors.dynamicBackground,
            overflow: 'hidden',
            maxWidth: ScreenWidth - 32,
        },
        titleContainer: {
            flex: 1,
            flexWrap: 'wrap',
        },
        badgeContainer: {
            borderRadius: 12,
            borderColor: colors.primary,
            borderWidth: 1,
            paddingVertical: 4,
            paddingHorizontal: 8,
            flexShrink: 0,
        },
    });
};
