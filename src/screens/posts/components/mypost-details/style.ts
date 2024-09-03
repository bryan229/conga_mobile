import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet } from 'react-native';

interface Style {
    container: ViewStyle;
    titleContainer: ViewStyle;
    badgeContainer: ViewStyle;
    contentContainer: ViewStyle;
    loadingContainerStyle: ViewStyle;
    listContainerStyle: ViewStyle;
    listStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        container: {
            position: 'relative',
        },
        titleContainer: {
            flex: 1,
            flexWrap: 'wrap',
        },
        badgeContainer: {
            borderRadius: 12,
            borderColor: colors.primary,
            borderWidth: 1,
            paddingVertical: 4,
            paddingHorizontal: 8,
            flexShrink: 0,
            marginLeft: 8,
        },
        contentContainer: {
            borderRadius: 12,
            borderColor: colors.borderColor,
            borderWidth: 1,
            padding: 8,
            marginBottom: 8,
        },
        loadingContainerStyle: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
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
            position: 'relative',
        },
        listStyle: {
            flex: 1,
        },
    });
};
