import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import CTText from '@shared/components/controls/ct-text';
import { CPStyleProp } from '@services/types';

interface IconBadgeProps {
    style?: CPStyleProp;
    size?: number;
    count: number;
}

const IconBadge: React.FC<IconBadgeProps> = ({ style, size = 15, count }) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);

    if (count === 0) return null;

    return (
        <View
            style={[
                styles.container,
                style,
                {
                    width: size,
                    height: size,
                    borderRadius: size,
                },
            ]}
        >
            {count > -1 && (
                <CTText color={colors.white} style={styles.badgeTextStyle}>
                    {count}
                </CTText>
            )}
        </View>
    );
};

export default IconBadge;
