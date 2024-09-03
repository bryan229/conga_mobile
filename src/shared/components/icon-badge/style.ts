import { normalizeText } from '@freakycoder/react-native-helpers';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet, TextStyle } from 'react-native';

interface Style {
    container: ViewStyle;
    badgeTextStyle: TextStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        container: {
            backgroundColor: colors.danger,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        badgeTextStyle: {
            fontSize: normalizeText(7),
        },
    });
};
