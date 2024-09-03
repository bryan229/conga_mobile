import { StyleSheet, ViewStyle } from 'react-native';

interface Style {
    container: ViewStyle;
}

export default () => {
    return StyleSheet.create<Style>({
        container: {
            position: 'absolute',
            bottom: 16,
            right: 16,
            display: 'flex',
            flexDirection: 'row',
            zIndex: 2,
        },
    });
};
