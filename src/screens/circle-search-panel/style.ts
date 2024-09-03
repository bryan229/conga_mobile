import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet } from 'react-native';

interface Style {
    containerStyle: ViewStyle;
    contentContainerStyle: ViewStyle;
    borderTopStyle: ViewStyle;
    borderBottomStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        containerStyle: {
            flex: 1,
            backgroundColor: colors.background,
        },
        contentContainerStyle: {
            padding: 16,
        },
        borderTopStyle: {
            borderTopColor: colors.borderColor,
            borderTopWidth: 1,
        },
        borderBottomStyle: {
            borderBottomColor: colors.borderColor,
            borderBottomWidth: 1,
        },
    });
};
