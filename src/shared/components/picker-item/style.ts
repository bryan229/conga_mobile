import { ExtendedTheme } from '@services/hooks/useTheme';
import { StyleSheet, ViewStyle } from 'react-native';

interface Style {
    container: ViewStyle;
    iconStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;

    return StyleSheet.create<Style>({
        container: {
            paddingVertical: 10,
            paddingHorizontal: 16,
            backgroundColor: colors.transparent,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        iconStyle: {
            marginLeft: 8,
        },
    });
};
