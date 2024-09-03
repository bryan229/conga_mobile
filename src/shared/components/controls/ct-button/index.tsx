import React, { useMemo } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import * as Progress from 'react-native-progress';
import createStyles from './style';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import { CPStyleProp } from '@services/types';

interface CTButtonProps extends TouchableOpacityProps {
    style?: CPStyleProp;
    title?: string;
    titleColor?: string;
    color?: string;
    loading?: boolean;
    onPress?: () => void;
    onPressIn?: () => void;
    onPressOut?: () => void;
    children?: React.ReactNode;
    borderColor?: string;
    disabled?: boolean;
}

const CTButton: React.FC<CTButtonProps> = ({
    style,
    title,
    titleColor = 'white',
    color,
    borderColor = 'transparent',
    onPress,
    onPressIn,
    onPressOut,
    children,
    loading = false,
    disabled = false,
    ...rest
}) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <TouchableOpacity
            style={[
                styles.buttonStyle,
                style,
                color ? { backgroundColor: color } : {},
                borderColor !== 'transparent' ? { borderColor, borderWidth: 1 } : {},
                disabled ? { opacity: 0.5 } : {},
            ]}
            onPress={() => {
                if (loading) return;
                onPress?.();
            }}
            activeOpacity={0.5}
            {...rest}
            disabled={disabled}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
        >
            {loading ? (
                <Progress.Circle
                    style={styles.loadingStyle}
                    size={25}
                    indeterminate={loading}
                    color={titleColor}
                    borderWidth={3}
                />
            ) : (
                <>
                    {children ? (
                        <>{children}</>
                    ) : (
                        <>
                            {!loading && title && (
                                <CTText
                                    color={titleColor}
                                    fontFamily={fonts.montserrat.regular}
                                    style={styles.buttonTextStyle}
                                    bold
                                >
                                    {title}
                                </CTText>
                            )}
                        </>
                    )}
                </>
            )}
        </TouchableOpacity>
    );
};

export default CTButton;
