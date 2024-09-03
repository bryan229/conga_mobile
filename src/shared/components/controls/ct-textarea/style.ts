import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { normalizeText } from '@freakycoder/react-native-helpers';
import fonts from '@shared/theme/fonts';

interface Style {
    containerStyle: ViewStyle;
    labelTextStyle: TextStyle;
    textInputStyle: TextStyle;
    labelRequireStyle: TextStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        containerStyle: {
            display: 'flex',
        },
        labelTextStyle: {
            fontSize: normalizeText(10),
            marginBottom: 4,
        },
        labelRequireStyle: {
            fontSize: normalizeText(12),
            color: colors.danger,
        },
        textInputStyle: {
            fontSize: normalizeText(12),
            borderWidth: 1,
            borderColor: colors.ctrlBorderColor,
            borderRadius: 4,
            padding: 8,
            backgroundColor: colors.dynamicWhite,
            color: colors.text,
            fontFamily: fonts.montserrat.regular,
            minHeight: 100,
        },
    });
};
