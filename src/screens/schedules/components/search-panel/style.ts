import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet } from 'react-native';

interface Style {
    container: ViewStyle;
    dropPanelWrapperStyle: ViewStyle;
    pickerItemStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        container: {
            position: 'relative',
            zIndex: 2,
        },
        dropPanelWrapperStyle: {
            position: 'relative',
        },
        pickerItemStyle: {
            paddingVertical: 10,
            paddingHorizontal: 16,
            backgroundColor: colors.transparent,
        },
    });
};
