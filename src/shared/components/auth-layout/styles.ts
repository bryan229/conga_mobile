import { StyleSheet, ViewStyle } from 'react-native';

interface Style {
    authLayoutContainer: ViewStyle;
}

export default () => {
    return StyleSheet.create<Style>({
        authLayoutContainer: {
            flex: 1,
        },
    });
};
