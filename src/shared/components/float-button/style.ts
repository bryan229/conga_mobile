import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet } from 'react-native';

interface Style {
    container: ViewStyle;
    mainCircleContainer: ViewStyle;
    circleContainer: ViewStyle;
    circleContent: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        container: {},
        mainCircleContainer: {
            backgroundColor: colors.primary,
            width: 60,
            height: 60,
            position: 'absolute',
            bottom: 100,
            right: 16,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
        },
        circleContainer: {
            backgroundColor: colors.dynamicWhite,
            borderColor: colors.primary,
            borderWidth: 1,
            width: 60,
            height: 60,
            position: 'absolute',
            bottom: 100,
            right: 16,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
        },
        circleContent: {
            display: 'flex',
            alignItems: 'center',
        },
    });
};
