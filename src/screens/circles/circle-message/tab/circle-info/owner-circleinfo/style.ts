import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet } from 'react-native';

interface Style {
    circleInfoContainerStyle: ViewStyle;
    addressContainerStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        circleInfoContainerStyle: {
            paddingTop: 16,
            paddingHorizontal: 16,
        },
        addressContainerStyle: {
            borderRadius: 8,
            padding: 8,
            borderWidth: 1,
            borderColor: colors.borderColor,
            marginBottom: 8,
        },
    });
};
