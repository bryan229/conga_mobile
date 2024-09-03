import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet } from 'react-native';

interface Style {
    containerStyle: ViewStyle;
    headerStyle: ViewStyle;
    buttonGroupStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        containerStyle: {
            flex: 1,
            backgroundColor: colors.background,
        },
        headerStyle: {
            borderBottomColor: colors.borderColor,
            borderBottomWidth: 1,
        },
        buttonGroupStyle: {
            paddingHorizontal: 16,
            marginTop: 16,
        },
    });
};
