import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '@services/hooks/useTheme';
import CTText from '@shared/components/controls/ct-text';
import { Animated, TouchableOpacity, View } from 'react-native';
import { CPStyleProp } from '@services/types';
import createStyles from './style';
import fonts from '@shared/theme/fonts';
interface CPAnimateButtonGroupProps {
    style?: CPStyleProp;
    width: number;
    buttons: string[];
    activeBtn?: string;
    onSelect: (value: string) => void;
}

const CPAnimateButtonGroup: React.FC<CPAnimateButtonGroupProps> = ({ style, width, buttons, activeBtn, onSelect }) => {
    const theme = useTheme();
    const innerWidth = width - 6;
    const buttonWidth = Math.round(innerWidth / buttons.length);
    const styles = useMemo(() => createStyles(theme, buttonWidth), [theme]);
    const { colors } = theme;
    const leftValue = useRef(new Animated.Value(2)).current;
    const [activeButton, setActiveButton] = useState(activeBtn || buttons[0]);

    useEffect(() => {
        const buttonIndex = buttons.indexOf(activeButton);
        Animated.timing(leftValue, {
            toValue: buttonIndex,
            duration: 400,
            useNativeDriver: false,
        }).start();
    }, [activeButton]);

    const leftInterpolate = leftValue.interpolate({
        inputRange: new Array(buttons.length).fill(1).map((_, index) => index),
        outputRange: new Array(buttons.length).fill(1).map((_, index) => Math.round(index * buttonWidth)),
    });

    const bgAnimationStyle = {
        left: leftInterpolate,
    };

    const onPressButton = (button: string) => {
        setActiveButton(button);
        onSelect(button);
    };

    return (
        <View style={style}>
            <View style={styles.containerStyle}>
                <View style={styles.buttonGroupStyle}>
                    {buttons.map((button, index) => (
                        <TouchableOpacity style={styles.buttonStyle} onPress={() => onPressButton(button)} key={index}>
                            <CTText
                                style={styles.buttonTextStyle}
                                color={button === activeButton ? colors.white : colors.text}
                                fontFamily={
                                    button === activeButton ? fonts.montserrat.semiBold : fonts.montserrat.regular
                                }
                            >
                                {button}
                            </CTText>
                        </TouchableOpacity>
                    ))}
                    <Animated.View style={[styles.animatedBgStyle, bgAnimationStyle]} />
                </View>
            </View>
        </View>
    );
};

export default CPAnimateButtonGroup;
