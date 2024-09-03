import { ScreenHeight } from '@freakycoder/react-native-helpers';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { StyleSheet, ViewStyle } from 'react-native';

interface Style {
    containerStyle: ViewStyle;
    tagContainerStyle: ViewStyle;
    buttonGroupStyle: ViewStyle;
    regUsersContainerStyle: ViewStyle;
    regUserItemContainer: ViewStyle;
    loadingContainerStyle: ViewStyle;
    emergencyMessageContainer: ViewStyle;
    strikeThroughStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        containerStyle: {
            backgroundColor: colors.background,
            maxHeight: ScreenHeight - 170,
        },
        tagContainerStyle: {
            marginRight: 8,
            marginBottom: 8,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderWidth: 1,
            borderColor: colors.primary,
            borderRadius: 40,
        },
        buttonGroupStyle: {
            marginBottom: 16,
        },
        regUsersContainerStyle: {
            minHeight: 200,
            overflow: 'scroll',
            position: 'relative',
        },
        regUserItemContainer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.dynamicWhite,
            marginBottom: 8,
            borderRadius: 8,
            padding: 8,
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
        emergencyMessageContainer: {
            position: 'absolute',
            width: '100%',
            maxHeight: ScreenHeight,
            backgroundColor: colors.background,
            borderRadius: 8,
            borderColor: colors.borderColor,
            borderWidth: 1,
            shadowColor: colors.shadow,
            shadowRadius: 8,
            shadowOpacity: 0.5,
            shadowOffset: {
                width: 0,
                height: 3,
            },
            padding: 16,
        },
        strikeThroughStyle: {
            textDecorationLine: 'line-through',
            textDecorationStyle: 'solid',
            textDecorationColor: colors.danger,
        },
    });
};
