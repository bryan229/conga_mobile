import { ViewStyle, StyleSheet } from 'react-native';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { ScreenWidth } from '@freakycoder/react-native-helpers';

interface Style {
    containerStyle: ViewStyle;
    contentStyle: ViewStyle;
    loadingContainerStyle: ViewStyle;
    listContainerStyle: ViewStyle;
    itemContainerStyle: ViewStyle;
    congaBadgeStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        containerStyle: {
            backgroundColor: colors.background,
            flex: 1,
        },
        contentStyle: {
            flex: 1,
            position: 'relative',
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
            display: 'flex',
            flex: 1,
            overflow: 'scroll',
            paddingTop: 8,
        },
        itemContainerStyle: {
            padding: 16,
            marginVertical: 8,
            borderWidth: 1,
            borderRadius: 8,
            marginHorizontal: 16,
            borderColor: colors.borderColor,
            backgroundColor: colors.dynamicBackground,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        congaBadgeStyle: {
            marginHorizontal: 16,
            marginTop: 16,
            padding: 16,
            backgroundColor: colors.secondary,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
    });
};
