import { ViewStyle, StyleSheet } from 'react-native';
import { ExtendedTheme } from '@services/hooks/useTheme';

interface Style {
    container: ViewStyle;
    loadingContainer: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        container: {
            backgroundColor: colors.background,
            borderRadius: 16,
            height: 200,
            padding: 16,
            position: 'relative',
        },
        loadingContainer: {
            paddingTop: 16,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
};
