import { normalizeText, ScreenWidth } from '@freakycoder/react-native-helpers';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet, TextStyle } from 'react-native';

interface Style {
    container: ViewStyle;
    menuContainer: ViewStyle;
    textStyle: TextStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        container: {
            maxWidth: ScreenWidth,
            height: 50,
        },
        menuContainer: {
            backgroundColor: colors.background,
            borderBottomColor: colors.borderColor,
            borderBottomWidth: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            minWidth: ScreenWidth,
        },
        textStyle: {
            fontSize: normalizeText(9),
            paddingHorizontal: 16,
            paddingVertical: 8,
        },
    });
};
