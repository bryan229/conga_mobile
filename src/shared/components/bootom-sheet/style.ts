import { ExtendedTheme } from '@services/hooks/useTheme';
import { StyleSheet, ViewStyle } from 'react-native';
import { ScreenHeight, ScreenWidth } from '@freakycoder/react-native-helpers';

interface Style {
    container: ViewStyle;
    hideIconStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;

    return StyleSheet.create<Style>({
        container: {
            position: 'absolute',
            bottom: -20,
            left: -20,
            width: ScreenWidth,
            maxHeight: ScreenHeight,
            backgroundColor: colors.background,
            borderTopRightRadius: 16,
            borderTopLeftRadius: 16,
            borderColor: colors.borderColor,
            borderWidth: 1,
            shadowColor: colors.shadow,
            shadowRadius: 8,
            shadowOpacity: 0.3,
            shadowOffset: {
                width: 0,
                height: -3,
            },
            paddingHorizontal: 16,
            paddingBottom: 30,
            paddingTop: 0,
        },
        hideIconStyle: {
            alignSelf: 'center',
        },
    });
};
