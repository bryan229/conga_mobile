import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { normalizeText } from '@freakycoder/react-native-helpers';

interface Style {
    containerStyle: ViewStyle;
    labelTextStyle: TextStyle;
    labelRequireStyle: TextStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        containerStyle: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        labelTextStyle: {
            fontSize: normalizeText(10),
            flex: 1,
            flexWrap: 'wrap',
            marginLeft: 8,
        },
        labelRequireStyle: {
            fontSize: normalizeText(12),
            color: colors.danger,
        },
    });
};
