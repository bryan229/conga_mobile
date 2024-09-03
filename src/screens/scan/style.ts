import { ViewStyle, StyleSheet } from 'react-native';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { ScreenWidth } from '@freakycoder/react-native-helpers';

interface Style {
    backHeaderStyle: ViewStyle;
    backIconStyle: ViewStyle;
    containerStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        backHeaderStyle: {
            position: 'absolute',
            top: 30,
            left: 0,
            width: ScreenWidth,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            backgroundColor: colors.transparent,
            paddingHorizontal: 16,
            zIndex: 1,
            elevation: 1,
        },
        backIconStyle: {
            paddingHorizontal: 8,
            paddingVertical: 8,
        },
        containerStyle: {
            flex: 1,
            backgroundColor: colors.black,
        },
    });
};
