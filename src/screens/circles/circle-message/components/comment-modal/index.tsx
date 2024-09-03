import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import * as Progress from 'react-native-progress';
import ReactNativeModal from 'react-native-modal';
import createStyles from './style';
import { useTheme } from '@services/hooks/useTheme';
import CTText from '@shared/components/controls/ct-text';
import { getStyle } from '@shared/theme/themes';
import fonts from '@shared/theme/fonts';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { handleError } from '@store/actions';
import { CircleCommentApi } from '@services/api';
import { TouchableOpacity } from 'react-native';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import CPAvatar from '@shared/components/avatar';
import moment from 'moment';
import { CircleMessage, CircleComment } from '@services/models';
import { ScrollView } from 'react-native-gesture-handler';
import CircleCommentItem from '../circlecomment-item';

type Props = {
    message?: CircleMessage;
    isOpen: boolean;
    toggle: () => void;
    callback: ({ messageId, newComment }: { messageId: string; newComment: CircleComment }) => void;
};

const CircleCommentModal = ({ message, isOpen, toggle, callback }: Props) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [loading, setLoading] = useState<boolean>(false);
    const [comment, setComment] = useState<string>('');
    const [msgTextBoxHeight, setMsgTextBoxHeight] = useState<number>(0);
    const scrollViewRef = useRef<ScrollView>();

    useEffect(() => {
        if (!isOpen) {
            setComment('');
        }
    }, [isOpen]);

    if (!message) return null;

    const sendComment = async () => {
        if (!comment) return;
        setLoading(true);
        try {
            const params = {
                circleMessage: message._id,
                user: user?._id,
                message: comment,
            };
            const res = await CircleCommentApi.create(params);
            setLoading(false);
            callback({ messageId: res.data._id, newComment: res.comment });
            toggle();
        } catch (error) {
            setLoading(false);
            dispatch(handleError(error));
        }
    };

    return (
        <ReactNativeModal
            isVisible={isOpen}
            statusBarTranslucent={false}
            hasBackdrop={true}
            backdropOpacity={0.8}
            animationIn="fadeIn"
            animationInTiming={100}
            animationOut="fadeOut"
            animationOutTiming={200}
            onBackdropPress={loading ? undefined : toggle}
            avoidKeyboard
        >
            <View style={styles.container}>
                <View style={getStyle(['row', 'align-items-center', 'mb-8', 'px-16', 'pt-16', 'justify-between'])}>
                    <View style={getStyle(['row', 'align-items-center'])}>
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
                                {moment(message.createdAt).format('ddd, MMM, DD')}
                            </CTText>
                        </View>
                    </View>
                    {loading && (
                        <Progress.Circle
                            size={25}
                            indeterminate={loading}
                            color="white"
                            borderWidth={3}
                            borderColor={colors.primary}
                        />
                    )}
                </View>
                <CTText fontFamily={fonts.montserrat.regular} color={colors.text} size={12} style={getStyle('px-16')}>
                    {message.message}
                </CTText>
                {message.totalComments > 0 && (
                    <>
                        <CTText
                            right
                            color={colors.primary}
                            fontFamily={fonts.montserrat.regular}
                            size={10}
                            style={getStyle(['p-16'])}
                        >
                            {message.totalComments} Comments
                        </CTText>
                        <ScrollView
                            style={styles.commentsContainer}
                            ref={scrollViewRef as any}
                            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                        >
                            <View style={getStyle(['pl-32', 'pr-16'])}>
                                {message.comments.map((x) => (
                                    <CircleCommentItem key={x._id} comment={x} />
                                ))}
                            </View>
                        </ScrollView>
                    </>
                )}
                <View style={styles.messageBoxContainer}>
                    <TextInput
                        style={[styles.messageTextStyle, { height: Math.max(40, msgTextBoxHeight) }]}
                        placeholder="Type a comment"
                        onChangeText={setComment}
                        onContentSizeChange={(event) => setMsgTextBoxHeight(event.nativeEvent.contentSize.height)}
                        value={comment}
                        multiline={true}
                        numberOfLines={0}
                        keyboardType="default"
                        selectionColor={'green'}
                        placeholderTextColor={colors.placeholder}
                    />
                    <TouchableOpacity style={getStyle(['pl-16', 'py-8'])} disabled={!comment} onPress={sendComment}>
                        <Icon
                            name="paper-plane"
                            type={IconType.Ionicons}
                            size={25}
                            color={comment ? colors.primary : colors.darkGray}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </ReactNativeModal>
    );
};

export default CircleCommentModal;
