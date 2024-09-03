import { ExtendedTheme } from '@services/hooks/useTheme';
import { StyleSheet, ViewStyle } from 'react-native';

interface Style {
    containerStyle: ViewStyle;
    sliderStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;

    return StyleSheet.create<Style>({
        containerStyle: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: 50,
            borderRadius: 50,
            backgroundColor: colors.background,
            borderColor: colors.borderColor,
            borderWidth: 1,
            paddingHorizontal: 16,
        },
        sliderStyle: {
            marginLeft: 8,
            flex: 1,
        },
    });
};
