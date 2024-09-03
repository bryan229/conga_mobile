import React, { useMemo } from 'react';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import { CPStyleProp } from '@services/types';
import { TouchableOpacity } from 'react-native';

interface CTCircleButtonProps {
    style?: CPStyleProp;
    onPress?: () => void;
    children?: React.ReactNode;
    size?: number;
    color?: string;
}

const CTCircleButton: React.FC<CTCircleButtonProps> = ({ style, onPress, children, size = 40, color }) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme, size, color), [theme]);

    return (
        <TouchableOpacity style={[styles.buttonStyle, style]} onPress={onPress}>
            {children}
        </TouchableOpacity>
    );
};

export default CTCircleButton;
