import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { normalizeText } from '@freakycoder/react-native-helpers';

interface Style {
    labelTextStyle: TextStyle;
    labelRequireStyle: TextStyle;
    selectContainerStyle: ViewStyle;
    multiValueStyle: ViewStyle;
    placeholderTextStyle: TextStyle;
    textStyle: TextStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        labelTextStyle: {
            fontSize: normalizeText(10),
            marginBottom: 4,
        },
        labelRequireStyle: {
            fontSize: normalizeText(12),
            color: colors.danger,
        },
        selectContainerStyle: {
            borderWidth: 1,
            borderColor: colors.ctrlBorderColor,
            borderRadius: 4,
            paddingHorizontal: 8,
            paddingVertical: 4,
            backgroundColor: colors.dynamicWhite,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        multiValueStyle: {
            paddingHorizontal: 8,
            paddingVertical: 5,
            borderWidth: 1,
            borderRadius: 30,
            borderColor: colors.borderColor,
            backgroundColor: colors.background,
            margin: 4,
        },
        textStyle: {
            fontSize: normalizeText(12),
        },
        placeholderTextStyle: {
            paddingVertical: 10,
        },
    });
};
