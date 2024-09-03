import { ExtendedTheme } from '@services/hooks/useTheme';
import { StyleSheet, ViewStyle } from 'react-native';
import { ScreenWidth } from '@freakycoder/react-native-helpers';

interface Style {
    container: ViewStyle;
    hideIconStyle: ViewStyle;
    listStyle: ViewStyle;
    searchFieldStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;

    return StyleSheet.create<Style>({
        container: {
            position: 'absolute',
            bottom: -20,
            left: -20,
            width: ScreenWidth,
            maxHeight: 500,
            backgroundColor: colors.background,
            borderTopRightRadius: 16,
            borderTopLeftRadius: 16,
            borderColor: colors.borderColor,
            borderWidth: 1,
            shadowColor: colors.shadow,
            shadowRadius: 8,
            shadowOpacity: 0.3,
            shadowOffset: {
                width: 0,
                height: -3,
            },
            padding: 16,
            paddingTop: 0,
        },
        listStyle: {
            marginBottom: 20,
        },
        hideIconStyle: {
            alignSelf: 'center',
        },
        searchFieldStyle: {
            paddingHorizontal: 16,
            paddingVertical: 10,
            color: colors.text,
            borderColor: colors.borderColor,
            borderWidth: 1,
            marginBottom: 16,
            borderRadius: 8,
        },
    });
};
