import { StyleSheet, TextStyle } from 'react-native';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { normalizeText } from '@freakycoder/react-native-helpers';
import fonts from '@shared/theme/fonts';

interface Style {
    labelTextStyle: TextStyle;
    textInputStyle: TextStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        labelTextStyle: {
            fontSize: normalizeText(10),
            marginBottom: 4,
        },
        textInputStyle: {
            fontSize: normalizeText(12),
            borderWidth: 1,
            borderColor: colors.ctrlBorderColor,
            height: 45,
            borderRadius: 4,
            paddingHorizontal: 8,
            backgroundColor: colors.dynamicWhite,
            color: colors.text,
            fontFamily: fonts.montserrat.regular,
        },
    });
};
