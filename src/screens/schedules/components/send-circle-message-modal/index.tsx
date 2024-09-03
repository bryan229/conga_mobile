import { useTheme } from '@services/hooks/useTheme';
import moment from 'moment-timezone';
import React, { useEffect, useMemo, useState } from 'react';
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
import { useAppDispatch, useAppSelector } from '@store/hook';
import { Circle, Schedule } from '@services/models';
import { CircleMessageApi } from '@services/api';
import { useForm } from 'react-hook-form';
import { handleError } from '@store/actions';

interface Props {
    schedule: Schedule;
    isOpen: boolean;
    toggle: () => void;
    callback: () => void;
}

type FormValues = {
    message: string;
};

const SendCircleMsgModal = ({ schedule, isOpen, toggle, callback }: Props) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const myCircles = useAppSelector((state) => state.club.myCircles);
    const user = useAppSelector((state) => state.auth.user);
    const [circles, setCircles] = useState<Circle[]>([]);
    const [msg, setMsg] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const { handleSubmit, control, formState, reset } = useForm<FormValues>({
        defaultValues: {
            message: '',
        },
    });

    useEffect(() => {
        if (isOpen)
            reset({
                message: `Hi. I have reserved "${schedule.venue.courtDisplayName} ${schedule.court + 1}", "${
                    schedule.venue.displayName
                }" at ${schedule.time} and ${moment(schedule.date).format(
                    'MMM D'
                )}. This message is going to members of selected circle to give you first shot at signing up.  Please follow the prompts on a notification on your mobile device to join.`,
            });
    }, [isOpen]);

    useEffect(() => {
        reset({
            message: `Hi. I have reserved "${schedule.venue.courtDisplayName} ${schedule.court + 1}", "${
                schedule.venue.displayName
            }" at ${schedule.time} and ${moment(schedule.date).format('MMM D')}. This message is going to members of ${
                circles.length === 0 ? 'selected circle' : circles.map((x) => x.name).join(', ')
            } to give you first shot at signing up.  Please follow the prompts on a notification on your mobile device to join.`,
        });
    }, [circles]);

    const onSendMessage = async (data: FormValues) => {
        if (circles.length === 0) return;
        try {
            setLoading(true);
            const promise = circles.map((x) => {
                const params = {
                    circle: x._id,
                    poster: user?._id,
                    invitedMembers: [],
                    message: data.message,
                    schedule: schedule._id,
                    shouldNotify: true,
                };
                return CircleMessageApi.create(params);
            });
            await Promise.all(promise);
            setMsg('Circle Message has been sent successfully.');
            setTimeout(() => {
                reset({ message: '' });
                setMsg('');
                toggle();
                callback();
            }, 1000);
        } catch (error) {
            console.log(error);
            dispatch(handleError(error));
        } finally {
            setLoading(false);
        }
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
                    {myCircles.map((x) => (
                        <TouchableOpacity
                            style={getStyle(['row', 'align-items-center', 'mb-8', 'mr-16'])}
                            onPress={() => {
                                const newCircles = [...circles];
                                const index = newCircles.findIndex((v) => v._id === x._id);
                                if (index >= 0) newCircles.splice(index, 1);
                                else newCircles.push(x);
                                setCircles(newCircles);
                            }}
                            key={x._id}
                        >
                            <Icon
                                name={circles.some((v) => v._id === x._id) ? 'checkmark-circle' : 'ellipse-outline'}
                                color={circles.some((v) => v._id === x._id) ? colors.primary : colors.text}
                                type={IconType.Ionicons}
                                size={20}
                            />
                            <CTText style={getStyle('ml-8')}>{x.name}</CTText>
                        </TouchableOpacity>
                    ))}
                </View>
                <CTText color={colors.secondary} size={9} center bold style={getStyle('my-8')}>
                    If you send circle message to circle members, this timeslot will be shared.
                </CTText>
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
                    disabled={!!msg || loading || circles.length === 0}
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
