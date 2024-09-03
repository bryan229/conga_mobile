import { ScreenWidth } from '@freakycoder/react-native-helpers';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet } from 'react-native';

interface Style {
    containerStyle: ViewStyle;
    listContainerStyle: ViewStyle;
    listStyle: ViewStyle;
    loadingContainerStyle: ViewStyle;
    itemContainer: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        containerStyle: {
            flex: 1,
            backgroundColor: colors.background,
            position: 'relative',
        },
        listContainerStyle: {
            flex: 1,
            display: 'flex',
            marginTop: 8,
        },
        listStyle: {
            flex: 1,
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
            zIndex: 10,
            elevation: 2,
            backgroundColor: colors.blackOverlay,
        },
        itemContainer: {
            padding: 16,
            marginVertical: 8,
            position: 'relative',
            borderWidth: 1,
            borderRadius: 8,
            borderColor: colors.borderColor,
            backgroundColor: colors.dynamicBackground,
            overflow: 'hidden',
            maxWidth: ScreenWidth / 2 - 24,
            flex: 1,
        },
    });
};
