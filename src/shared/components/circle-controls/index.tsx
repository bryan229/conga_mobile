import React, { ReactNode, useMemo } from 'react';
import { useTheme } from '@services/hooks/useTheme';
import { View } from 'react-native';
import { CPStyleProp } from '@services/types';
import createStyles from './style';

interface CPCircleControlsProps {
    style?: CPStyleProp;
    children?: ReactNode;
}

const CPCircleControls: React.FC<CPCircleControlsProps> = ({ style, children }) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(), [theme]);

    return <View style={[styles.container, style]}>{children}</View>;
};

export default CPCircleControls;
