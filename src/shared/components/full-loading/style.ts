import { StyleSheet, ViewStyle } from 'react-native';
import { ExtendedTheme } from '@services/hooks/useTheme';

interface Style {
    loadingStyle: ViewStyle;
}

export default (_: ExtendedTheme) => {
    return StyleSheet.create<Style>({
        loadingStyle: {
            alignItems: 'center',
        },
    });
};
