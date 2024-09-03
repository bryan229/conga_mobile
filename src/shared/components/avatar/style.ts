import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { normalizeText } from '@freakycoder/react-native-helpers';
import { ImageStyle } from 'react-native-fast-image';

interface Style {
    defaultPhotoContainer: ViewStyle;
    defaultPhotoText: TextStyle;
    photoImageStyle: ImageStyle;
}

export default (theme: ExtendedTheme, size: number) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        defaultPhotoContainer: {
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
        defaultPhotoText: {
            fontSize: normalizeText(size / 2),
            textTransform: 'capitalize',
        },
        photoImageStyle: {
            height: size,
            width: size,
            borderRadius: size / 2,
            borderColor: colors.borderColor,
            borderWidth: 1,
        },
    });
};
