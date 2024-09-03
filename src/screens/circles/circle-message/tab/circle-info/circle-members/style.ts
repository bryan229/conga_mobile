import { ScreenWidth, normalizeText } from '@freakycoder/react-native-helpers';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet, TextStyle } from 'react-native';

interface Style {
    containerStyle: ViewStyle;
    inviteBtnStyle: ViewStyle;
    listContainerStyle: ViewStyle;
    listStyle: ViewStyle;
    buttonGroupStyle: ViewStyle;
    bottomSheetStyle: ViewStyle;
    bottomSheetButtonGroupStyle: ViewStyle;
    bottomSheetButtonStyle: ViewStyle;
    bottomSheetButtonTextStyle: TextStyle;
    buttomSheetCancelButtonContainer: ViewStyle;
    bottomSheetCancelButtonStyle: ViewStyle;
    bottomSheetCancelButtonTextStyle: TextStyle;
    borderBottom: ViewStyle;
    loadingContainerStyle: ViewStyle;
    searchMemberModalContainer: ViewStyle;
    searchMemberContentStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        containerStyle: {
            paddingHorizontal: 16,
            flex: 1,
        },
        inviteBtnStyle: {
            backgroundColor: colors.dynamicWhite,
            borderColor: colors.borderColor,
            borderRadius: 8,
            borderWidth: 1,
            paddingVertical: 16,
            marginTop: 8,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
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
        buttonGroupStyle: {
            paddingHorizontal: 16,
            marginTop: 16,
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
        searchMemberModalContainer: {
            width: ScreenWidth * 0.9,
            maxWidth: 500,
            height: 500,
            alignSelf: 'center',
            backgroundColor: colors.background,
            borderRadius: 8,
            borderColor: colors.borderColor,
            borderWidth: 1,
            shadowColor: colors.shadow,
            shadowRadius: 5,
            shadowOpacity: 0.7,
            shadowOffset: {
                width: 0,
                height: 3,
            },
            padding: 16,
        },
        searchMemberContentStyle: {
            flex: 1,
        },
    });
};
