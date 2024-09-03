import { ViewStyle, StyleSheet, TextStyle } from 'react-native';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { ScreenWidth, normalizeText } from '@freakycoder/react-native-helpers';

interface Style {
    containerStyle: ViewStyle;
    contentStyle: ViewStyle;
    loadingContainerStyle: ViewStyle;
    listContainerStyle: ViewStyle;
    listStyle: ViewStyle;
    bottomSheetStyle: ViewStyle;
    bottomSheetButtonGroupStyle: ViewStyle;
    bottomSheetButtonStyle: ViewStyle;
    bottomSheetButtonTextStyle: TextStyle;
    buttomSheetCancelButtonContainer: ViewStyle;
    bottomSheetCancelButtonStyle: ViewStyle;
    bottomSheetCancelButtonTextStyle: TextStyle;
    borderBottomStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        containerStyle: {
            backgroundColor: colors.background,
            flex: 1,
        },
        contentStyle: {
            flex: 1,
            position: 'relative',
        },
        listContainerStyle: {
            flex: 1,
            display: 'flex',
            paddingTop: 8,
        },
        listStyle: {
            flex: 1,
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
        borderBottomStyle: {
            borderBottomColor: colors.borderColor,
            borderBottomWidth: 1,
        },
    });
};
