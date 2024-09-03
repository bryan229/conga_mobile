import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { normalizeText } from '@freakycoder/react-native-helpers';

interface Style {
    labelTextStyle: TextStyle;
    labelRequireStyle: TextStyle;
    selectContainerStyle: ViewStyle;
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
            height: 45,
            borderRadius: 4,
            paddingHorizontal: 8,
            backgroundColor: colors.dynamicWhite,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        textStyle: {
            fontSize: normalizeText(12),
        },
    });
};
