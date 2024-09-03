import { normalizeText } from '@freakycoder/react-native-helpers';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet, TextStyle } from 'react-native';

interface Style {
    containerStyle: ViewStyle;
    avtsContainerStyle: ViewStyle;
    controlStyle: ViewStyle;
    cameraTextStyle: TextStyle;
    avtItemContainerStyle: ViewStyle;
    avtItemTextContainerStyle: ViewStyle;
    removeBtnContainerStyle: ViewStyle;
    dateTimeTextStyle: TextStyle;
    expireTextContainerStyle: ViewStyle;
    addNewBtnStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        containerStyle: {
            flex: 1,
            backgroundColor: colors.background,
            paddingTop: 16,
            paddingHorizontal: 16,
        },
        avtsContainerStyle: {
            flex: 1,
            overflow: 'scroll',
            marginBottom: 40,
        },
        avtItemContainerStyle: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.dynamicWhite,
            borderColor: colors.borderColor,
            borderWidth: 1,
            marginBottom: 8,
            borderRadius: 4,
        },
        avtItemTextContainerStyle: {
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 8,
        },
        controlStyle: {
            marginBottom: 8,
        },
        cameraTextStyle: {
            fontSize: normalizeText(8),
        },
        removeBtnContainerStyle: {
            backgroundColor: colors.danger,
            padding: 12,
            borderColor: colors.danger,
            borderWidth: 1,
            borderLeftWidth: 0,
            borderTopRightRadius: 4,
            borderBottomRightRadius: 4,
        },
        dateTimeTextStyle: {
            flex: 1,
        },
        expireTextContainerStyle: {
            display: 'flex',
            alignItems: 'center',
        },
        addNewBtnStyle: {
            backgroundColor: colors.secondary,
            marginTop: 16,
        },
    });
};
