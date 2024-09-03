import { ScreenWidth } from '@freakycoder/react-native-helpers';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet } from 'react-native';

interface Style {
    containerStyle: ViewStyle;
    headerStyle: ViewStyle;
    contentContainerStyle: ViewStyle;
    contentStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        containerStyle: {
            flex: 1,
            backgroundColor: colors.dynamicWhite,
        },
        headerStyle: {
            borderBottomColor: colors.borderColor,
            borderBottomWidth: 1,
        },
        contentContainerStyle: {
            flex: 1,
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
        },
        contentStyle: {
            width: ScreenWidth * 0.85,
            maxWidth: 1000,
            marginBottom: 64,
        },
    });
};
