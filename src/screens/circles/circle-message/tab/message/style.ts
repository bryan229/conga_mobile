import { ScreenWidth, normalizeText } from '@freakycoder/react-native-helpers';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet, TextStyle } from 'react-native';

interface Style {
    containerStyle: ViewStyle;
    listContainerStyle: ViewStyle;
    listStyle: ViewStyle;
    loadingContainerStyle: ViewStyle;
    bottomSheetStyle: ViewStyle;
    bottomSheetButtonGroupStyle: ViewStyle;
    bottomSheetButtonStyle: ViewStyle;
    bottomSheetButtonTextStyle: TextStyle;
    buttomSheetCancelButtonContainer: ViewStyle;
    bottomSheetCancelButtonStyle: ViewStyle;
    bottomSheetCancelButtonTextStyle: TextStyle;
    borderBottom: ViewStyle;
    newMessageBtnContainer: ViewStyle;
    loadMoreContainer: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        containerStyle: {
            flex: 1,
            backgroundColor: colors.background,
        },
        listContainerStyle: {
            flex: 1,
            display: 'flex',
            position: 'relative',
        },
        listStyle: {
            flex: 1,
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
        bottomSheetStyle: {
            backgroundColor: colors.transparent,
            borderColor: colors.transparent,
            borderWidth: 0,
        },
        bottomSheetButtonGroupStyle: {
            borderRadius: 16,
            backgroundColor: colors.dynamicBackground,
            borderWidth: 1,
            borderColor: colors.borderColor,
            overflow: 'hidden',
        },
        bottomSheetButtonStyle: {
            paddingHorizontal: 16,
            paddingVertical: 12,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        bottomSheetButtonTextStyle: {
            fontSize: normalizeText(12),
            flex: 1,
            marginLeft: 32,
        },
        buttomSheetCancelButtonContainer: {
            marginTop: 8,
            borderRadius: 8,
            backgroundColor: colors.dynamicBackground,
            borderWidth: 1,
            borderColor: colors.borderColor,
            overflow: 'hidden',
        },
        bottomSheetCancelButtonStyle: {
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        bottomSheetCancelButtonTextStyle: {
            textAlign: 'center',
            fontSize: normalizeText(12),
        },
        borderBottom: {
            borderBottomColor: colors.borderColor,
            borderBottomWidth: 1,
        },
        newMessageBtnContainer: {
            backgroundColor: colors.dynamicBackground,
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 32,
            borderTopColor: colors.borderColor,
            borderTopWidth: 1,
        },
        loadMoreContainer: {
            marginHorizontal: 16,
            marginVertical: 8,
            padding: 8,
            backgroundColor: colors.dynamicWhite,
            borderRadius: 8,
        },
    });
};
