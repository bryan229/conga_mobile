import { ExtendedTheme } from '@services/hooks/useTheme';
import { StyleSheet, ViewStyle } from 'react-native';

interface Style {
    containerStyle: ViewStyle;
    listStyle: ViewStyle;
    loadingContainerStyle: ViewStyle;
}

export default (_: ExtendedTheme) => {
    return StyleSheet.create<Style>({
        containerStyle: {
            minHeight: 300,
            flex: 1,
            display: 'flex',
        },
        listStyle: {
            marginTop: 16,
            flex: 1,
        },
        loadingContainerStyle: {
            marginTop: 16,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
};
