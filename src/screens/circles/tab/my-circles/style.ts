import { ScreenWidth } from '@freakycoder/react-native-helpers';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet } from 'react-native';

interface Style {
    containerStyle: ViewStyle;
    headerStyle: ViewStyle;
    listContainerStyle: ViewStyle;
    listStyle: ViewStyle;
    loadingContainerStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        containerStyle: {
            flex: 1,
            backgroundColor: colors.background,
        },
        headerStyle: {
            borderBottomColor: colors.borderColor,
            borderBottomWidth: 1,
        },
        listContainerStyle: {
            flex: 1,
            display: 'flex',
            position: 'relative',
        },
        listStyle: {
            flex: 1,
            paddingTop: 8,
            overflow: 'scroll',
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
    });
};