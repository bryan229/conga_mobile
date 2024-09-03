import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import createStyles from './style';
import { useTheme } from '@services/hooks/useTheme';
import CTText from '@shared/components/controls/ct-text';
import { getStyle } from '@shared/theme/themes';
import fonts from '@shared/theme/fonts';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { handleError, showAlert } from '@store/actions';
import { CircleMessageApi } from '@services/api';
import { TouchableOpacity } from 'react-native';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import { CircleMessage } from '@services/models';
import CTTextArea from '@shared/components/controls/ct-textarea';
import CTButton from '@shared/components/controls/ct-button';
import { useForm } from 'react-hook-form';

type FormValues = {
    msg: string;
};

type Props = {
    message?: CircleMessage;
    isOpen: boolean;
    toggle: () => void;
    callback: () => void;
};

const ContactClubForClubEventModal = ({ message, isOpen, toggle, callback }: Props) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [loading, setLoading] = useState<boolean>(false);
    const { handleSubmit, control, formState, setValue } = useForm<FormValues>({
        defaultValues: {
            msg: '',
        },
    });

    useEffect(() => {
        if (!isOpen) setValue('msg', '');
    }, [isOpen]);

    if (!message) return null;

    const sendMessage = async (data: FormValues) => {
        setLoading(true);
        try {
            // const params = {
            //     _id: message._id,
            //     message: data.msg.replaceAll('\n', '<br>'),
            // };
            // const res = await CircleMessageApi.requestClubEvent(params);
            // dispatch(
            //     showAlert({
            //         type: 'success',
            //         title: 'Success',
            //         message: res.message ?? 'Your request has been sent to the club.',
            //     })
            // );
            // setLoading(false);
            // callback();
            // toggle();
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
                <View style={getStyle(['row', 'align-items-center', 'px-16', 'pt-16', 'pb-8', 'justify-between'])}>
                    <CTText fontFamily={fonts.montserrat.regular} color={colors.text} bold size={12}>
                        Contact to Club
                    </CTText>
                    <TouchableOpacity onPress={toggle}>
                        <Icon type={IconType.Ionicons} name="close" size={25} />
                    </TouchableOpacity>
                </View>
                <View style={getStyle(['px-16', 'pb-16'])}>
                    <CTTextArea
                        style={getStyle(['mt-8', 'mb-4'])}
                        name="msg"
                        label="Message"
                        placeholder={`Hello. My name is ${user?.fullName}.\nMy friends and I are planning a tennis game and want to hold a new event.\nPlace: Indoor Tennis Court\nTime: 20 Jan 2024 9:00 AM ~ 12:00 PM\nDuration: 2hrs`}
                        required={true}
                        validation={{
                            control,
                            formState,
                            rules: { required: true },
                        }}
                    />
                    <CTText
                        fontFamily={fonts.montserrat.regular}
                        size={10}
                        color={colors.text}
                        style={getStyle('mb-16')}
                    >
                        {`Please provide correct place, time range and duration you want.`}
                    </CTText>
                    <CTButton loading={loading} onPress={handleSubmit(sendMessage)}>
                        <CTText fontFamily={fonts.montserrat.regular} color={colors.white} center bold>
                            Send
                        </CTText>
                    </CTButton>
                </View>
            </View>
        </ReactNativeModal>
    );
};

export default ContactClubForClubEventModal;
