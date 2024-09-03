import { DarkTheme, LightTheme } from '@shared/theme/themes';
import { useColorScheme } from 'react-native';

export type ExtendedTheme = typeof DarkTheme | typeof LightTheme;
export const useTheme = () => {
    const scheme = useColorScheme();
    const isDarkMode = scheme === 'dark';
    return isDarkMode ? DarkTheme : LightTheme;
};
