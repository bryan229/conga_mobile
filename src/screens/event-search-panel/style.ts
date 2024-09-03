import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet } from 'react-native';

interface Style {
    containerStyle: ViewStyle;
    contentContainerStyle: ViewStyle;
    itemContainterStyle: ViewStyle;
    itemStyle: ViewStyle;
    selectedItemStyle: ViewStyle;
    borderTopStyle: ViewStyle;
    borderBottomStyle: ViewStyle;
    zipCodeInputTextStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        containerStyle: {
            flex: 1,
            backgroundColor: colors.background,
        },
        contentContainerStyle: {
            padding: 16,
        },
        itemContainterStyle: {
            flexDirection: 'row',
            paddingBottom: 8,
            alignItems: 'center',
            flexWrap: 'wrap',
        },
        itemStyle: {
            borderColor: colors.borderColor,
            borderRadius: 8,
            borderWidth: 1,
            marginRight: 4,
            marginLeft: 4,
        },
        selectedItemStyle: {
            borderRadius: 8,
            marginRight: 4,
            marginLeft: 4,
            backgroundColor: colors.primary,
            marginBottom: 8,
        },
        borderTopStyle: {
            borderTopColor: colors.borderColor,
            borderTopWidth: 1,
        },
        borderBottomStyle: {
            borderBottomColor: colors.borderColor,
            borderBottomWidth: 1,
        },
        zipCodeInputTextStyle: {
            flex: 1,
            flexGrow: 1,
            marginLeft: 4,
            height: 30,
        },
    });
};
