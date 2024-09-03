import { normalizeText, ScreenWidth } from '@freakycoder/react-native-helpers';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet, TextStyle } from 'react-native';

interface Style {
    containerStyle: ViewStyle;
    menuContainerStyle: ViewStyle;
    headerStyle: ViewStyle;
    menuItemContainerStyle: ViewStyle;
    labelContainerStyle: ViewStyle;
    labelTextStyle: TextStyle;
    profileEmailTextStyle: TextStyle;
    descriptionTextStyle: TextStyle;
    borderBottomStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        containerStyle: {
            flex: 1,
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
        },
        menuContainerStyle: {
            flexGrow: 1,
            width: ScreenWidth,
        },
        headerStyle: {
            borderBottomColor: colors.borderColor,
            borderBottomWidth: 1,
        },
        menuItemContainerStyle: {
            backgroundColor: colors.dynamicBackground,
            paddingTop: 8,
            paddingBottom: 8,
            paddingRight: 8,
            paddingLeft: 16,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: 50,
        },
        labelContainerStyle: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        labelTextStyle: {
            fontSize: normalizeText(12),
        },
        profileEmailTextStyle: {
            fontSize: normalizeText(10),
            marginBottom: 4,
        },
        descriptionTextStyle: {
            fontSize: normalizeText(8),
        },
        borderBottomStyle: {
            borderBottomColor: colors.border,
            borderBottomWidth: 1,
        },
    });
};
