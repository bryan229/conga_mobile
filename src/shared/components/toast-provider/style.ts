import { ViewStyle, StyleSheet, TextStyle } from 'react-native';
import { ExtendedTheme } from '@services/hooks/useTheme';

interface Style {
    container: ViewStyle;
    successContainer: ViewStyle;
    errorContainer: ViewStyle;
    warningContainer: ViewStyle;
    infoContainer: ViewStyle;
    titleTextStyle: TextStyle;
    messageTextStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        container: {
            maxWidth: '85%',
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: '#fff',
            shadowOffset: { width: 2, height: 2 },
            shadowColor: colors.shadow,
            shadowOpacity: 0.2,
            marginVertical: 4,
            borderRadius: 8,
            borderLeftWidth: 6,
            justifyContent: 'center',
            paddingLeft: 16,
        },
        successContainer: {
            borderColor: '#059669',
        },
        errorContainer: {
            borderColor: '#d0021b',
        },
        warningContainer: {
            borderColor: '#ff6a00',
        },
        infoContainer: {
            borderColor: '#2b7488',
        },
        titleTextStyle: {
            fontSize: 14,
            fontWeight: 'bold',
        },
        messageTextStyle: {
            marginTop: 2,
        },
    });
};
