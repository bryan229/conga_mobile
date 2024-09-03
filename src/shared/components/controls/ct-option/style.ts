import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { normalizeText } from '@freakycoder/react-native-helpers';

interface Style {
    labelTextStyle: TextStyle;
    optionContainerStyle: ViewStyle;
    optionButtonContainerStyle: ViewStyle;
    optionTextStyle: TextStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        labelTextStyle: {
            fontSize: normalizeText(10),
            marginBottom: 4,
        },
        optionContainerStyle: {
            display: 'flex',
            flexDirection: 'row',
        },
        optionButtonContainerStyle: {
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            height: 45,
            borderWidth: 1,
            borderColor: colors.borderColor,
            borderRadius: 4,
            paddingHorizontal: 8,
            backgroundColor: colors.dynamicWhite,
        },
        optionTextStyle: {
            textAlign: 'center',
            fontSize: normalizeText(10),
            marginLeft: 8,
        },
    });
};
