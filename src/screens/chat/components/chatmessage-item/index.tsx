import { useTheme } from '@services/hooks/useTheme';
import { ChatMessage, User } from '@services/models';
import CTText from '@shared/components/controls/ct-text';
import createStyles from './style';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { getStyle } from '@shared/theme/themes';
import CPAvatar from '@shared/components/avatar';
import moment from 'moment';
import fonts from '@shared/theme/fonts';

interface Props {
    message: ChatMessage;
    partner: User;
    user: User;
}

const ChatMessageItem = ({ message, user, partner }: Props) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <View>
            {message.showDateGroup && (
                <CTText center style={getStyle('py-16')} bold>
                    {moment(message.createdAt).format('dddd, MMM DD')}
                </CTText>
            )}
            <View style={[styles.container, message.msgType ? getStyle('ml-16') : getStyle(['justify-end', 'mr-16'])]}>
                {message.msgType ? (
                    <>
                        <CPAvatar source={partner.photoUrl} name={partner.fullName} size={30} />
                        <View style={styles.leftBubbleContainer}>
                            <CTText size={10} fontFamily={fonts.montserrat.semiBold} style={getStyle('mb-4')}>
                                {message.msg}
                            </CTText>
                            <CTText size={8} right>
                                {moment(message.createdAt).format('hh:mm A')}
                            </CTText>
                        </View>
                    </>
                ) : (
                    <>
                        <View style={styles.rightBubbleContainer}>
                            <CTText
                                color={colors.white}
                                size={10}
                                fontFamily={fonts.montserrat.semiBold}
                                style={getStyle('mb-4')}
                            >
                                {message.msg}
                            </CTText>
                            <CTText color={colors.white} size={8} right>
                                {moment(message.createdAt).format('hh:mm A')}
                            </CTText>
                        </View>
                        <CPAvatar source={user.photoUrl} name={user.fullName} size={30} />
                    </>
                )}
            </View>
        </View>
    );
};

export default ChatMessageItem;
