import { normalizeText } from '@freakycoder/react-native-helpers';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet, TextStyle } from 'react-native';

interface Style {
    containerStyle: ViewStyle;
    headerStyle: ViewStyle;
    contentContainerStyle: ViewStyle;
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
            flex: 1,
            backgroundColor: colors.background,
        },
        headerStyle: {
            borderBottomColor: colors.borderColor,
            borderBottomWidth: 1,
        },
        contentContainerStyle: {
            padding: 16,
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
