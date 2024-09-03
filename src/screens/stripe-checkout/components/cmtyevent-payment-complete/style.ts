import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet } from 'react-native';

interface Style {
    containerStyle: ViewStyle;
    titleContainerStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        containerStyle: {
            flex: 1,
            backgroundColor: colors.background,
            paddingHorizontal: 16,
        },
        titleContainerStyle: {
            height: 100,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
};
