import { ScreenWidth } from '@freakycoder/react-native-helpers';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet } from 'react-native';

interface Style {
    containerStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        containerStyle: {
            width: ScreenWidth * 0.9,
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
    });
};
