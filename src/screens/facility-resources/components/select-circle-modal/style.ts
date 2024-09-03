import { ViewStyle, StyleSheet } from 'react-native';
import { ExtendedTheme } from '@services/hooks/useTheme';

interface Style {
    container: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        container: {
            backgroundColor: colors.background,
            borderRadius: 16,
        },
    });
};
