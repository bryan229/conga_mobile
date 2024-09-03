import { ExtendedTheme } from '@services/hooks/useTheme';
import { StyleSheet, ViewStyle } from 'react-native';

interface Style {
    containerStyle: ViewStyle;
    listStyle: ViewStyle;
}

export default (_: ExtendedTheme) => {
    return StyleSheet.create<Style>({
        containerStyle: {
            flex: 1,
            height: 500,
        },
        listStyle: {
            flex: 1,
            paddingTop: 8,
            overflow: 'scroll',
        },
    });
};
