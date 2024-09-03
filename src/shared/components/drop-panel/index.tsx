import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import CTText from '@shared/components/controls/ct-text';
import { CPStyleProp } from '@services/types';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';

interface CPDropPanelProps {
    style?: CPStyleProp;
    isVisible: boolean;
    toggle: () => void;
    options: string[];
    values?: string[];
    value?: string;
    isMulti?: boolean;
    onSelect: (item: string) => void;
}

const CPDropPanel: React.FC<CPDropPanelProps> = ({
    style,
    isVisible,
    toggle,
    options,
    values = [],
    value = 'Research',
    isMulti = false,
    onSelect,
}) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [showContent, setShowContent] = useState(false);
    const height = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isVisible) {
            setShowContent(true);
            Animated.timing(height, {
                toValue: 1,
                duration: 500,
                useNativeDriver: false,
            }).start();
            Animated.timing(opacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(height, {
                toValue: 0,
                duration: 100,
                useNativeDriver: false,
            }).start();
            Animated.timing(opacity, {
                toValue: 0,
                duration: 100,
                useNativeDriver: false,
            }).start(({ finished }) => {
                if (finished) setShowContent(false);
            });
        }
    }, [isVisible]);

    const heightInterpolate = height.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1000],
    });

    const opacityInterpolate = opacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const containerAnimationStyle = {
        maxHeight: heightInterpolate,
    };

    const optionContainerAnimationStyle = {
        opacity: opacityInterpolate,
    };

    const isSelected = (option: string) => {
        if (isMulti) return values.includes(option);
        return value === option;
    };

    const MenuItem = ({ option }: { option: string }) => (
        <TouchableOpacity
            style={[
                styles.optionStyle,
                isSelected(option) ? { borderColor: colors.primary } : { borderColor: colors.borderColor },
            ]}
            onPress={() => {
                if (onSelect) onSelect(option);
                toggle();
            }}
        >
            <CTText style={styles.optionTextStyle} color={isSelected(option) ? colors.primary : colors.text}>
                {option}
            </CTText>
        </TouchableOpacity>
    );

    return (
        <>
            <Animated.View style={[styles.container, style, containerAnimationStyle]}>
                <Animated.View style={[styles.contentContainerStyle, optionContainerAnimationStyle]}>
                    {showContent && (
                        <View style={[styles.optionContainerStyle]}>
                            {options.map((option, index) => (
                                <MenuItem option={option} key={index} />
                            ))}
                        </View>
                    )}
                    <View style={styles.buttonContainerStyle}>
                        <TouchableOpacity
                            style={styles.controlButtonStyle}
                            onPress={() => {
                                if (onSelect) onSelect('');
                                toggle();
                            }}
                        >
                            <Icon name="close" type={IconType.Ionicons} size={15} color={colors.dynamicPrimary} />
                            <CTText color={colors.dynamicPrimary}>Clear Filter</CTText>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.controlButtonStyle} onPress={toggle}>
                            <Icon name="close" type={IconType.Ionicons} size={15} color={colors.danger} />
                            <CTText color={colors.danger}>Close</CTText>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Animated.View>
            {isVisible && (
                <TouchableWithoutFeedback onPress={toggle}>
                    <View style={styles.backDropStyle} />
                </TouchableWithoutFeedback>
            )}
        </>
    );
};

export default CPDropPanel;
