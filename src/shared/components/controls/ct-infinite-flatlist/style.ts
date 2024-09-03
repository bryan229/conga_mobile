import { ScreenWidth } from '@freakycoder/react-native-helpers';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

interface Style {
    container: ViewStyle;
    listStyle: ViewStyle;
    loadMoreTextStyle: TextStyle;
    loadingContainer: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        container: {
            flex: 1,
            position: 'relative',
            width: ScreenWidth,
        },
        listStyle: {
            flex: 1,
        },
        loadMoreTextStyle: {
            paddingVertical: 16,
        },
        loadingContainer: {
            position: 'absolute',
            zIndex: 1,
            elevation: 1,
            backgroundColor: colors.transparent,
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
};
