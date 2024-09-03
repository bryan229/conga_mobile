import { ViewStyle, StyleSheet } from 'react-native';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { normalizeText } from '@freakycoder/react-native-helpers';
import fonts from '@shared/theme/fonts';

interface Style {
    container: ViewStyle;
    messageBoxContainer: ViewStyle;
    messageTextStyle: ViewStyle;
    commentsContainer: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        container: {
            backgroundColor: colors.background,
            borderRadius: 16,
        },
        messageBoxContainer: {
            padding: 16,
            marginTop: 16,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            borderTopColor: colors.borderColor,
            borderTopWidth: 1,
            position: 'relative',
        },
        messageTextStyle: {
            fontSize: normalizeText(12),
            borderWidth: 1,
            borderColor: colors.ctrlBorderColor,
            height: 45,
            borderRadius: 4,
            paddingHorizontal: 8,
            backgroundColor: colors.dynamicWhite,
            color: colors.text,
            fontFamily: fonts.montserrat.regular,
            flex: 1,
            paddingTop: 10,
            maxHeight: 150,
        },
        commentsContainer: {
            maxHeight: 200,
        },
    });
};
