import { ViewStyle, StyleSheet } from 'react-native';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { ScreenWidth } from '@freakycoder/react-native-helpers';

interface Style {
    containerStyle: ViewStyle;
    loadingContainerStyle: ViewStyle;
    listContainerStyle: ViewStyle;
    listStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        containerStyle: {
            flex: 1,
            backgroundColor: colors.background,
        },
        loadingContainerStyle: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: ScreenWidth,
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2,
            elevation: 2,
            backgroundColor: colors.blackOverlay,
        },
        listContainerStyle: {
            flex: 1,
            display: 'flex',
        },
        listStyle: {
            flex: 1,
        },
    });
};
