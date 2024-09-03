import { ScreenHeight, ScreenWidth } from '@freakycoder/react-native-helpers';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet } from 'react-native';

interface Style {
    container: ViewStyle;
    otherPlayerContainers: ViewStyle;
    searchMemberModalContainer: ViewStyle;
    searchMemberContentStyle: ViewStyle;
    otherPlayerItemContainer: ViewStyle;
    otherPlayerContainer: ViewStyle;
    otherPlayerBadgeContainer: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        container: {
            backgroundColor: colors.background,
            maxHeight: ScreenHeight - 170,
        },
        otherPlayerContainers: {
            borderColor: colors.borderColor,
            borderWidth: 1,
            borderRadius: 8,
            padding: 16,
        },
        searchMemberModalContainer: {
            width: ScreenWidth * 0.9,
            maxWidth: 500,
            height: 500,
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
            padding: 16,
        },
        searchMemberContentStyle: {
            flex: 1,
        },
        otherPlayerItemContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderColor: colors.borderColor,
            borderRadius: 8,
            padding: 8,
            borderWidth: 1,
            marginTop: 8,
        },
        otherPlayerContainer: {
            marginTop: 8,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
        },
        otherPlayerBadgeContainer: {
            borderRadius: 16,
            borderColor: colors.borderColor,
            borderWidth: 1,
            paddingVertical: 4,
            paddingHorizontal: 8,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 4,
        },
    });
};
