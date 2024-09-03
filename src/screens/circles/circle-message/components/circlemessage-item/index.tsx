import { useTheme } from '@services/hooks/useTheme';
import { CircleMessage } from '@services/models';
import CTText from '@shared/components/controls/ct-text';
import createStyles from './style';
import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import fonts from '@shared/theme/fonts';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import moment from 'moment';
import { getStyle } from '@shared/theme/themes';
import CPAvatar from '@shared/components/avatar';
import CircleCommentItem from '../circlecomment-item';
import { useAppSelector } from '@store/hook';
import CTButton from '@shared/components/controls/ct-button';

interface Props {
    message: CircleMessage;
    onAddComment: () => void;
    onCreateEvent: () => void;
    onRegEvent: () => void;
    onEditEvent: () => void;
    onGoSchedule: () => void;
    onRegSchedule: () => void;
}

const CircleMessageItem = ({
    message,
    onAddComment,
    onCreateEvent,
    onRegEvent,
    onEditEvent,
    onGoSchedule,
    onRegSchedule,
}: Props) => {
    const user = useAppSelector((state) => state.auth.user);
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const isMyMessage = message.poster?._id === user?._id;
    const isRegEvent = message.eventId && (message.eventRegUsers ?? []).includes(user?._id!);
    const isResevedSchedule = (message.schedule?.members ?? []).some((x) => x.email === user?.email);

    return (
        <View style={styles.container}>
            <View style={getStyle(['row', 'align-items-center', 'mb-16'])}>
                <CPAvatar size={35} source={message.poster.photoUrl} name={message.poster.fullName} />
                <View style={getStyle('ml-8')}>
                    <CTText
                        fontFamily={fonts.montserrat.regular}
                        color={colors.text}
                        bold
                        style={getStyle('mb-4')}
                        size={12}
                    >
                        {message.poster.fullName}
                    </CTText>
                    <CTText fontFamily={fonts.montserrat.regular} size={10} color={colors.darkGray}>
                        {moment(message.createdAt).format('ddd, MMM DD, h:mm A')}
                    </CTText>
                </View>
            </View>
            <CTText fontFamily={fonts.montserrat.regular} color={colors.text}>
                {message.message}
            </CTText>
            <View style={getStyle(['row', 'justify-between', 'mt-16'])}>
                <TouchableOpacity onPress={onAddComment}>
                    <CTText color={colors.primary} fontFamily={fonts.montserrat.regular} size={10}>
                        {message.totalComments} Comments
                    </CTText>
                </TouchableOpacity>
                <TouchableOpacity onPress={onAddComment}>
                    <View style={getStyle(['row', 'align-items-center'])}>
                        <Icon
                            type={IconType.Ionicons}
                            name="chatbubble-ellipses-outline"
                            size={20}
                            color={colors.primary}
                        />
                        <CTText fontFamily={fonts.montserrat.regular} color={colors.primary} style={getStyle('ml-4')}>
                            Add Comment
                        </CTText>
                    </View>
                </TouchableOpacity>
            </View>
            {message.totalComments > 0 && (
                <View style={getStyle(['ml-16', 'mt-16'])}>
                    {(message.comments || []).slice(-2).map((x) => (
                        <CircleCommentItem key={x._id} comment={x} />
                    ))}
                </View>
            )}
            {message.schedule ? (
                <>
                    {isMyMessage ? (
                        <CTButton
                            color={colors.dynamicWhite}
                            borderColor={colors.border}
                            style={getStyle('mt-16')}
                            onPress={onGoSchedule}
                        >
                            <CTText fontFamily={fonts.montserrat.regular} color={colors.primary} center>
                                Check My Schedule
                            </CTText>
                        </CTButton>
                    ) : (
                        <CTButton
                            color={colors.dynamicWhite}
                            borderColor={colors.border}
                            style={getStyle('mt-16')}
                            onPress={onRegSchedule}
                            disabled={!message.schedule.canReg}
                        >
                            <CTText
                                fontFamily={fonts.montserrat.regular}
                                color={isResevedSchedule ? colors.secondary : colors.primary}
                                center
                            >
                                {isResevedSchedule ? 'Cancel Reservation' : 'Reservation'}
                            </CTText>
                        </CTButton>
                    )}
                </>
            ) : (
                <>
                    {isMyMessage && !message.eventId && (
                        <CTButton
                            color={colors.dynamicWhite}
                            borderColor={colors.border}
                            style={getStyle('mt-16')}
                            onPress={onCreateEvent}
                        >
                            <CTText fontFamily={fonts.montserrat.regular} color={colors.primary} center>
                                Create New Event
                            </CTText>
                        </CTButton>
                    )}
                    {message.eventId && (
                        <CTButton
                            color={colors.dynamicWhite}
                            borderColor={colors.border}
                            style={getStyle('mt-16')}
                            onPress={() => (isMyMessage ? onEditEvent() : onRegEvent())}
                        >
                            <CTText
                                fontFamily={fonts.montserrat.regular}
                                color={isMyMessage ? colors.primary : isRegEvent ? colors.secondary : colors.primary}
                                center
                            >
                                {isMyMessage
                                    ? 'Edit Club Event'
                                    : isRegEvent
                                    ? 'Unregister for Club Event'
                                    : 'Register for Club Event'}
                            </CTText>
                        </CTButton>
                    )}
                </>
            )}
        </View>
    );
};

export default CircleMessageItem;
