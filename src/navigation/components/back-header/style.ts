import { ViewStyle, StyleSheet, TextStyle } from 'react-native';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { ScreenWidth } from '@freakycoder/react-native-helpers';

interface Style {
    container: ViewStyle;
    titleContainerStyle: ViewStyle;
    backIconStyle: ViewStyle;
    titleStyle: TextStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        container: {
            backgroundColor: colors.headBar,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingTop: 40,
            minHeight: 100,
            width: ScreenWidth,
            zIndex: 10,
        },
        titleContainerStyle: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        backIconStyle: {
            paddingRight: 16,
            paddingVertical: 8,
        },
        titleStyle: {},
    });
};
