import { ExtendedTheme } from '@services/hooks/useTheme';
import { StyleSheet, ViewStyle } from 'react-native';

interface Style {
    containerStyle: ViewStyle;
    tagContainerStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        containerStyle: {
            backgroundColor: colors.background,
            padding: 16,
        },
        tagContainerStyle: {
            marginRight: 8,
            marginBottom: 8,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderWidth: 1,
            borderColor: colors.primary,
            borderRadius: 40,
        },
    });
};
