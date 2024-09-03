import { useTheme } from '@services/hooks/useTheme';
import React, { useMemo, useState } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import createStyles from './style';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import CTText from '../controls/ct-text';

const FloatingButton = () => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [icon_1] = useState(new Animated.Value(100));
    const [icon_2] = useState(new Animated.Value(100));
    const [icon_2_right] = useState(new Animated.Value(16));
    const [icon_3] = useState(new Animated.Value(16));
    const [icon_1_rotate] = useState(new Animated.Value(0));
    const [pop, setPop] = useState(false);

    const popIn = () => {
        setPop(true);
        Animated.timing(icon_1, {
            toValue: 180,
            duration: 300,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_2, {
            toValue: 160,
            duration: 300,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_2_right, {
            toValue: 76,
            duration: 300,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_3, {
            toValue: 96,
            duration: 300,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_1_rotate, {
            toValue: 45,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const popOut = () => {
        setPop(false);
        Animated.timing(icon_1, {
            toValue: 100,
            duration: 300,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_2, {
            toValue: 100,
            duration: 300,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_2_right, {
            toValue: 16,
            duration: 300,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_3, {
            toValue: 16,
            duration: 300,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_1_rotate, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const rotate45 = icon_1_rotate.interpolate({
        inputRange: [0, 45],
        outputRange: ['0deg', '45deg'],
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.circleContainer, { bottom: icon_1 }]}>
                <TouchableOpacity style={styles.circleContent}>
                    <Icon type={IconType.Ionicons} name="chatbox-ellipses" size={25} color={colors.primary} />
                    <CTText size={7} color={colors.primary}>
                        Chat
                    </CTText>
                </TouchableOpacity>
            </Animated.View>
            <Animated.View style={[styles.circleContainer, { bottom: icon_2, right: icon_2_right }]}>
                <TouchableOpacity style={styles.circleContent}>
                    <Icon type={IconType.Ionicons} name="megaphone" size={25} color={colors.primary} />
                    <CTText size={7} color={colors.primary}>
                        Post
                    </CTText>
                </TouchableOpacity>
            </Animated.View>
            <Animated.View style={[styles.circleContainer, { right: icon_3 }]}>
                <TouchableOpacity style={styles.circleContent}>
                    <Icon type={IconType.Ionicons} name="people" size={25} color={colors.primary} />
                    <CTText size={6} color={colors.primary}>
                        Opponent
                    </CTText>
                </TouchableOpacity>
            </Animated.View>
            <TouchableOpacity
                style={styles.mainCircleContainer}
                activeOpacity={0.9}
                onPress={() => {
                    pop === false ? popIn() : popOut();
                }}
            >
                <Animated.View style={{ transform: [{ rotate: rotate45 }] }}>
                    <Icon type={IconType.Ionicons} name="add" size={35} color={colors.white} />
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
};

export default FloatingButton;
