import { ScreenWidth } from '@freakycoder/react-native-helpers';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet } from 'react-native';

interface Style {
    container: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        container: {
            padding: 8,
            marginVertical: 4,
            position: 'relative',
            borderWidth: 1,
            borderRadius: 8,
            marginHorizontal: 16,
            borderColor: colors.borderColor,
            backgroundColor: colors.dynamicBackground,
            overflow: 'hidden',
            maxWidth: ScreenWidth - 32,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
    });
};
