import { normalizeText, ScreenHeight, ScreenWidth } from '@freakycoder/react-native-helpers';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet, TextStyle } from 'react-native';

interface Style {
    container: ViewStyle;
    contentContainerStyle: ViewStyle;
    optionContainerStyle: ViewStyle;
    optionStyle: ViewStyle;
    optionTextStyle: TextStyle;
    backDropStyle: ViewStyle;
    buttonContainerStyle: ViewStyle;
    controlButtonStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        container: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: ScreenWidth,
            backgroundColor: colors.dynamicBackground,
            borderBottomRightRadius: 3,
            borderBottomLeftRadius: 3,
            borderBottomColor: colors.borderColor,
            borderBottomWidth: 1,
            borderRightColor: colors.borderColor,
            borderRightWidth: 1,
            borderLeftColor: colors.borderColor,
            borderLeftWidth: 1,
            // shadowColor: colors.shadow,
            // shadowRadius: 2,
            // shadowOpacity: 0.2,
            // shadowOffset: {
            //     width: 0,
            //     height: 2,
            // },
            zIndex: 3,
            // elevation: 3,
        },
        backDropStyle: {
            position: 'absolute',
            backgroundColor: colors.black,
            opacity: 0.1,
            top: 0,
            left: 0,
            zIndex: 2,
            elevation: 2,
            width: ScreenWidth,
            height: ScreenHeight,
        },
        contentContainerStyle: {
            padding: 8,
        },
        buttonContainerStyle: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
        controlButtonStyle: {
            marginLeft: 16,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
        },
        optionContainerStyle: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        optionStyle: {
            paddingHorizontal: 8,
            paddingVertical: 12,
            borderColor: colors.borderColor,
            borderRadius: 4,
            borderWidth: 1,
            margin: 4,
        },
        optionTextStyle: {
            fontSize: normalizeText(9),
        },
    });
};
