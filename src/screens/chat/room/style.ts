import { ScreenWidth, normalizeText } from '@freakycoder/react-native-helpers';
import { ExtendedTheme } from '@services/hooks/useTheme';
import fonts from '@shared/theme/fonts';
import { ViewStyle, StyleSheet } from 'react-native';

interface Style {
    containerStyle: ViewStyle;
    headerStyle: ViewStyle;
    listContainerStyle: ViewStyle;
    listStyle: ViewStyle;
    loadingContainerStyle: ViewStyle;
    messageBoxContainer: ViewStyle;
    messageTextStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        containerStyle: {
            flex: 1,
            backgroundColor: colors.background,
        },
        headerStyle: {
            borderBottomColor: colors.borderColor,
            borderBottomWidth: 1,
        },
        listContainerStyle: {
            flex: 1,
            display: 'flex',
            position: 'relative',
        },
        listStyle: {
            flex: 1,
            paddingTop: 8,
            overflow: 'scroll',
        },
        loadingContainerStyle: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: ScreenWidth,
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2,
            elevation: 2,
            backgroundColor: colors.blackOverlay,
        },
        messageBoxContainer: {
            padding: 16,
            paddingBottom: 36,
            backgroundColor: colors.dynamicBackground,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            borderTopColor: colors.borderColor,
            borderTopWidth: 1,
        },
        messageTextStyle: {
            fontSize: normalizeText(12),
            borderWidth: 1,
            borderColor: colors.ctrlBorderColor,
            height: 45,
            borderRadius: 4,
            paddingHorizontal: 8,
            backgroundColor: colors.dynamicWhite,
            color: colors.text,
            fontFamily: fonts.montserrat.regular,
            flex: 1,
            paddingTop: 10,
            maxHeight: 150,
        },
    });
};
