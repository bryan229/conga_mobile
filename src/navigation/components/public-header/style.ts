import { ViewStyle, StyleSheet, TextStyle } from 'react-native';

import { ExtendedTheme } from '@services/hooks/useTheme';

interface Style {
    containerStyle: ViewStyle;
    titleStyle: TextStyle;
    modalContainerStyle: ViewStyle;
    modalBtnStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        containerStyle: {
            backgroundColor: colors.headBar,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingTop: 40,
            minHeight: 100,
            position: 'relative',
            zIndex: 100,
        },
        titleStyle: { flex: 1 },
        modalContainerStyle: {
            backgroundColor: colors.background,
            borderRadius: 16,
            marginHorizontal: 32,
            paddingVertical: 32,
        },
        modalBtnStyle: {
            paddingVertical: 14,
            backgroundColor: colors.dynamicWhite,
            borderColor: colors.borderColor,
            borderRadius: 8,
            borderWidth: 1,
            marginTop: 16,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
};
