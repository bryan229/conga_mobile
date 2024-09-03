import { ScreenWidth } from '@freakycoder/react-native-helpers';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet } from 'react-native';

interface Style {
    itemContainerStyle: ViewStyle;
    closeBtnStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        itemContainerStyle: {
            padding: 16,
            marginVertical: 4,
            borderWidth: 1,
            borderRadius: 8,
            marginHorizontal: 16,
            borderColor: colors.borderColor,
            backgroundColor: colors.dynamicBackground,
            overflow: 'hidden',
            maxWidth: ScreenWidth - 32,
        },

        closeBtnStyle: {
            position: 'absolute',
            right: 0,
            top: 0,
            width: 50,
            height: 50,
            padding: 10,
            zIndex: 1,
        },
    });
};
