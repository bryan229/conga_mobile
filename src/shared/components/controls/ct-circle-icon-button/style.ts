import { StyleSheet, ViewStyle } from 'react-native';
import { ExtendedTheme } from '@services/hooks/useTheme';

interface Style {
    buttonStyle: ViewStyle;
}

export default (theme: ExtendedTheme, size: number, color?: string) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        buttonStyle: {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color || colors.white,
            shadowColor: colors.shadow,
            shadowRadius: 5,
            shadowOpacity: 0.7,
            shadowOffset: {
                width: 0,
                height: 3,
            },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
};
