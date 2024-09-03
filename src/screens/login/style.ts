import { ViewStyle, StyleSheet, TextStyle, ImageStyle } from 'react-native';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { ScreenWidth } from '@freakycoder/react-native-helpers';

interface Style {
    backBtnContainer: ViewStyle;
    container: ViewStyle;
    titleTextStyle: TextStyle;
    logoStyle: ImageStyle;
    contentContainer: ViewStyle;
    emailTextFieldStyle: ViewStyle;
    regDescriptionTextStyle: TextStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        backBtnContainer: {
            position: 'absolute',
            top: 60,
            left: 16,
        },
        container: {
            flex: 1,
            alignItems: 'center',
            backgroundColor: colors.background,
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
        },
        logoStyle: {
            alignSelf: 'center',
            width: ScreenWidth * 0.4,
            height: ScreenWidth * 0.4,
        },
        titleTextStyle: {
            marginBottom: 30,
        },
        contentContainer: {
            width: ScreenWidth * 0.85,
            maxWidth: 1000,
            marginBottom: 32,
        },
        emailTextFieldStyle: {
            marginBottom: 16,
        },
        regDescriptionTextStyle: {
            marginTop: 16,
            marginBottom: 8,
        },
    });
};
