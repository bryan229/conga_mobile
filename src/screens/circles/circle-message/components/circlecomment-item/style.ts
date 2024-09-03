import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet } from 'react-native';

interface Style {
    container: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const {} = theme;
    return StyleSheet.create<Style>({
        container: {
            overflow: 'hidden',
            marginTop: 16,
        },
    });
};
