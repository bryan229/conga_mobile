import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { normalizeText } from '@freakycoder/react-native-helpers';

interface Style {
    buttonStyle: ViewStyle;
    loadingStyle: ViewStyle;
    buttonTextStyle: TextStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        buttonStyle: {
            height: 45,
            borderRadius: 4,
            paddingHorizontal: 0,
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            backgroundColor: colors.primary,
        },
        buttonTextStyle: {
            textAlign: 'center',
            fontSize: normalizeText(12),
            color: colors.buttonText,
        },
        loadingStyle: {
            alignSelf: 'center',
        },
    });
};
