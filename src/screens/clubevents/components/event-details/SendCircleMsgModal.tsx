import { useTheme } from '@services/hooks/useTheme';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactNativeModal from 'react-native-modal';
import createStyles from './style';
import { View } from 'react-native';
import { getStyle } from '@shared/theme/themes';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import { TouchableOpacity } from 'react-native';
import CTText from '@shared/components/controls/ct-text';
import CTTextArea from '@shared/components/controls/ct-textarea';
import CTButton from '@shared/components/controls/ct-button';
import fonts from '@shared/theme/fonts';
import { useAppSelector } from '@store/hook';
import { CircleMessage, ClubEvent } from '@services/models';
import { CircleCommentApi, CircleMessageApi } from '@services/api';
import { useForm } from 'react-hook-form';

interface Props {
    event: ClubEvent;
    isOpen: boolean;
    toggle: () => void;
}

type FormValues = {
    message: string;
};

const SendCircleMsgModal = ({ event, isOpen, toggle }: Props) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const myCircles = useAppSelector((state) => state.club.myCircles);
    const eligibleCircles = (event.invitedCircles ?? []).filter((x) => myCircles.some((v) => v._id === x._id));
    const user = useAppSelector((state) => state.auth.user);
    const [circles, setCircles] = useState<string[]>(eligibleCircles.map((x) => x._id));
    const [circleMessages, setCircleMessages] = useState<CircleMessage[]>([]);
    const [msg, setMsg] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const { handleSubmit, control, formState, reset } = useForm<FormValues>({
        defaultValues: {
            message: '',
        },
    });

    const fetchClubMessage = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await CircleMessageApi.retrieve({ eventGroupId: event.groupId });
            setCircleMessages(data);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }, [event.groupId]);

    useEffect(() => {
        fetchClubMessage();
    }, [event.groupId]);

    const onSendMessage = async (data: FormValues) => {
        if (circles.length === 0) return;
        setLoading(true);
        try {
            const promise = circles.map((x) => {
                const circleMessage = circleMessages.find((v) => v.circle === x);
                if (circleMessage) {
                    const params = {
                        circleMessage: circleMessage._id,
                        user: user?._id,
                        message: data.message,
                        shouldNotify: true,
                    };
                    return CircleCommentApi.create(params);
                } else {
                    const params = {
                        circle: x,
                        poster: user?._id,
                        invitedMembers: [],
                        message: data.message,
                        eventGroupId: event.groupId,
                        shouldNotify: true,
                    };
                    return CircleMessageApi.create(params);
                }
            });
            await Promise.all(promise);
            setMsg('Circle Message has been sent successfully.');
            setTimeout(() => {
                reset({ message: '' });
                setMsg('');
                toggle();
            }, 2000);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    return (
        <ReactNativeModal
            isVisible={isOpen}
            statusBarTranslucent={false}
            hasBackdrop={true}
            backdropOpacity={0.8}
            animationIn="slideInLeft"
            animationInTiming={300}
            animationOut="slideOutRight"
            animationOutTiming={400}
            avoidKeyboard
        >
            <View style={styles.emergencyMessageContainer}>
                <View style={getStyle(['row', 'justify-between', 'align-items-center', 'pb-16'])}>
                    <View />
                    <CTText size={14} bold color={colors.text}>
                        Circle Message
                    </CTText>
                    <TouchableOpacity onPress={toggle}>
                        <Icon type={IconType.Ionicons} name="close" size={25} />
                    </TouchableOpacity>
                </View>
                <View style={getStyle(['row', 'align-items-center', 'flex-wrap', 'py-8'])}>
                    {eligibleCircles.map((x) => (
                        <TouchableOpacity
                            style={getStyle(['row', 'align-items-center', 'mb-8'])}
                            onPress={() => {
                                const newCircles = [...circles];
                                const index = newCircles.indexOf(x._id);
                                if (index >= 0) newCircles.splice(index, 1);
                                else newCircles.push(x._id);
                                setCircles(newCircles);
                            }}
                            key={x._id}
                        >
                            <Icon
                                name={circles.includes(x._id) ? 'checkmark-circle' : 'ellipse-outline'}
                                color={circles.includes(x._id) ? colors.primary : colors.text}
                                type={IconType.Ionicons}
                                size={20}
                            />
                            <CTText style={getStyle('ml-8')}>{x.name}</CTText>
                        </TouchableOpacity>
                    ))}
                </View>
                <CTTextArea
                    name="message"
                    placeholder="Message Here"
                    required
                    validation={{ control, formState, rules: { required: true } }}
                />
                {msg && (
                    <CTText color={colors.primary} center bold style={getStyle('mt-8')}>
                        {msg}
                    </CTText>
                )}
                <CTButton
                    loading={loading}
                    color={colors.primary}
                    disabled={!!msg || loading}
                    onPress={handleSubmit(onSendMessage)}
                    style={getStyle('mt-16')}
                >
                    <CTText center fontFamily={fonts.montserrat.regular} color={colors.white} bold>
                        Send
                    </CTText>
                </CTButton>
            </View>
        </ReactNativeModal>
    );
};

export default SendCircleMsgModal;
