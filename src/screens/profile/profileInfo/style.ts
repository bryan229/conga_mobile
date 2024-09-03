import { normalizeText } from '@freakycoder/react-native-helpers';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet, TextStyle } from 'react-native';
import { ImageStyle } from 'react-native-fast-image';

interface Style {
    containerStyle: ViewStyle;
    contentContainerStyle: ViewStyle;
    photoContainerStyle: ViewStyle;
    logoImageStyle: ImageStyle;
    controlStyle: ViewStyle;
    cameraTextStyle: TextStyle;
    rowContainerStyle: ViewStyle;
    colContainerStyle: ViewStyle;
    saveButtonStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        containerStyle: {
            flex: 1,
            backgroundColor: colors.background,
        },
        photoContainerStyle: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 16,
        },
        contentContainerStyle: {
            padding: 16,
        },
        logoImageStyle: {
            height: 100,
            width: 100,
            borderRadius: 50,
            borderColor: colors.borderColor,
            borderWidth: 1,
            marginRight: 16,
        },
        controlStyle: {
            marginBottom: 8,
        },
        cameraTextStyle: {
            fontSize: normalizeText(8),
        },
        rowContainerStyle: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        colContainerStyle: {
            flex: 1,
        },
        saveButtonStyle: {
            bottom: 40,
            right: 16,
        },
    });
};
