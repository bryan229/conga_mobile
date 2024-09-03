import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet } from 'react-native';

interface Style {
    container: ViewStyle;
    itemStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 8,
            zIndex: 3,
            backgroundColor: colors.dynamicWhite,
            borderBottomColor: colors.borderColor,
            borderBottomWidth: 1,
            minHeight: 50,
        },
        itemStyle: {
            borderColor: colors.borderColor,
            borderRadius: 8,
            borderWidth: 1,
            marginRight: 4,
            marginLeft: 4,
        },
    });
};
