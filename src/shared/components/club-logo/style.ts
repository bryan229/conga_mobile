import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { normalizeText } from '@freakycoder/react-native-helpers';
import { ImageStyle } from 'react-native-fast-image';

interface Style {
    defaultLogoContainer: ViewStyle;
    defaultLogoText: TextStyle;
    logoImageStyle: ImageStyle;
}

export default (theme: ExtendedTheme, size: number) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        defaultLogoContainer: {
            backgroundColor: colors.calpyse,
            height: size,
            width: size,
            borderRadius: size / 2,
            borderColor: colors.borderColor,
            borderWidth: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        defaultLogoText: {
            fontSize: normalizeText(size / 2),
            textTransform: 'capitalize',
        },
        logoImageStyle: {
            height: size,
            width: size,
            borderRadius: size / 2,
            borderColor: colors.primary,
            borderWidth: 1,
            backgroundColor: colors.dynamicWhite,
        },
    });
};
