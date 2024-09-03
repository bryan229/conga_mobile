import { ScreenWidth } from '@freakycoder/react-native-helpers';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet } from 'react-native';

interface Style {
    container: ViewStyle;
    badgeContainer: ViewStyle;
    otherPlayerContainer: ViewStyle;
    otherPlayerBadgeContainer: ViewStyle;
    bgPrimary: ViewStyle;
    bgSeconday: ViewStyle;
    bgCalpyse: ViewStyle;
    bgPurple: ViewStyle;
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
        badgeContainer: {
            borderRadius: 12,
            backgroundColor: colors.primary,
            paddingVertical: 4,
            paddingHorizontal: 8,
        },
        otherPlayerContainer: {
            marginTop: 8,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
        },
        otherPlayerBadgeContainer: {
            borderRadius: 12,
            borderColor: colors.borderColor,
            borderWidth: 1,
            paddingVertical: 4,
            paddingHorizontal: 8,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 4,
        },
        bgPrimary: {
            backgroundColor: colors.primary,
        },
        bgSeconday: {
            backgroundColor: colors.secondary,
        },
        bgCalpyse: {
            backgroundColor: colors.calpyse,
        },
        bgPurple: {
            backgroundColor: colors.purple,
        },
    });
};
