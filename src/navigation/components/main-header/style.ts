import { ViewStyle, StyleSheet, TextStyle } from 'react-native';
import { ImageStyle } from 'react-native-fast-image';
import { ExtendedTheme } from '@services/hooks/useTheme';

interface Style {
    container: ViewStyle;
    titleStyle: TextStyle;
    profilePicImageStyle: ImageStyle;
    moreMenuContainerStyle: ViewStyle;
    mainCircleContainer: ViewStyle;
    circleContainer: ViewStyle;
    circleContent: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        container: {
            backgroundColor: colors.headBar,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingTop: 40,
            minHeight: 100,
            position: 'relative',
            zIndex: 100,
        },
        moreMenuContainerStyle: {
            paddingHorizontal: 16,
            paddingTop: 40,
            minHeight: 100,
            position: 'relative',
            zIndex: 100,
        },
        titleStyle: { flex: 1 },
        profilePicImageStyle: {
            height: 50,
            width: 50,
            borderRadius: 30,
            borderColor: colors.borderColor,
            borderWidth: 1,
        },
        mainCircleContainer: {
            backgroundColor: colors.primary,
            width: 60,
            height: 60,
            position: 'absolute',
            bottom: 20,
            right: 0,
            borderRadius: 60,
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
        },
        circleContainer: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
            borderWidth: 1,
            width: 60,
            height: 60,
            position: 'absolute',
            bottom: 20,
            right: 0,
            borderRadius: 60,
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
        },
        circleContent: {
            display: 'flex',
            alignItems: 'center',
        },
    });
};
