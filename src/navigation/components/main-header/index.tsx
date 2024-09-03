import React, { ReactNode, useMemo, useState } from 'react';
import { View, TouchableOpacity, Animated, ViewStyle } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import { useAppSelector } from '@store/hook';
import { useAppNavigation } from '@services/hooks/useNavigation';
import OutsidePressHandler from 'react-native-outside-press';
import createStyles from './style';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import CPAvatar from '@shared/components/avatar';
import { CLUB_TYPE } from '@shared/constants';

type HeaderPropsType = {
    style?: ViewStyle;
    title: string | ReactNode;
};

const MainHeader: React.FC<HeaderPropsType> = ({ title, style }) => {
    const user = useAppSelector((state) => state.auth.user);
    const club = useAppSelector((state) => state.club.club);
    const navigation = useAppNavigation();
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const { colors } = theme;

    const [icon_1] = useState(new Animated.Value(20));
    const [icon_2] = useState(new Animated.Value(20));
    const [icon_3] = useState(new Animated.Value(20));
    const [icon_4] = useState(new Animated.Value(20));
    const [icon_5] = useState(new Animated.Value(20));

    const [pop, setPop] = useState(false);

    const isVirtualClub = () => {
        return club?.type === CLUB_TYPE.VIRTUAL;
    };

    const popIn = () => {
        setPop(true);
        Animated.timing(icon_1, {
            toValue: -50,
            duration: 300,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_2, {
            toValue: -120,
            duration: 300,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_3, {
            toValue: -190,
            duration: 300,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_4, {
            toValue: -260,
            duration: 300,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_5, {
            toValue: -330,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const popOut = () => {
        setPop(false);
        Animated.timing(icon_1, {
            toValue: 20,
            duration: 300,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_2, {
            toValue: 20,
            duration: 300,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_3, {
            toValue: 20,
            duration: 300,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_4, {
            toValue: 20,
            duration: 300,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_5, {
            toValue: 20,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const gotoAccount = () => {
        popOut();
        navigation.navigate('Account');
    };

    const gotoChat = () => {
        popOut();
        navigation.navigate('ChatList');
    };

    const gotoPost = () => {
        popOut();
        navigation.navigate('Posts');
    };

    const gotoOpponent = () => {
        popOut();
        navigation.navigate('Opponents');
    };

    const gotoCircles = () => {
        popOut();
        navigation.navigate('Circles');
    };

    return (
        <View style={[styles.container, style]}>
            {typeof title === 'string' ? (
                <CTText h1 color={colors.text} fontFamily={fonts.montserrat.regular} style={styles.titleStyle}>
                    {title}
                </CTText>
            ) : (
                title
            )}
            {user && (
                <OutsidePressHandler onOutsidePress={() => popOut()}>
                    <View style={styles.moreMenuContainerStyle}>
                        <Animated.View style={[styles.circleContainer, { bottom: icon_1 }]}>
                            <TouchableOpacity style={styles.circleContent} onPress={gotoAccount}>
                                <Icon type={IconType.Ionicons} name="person" size={25} color={colors.white} />
                                <CTText size={7} color={colors.white}>
                                    Account
                                </CTText>
                            </TouchableOpacity>
                        </Animated.View>
                        <Animated.View style={[styles.circleContainer, { bottom: icon_2 }]}>
                            <TouchableOpacity style={styles.circleContent} onPress={gotoChat}>
                                <Icon type={IconType.Ionicons} name="chatbox-ellipses" size={25} color={colors.white} />
                                <CTText size={7} color={colors.white}>
                                    Chat
                                </CTText>
                            </TouchableOpacity>
                        </Animated.View>
                        <Animated.View style={[styles.circleContainer, { bottom: icon_3 }]}>
                            <TouchableOpacity style={styles.circleContent} onPress={gotoCircles}>
                                <Icon type={IconType.Ionicons} name="people" size={25} color={colors.white} />
                                <CTText size={6} color={colors.white}>
                                    Circles
                                </CTText>
                            </TouchableOpacity>
                        </Animated.View>
                        {!isVirtualClub() && (
                            <>
                                <Animated.View style={[styles.circleContainer, { bottom: icon_4 }]}>
                                    <TouchableOpacity style={styles.circleContent} onPress={gotoPost}>
                                        <Icon
                                            type={IconType.Ionicons}
                                            name="megaphone"
                                            size={25}
                                            color={colors.white}
                                        />
                                        <CTText size={7} color={colors.white}>
                                            Post
                                        </CTText>
                                    </TouchableOpacity>
                                </Animated.View>
                                <Animated.View style={[styles.circleContainer, { bottom: icon_5 }]}>
                                    <TouchableOpacity style={styles.circleContent} onPress={gotoOpponent}>
                                        <Icon
                                            type={IconType.FontAwesome5}
                                            name="people-arrows"
                                            size={25}
                                            color={colors.white}
                                        />
                                        <CTText size={6} color={colors.white}>
                                            Opponent
                                        </CTText>
                                    </TouchableOpacity>
                                </Animated.View>
                            </>
                        )}
                        <TouchableOpacity
                            style={styles.mainCircleContainer}
                            activeOpacity={0.9}
                            onPress={() => {
                                pop === false ? popIn() : popOut();
                            }}
                        >
                            <CPAvatar source={user.photoUrl} name={user.fullName} size={60} />
                        </TouchableOpacity>
                    </View>
                </OutsidePressHandler>
            )}
        </View>
    );
};

export default MainHeader;
