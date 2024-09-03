import React, { useMemo, useState } from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import { useAppSelector } from '@store/hook';
import { useAppNavigation } from '@services/hooks/useNavigation';
import createStyles from './style';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import ReactNativeModal from 'react-native-modal';
import { getStyle } from '@shared/theme/themes';
import CTButton from '@shared/components/controls/ct-button';
import { CLUB_TYPE } from '@shared/constants';

type HeaderPropsType = {
    style?: ViewStyle;
    showRiteItem?: boolean;
    title: string;
};

const PublicHeader: React.FC<HeaderPropsType> = ({ title, style, showRiteItem = true }) => {
    const myClubs = useAppSelector((state) => state.club.myClubs);
    const clubs = useAppSelector((state) => state.club.clubs);
    const credential = useAppSelector((state) => state.auth.credential);
    const navigation = useAppNavigation();
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const { colors } = theme;
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggle = () => {
        setIsOpen(!isOpen);
    };

    const isCongaMember = () => {
        return (myClubs ?? []).some((x) => x.type === CLUB_TYPE.VIRTUAL);
    };

    const gotoLogin = () => {
        toggle();
        navigation.navigate('Login');
    };

    const gotoRegConga = () => {
        toggle();
        const congaClub = clubs.find((x) => x.type === CLUB_TYPE.VIRTUAL);
        navigation.navigate('Register', { club: congaClub });
    };

    return (
        <View style={[styles.containerStyle, style]}>
            <CTText h1 color={colors.text} fontFamily={fonts.montserrat.bold} style={styles.titleStyle}>
                {title}
            </CTText>
            {showRiteItem && credential && (
                <>
                    <TouchableOpacity activeOpacity={0.9} onPress={toggle}>
                        <Icon type={IconType.Ionicons} name="person-circle-outline" size={40} color={colors.text} />
                    </TouchableOpacity>
                    <ReactNativeModal
                        isVisible={isOpen}
                        statusBarTranslucent={false}
                        hasBackdrop={true}
                        backdropOpacity={0.7}
                        animationIn="fadeIn"
                        animationInTiming={100}
                        animationOut="fadeOut"
                        animationOutTiming={200}
                        onBackdropPress={toggle}
                        avoidKeyboard
                    >
                        <View style={styles.modalContainerStyle}>
                            <View style={getStyle(['row', 'justify-center', 'mb-4'])}>
                                <Icon
                                    type={IconType.Ionicons}
                                    name="person-circle-outline"
                                    size={50}
                                    color={colors.text}
                                />
                            </View>
                            <CTText fontFamily={fonts.montserrat.regular} center style={getStyle('mb-8')}>
                                Signed In
                            </CTText>
                            <CTText fontFamily={fonts.montserrat.regular} bold center color={colors.text}>
                                {credential}
                            </CTText>
                            <View style={getStyle(['px-32', 'mt-16'])}>
                                <TouchableOpacity style={styles.modalBtnStyle} onPress={gotoLogin}>
                                    <CTText fontFamily={fonts.montserrat.regular} color={colors.text}>
                                        Switch Account
                                    </CTText>
                                </TouchableOpacity>
                                {!isCongaMember() && (
                                    <CTButton
                                        title="Register to Conga"
                                        color={colors.secondary}
                                        onPress={gotoRegConga}
                                        style={getStyle('mt-16')}
                                    />
                                )}
                            </View>
                        </View>
                    </ReactNativeModal>
                </>
            )}
        </View>
    );
};

export default PublicHeader;
