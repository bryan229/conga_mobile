import { ScreenWidth } from '@freakycoder/react-native-helpers';
import { ExtendedTheme } from '@services/hooks/useTheme';
import { ViewStyle, StyleSheet } from 'react-native';

interface Style {
    containerStyle: ViewStyle;
    headerStyle: ViewStyle;
    contentContainerStyle: ViewStyle;
    addMemberBtnStyle: ViewStyle;
    membersListContainer: ViewStyle;
    searchMemberModalContainer: ViewStyle;
    searchMemberContentStyle: ViewStyle;
    memberItemStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
    const { colors } = theme;
    return StyleSheet.create<Style>({
        containerStyle: {
            flex: 1,
            backgroundColor: colors.background,
        },
        headerStyle: {
            borderBottomColor: colors.borderColor,
            borderBottomWidth: 1,
        },
        contentContainerStyle: {
            padding: 16,
        },
        membersListContainer: {
            maxHeight: 250,
            marginBottom: 8,
            borderColor: colors.borderColor,
            borderWidth: 1,
            borderRadius: 4,
            backgroundColor: colors.dynamicBackground,
            overflow: 'scroll',
        },
        memberItemStyle: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderBottomColor: colors.borderColor,
            borderBottomWidth: 1,
        },
        addMemberBtnStyle: {
            backgroundColor: colors.dynamicWhite,
            borderColor: colors.borderColor,
            borderRadius: 8,
            borderWidth: 1,
            paddingVertical: 12,
            marginBottom: 32,
        },
        searchMemberModalContainer: {
            width: ScreenWidth * 0.9,
            maxWidth: 500,
            height: 500,
            alignSelf: 'center',
            backgroundColor: colors.background,
            borderRadius: 8,
            borderColor: colors.borderColor,
            borderWidth: 1,
            shadowColor: colors.shadow,
            shadowRadius: 5,
            shadowOpacity: 0.7,
            shadowOffset: {
                width: 0,
                height: 3,
            },
            padding: 16,
        },
        searchMemberContentStyle: {
            flex: 1,
        },
    });
};
