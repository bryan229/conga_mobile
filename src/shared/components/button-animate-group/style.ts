import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { normalizeText } from '@freakycoder/react-native-helpers';

interface Style {
    containerStyle: ViewStyle;
    buttonGroupStyle: ViewStyle;
    buttonStyle: ViewStyle;
    buttonTextStyle: TextStyle;
    animatedBgStyle: ViewStyle;
}

export default (theme: ExtendedTheme, buttonWidth: number) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        containerStyle: {
            borderColor: colors.borderColor,
            height: 45,
            borderRadius: 25,
            borderWidth: 1,
            padding: 2,
            backgroundColor: colors.dynamicWhite,
        },
        buttonGroupStyle: {
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            position: 'relative',
            justifyContent: 'space-around',
        },
        buttonStyle: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
        },
        buttonTextStyle: {
            fontSize: normalizeText(10),
        },
        animatedBgStyle: {
            position: 'absolute',
            top: 0,
            left: 0,
            height: 39,
            width: buttonWidth,
            borderRadius: 50,
            backgroundColor: colors.primary,
            zIndex: -1,
        },
    });
};
