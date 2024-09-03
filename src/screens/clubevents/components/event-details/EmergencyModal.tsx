import { useTheme } from '@services/hooks/useTheme';
import React, { useMemo, useState } from 'react';
import ReactNativeModal from 'react-native-modal';
import createStyles from './style';
import { View } from 'react-native';
import { getStyle } from '@shared/theme/themes';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import { TouchableOpacity } from 'react-native';
import CTText from '@shared/components/controls/ct-text';
import { EMERGENCYMSG_TYPE } from '@shared/constants';
import CTTextArea from '@shared/components/controls/ct-textarea';
import CTButton from '@shared/components/controls/ct-button';
import fonts from '@shared/theme/fonts';
import { ClubEvent } from '@services/models';
import { ClubEventApi } from '@services/api';

interface Props {
    event: ClubEvent;
    isOpen: boolean;
    toggle: () => void;
}

const EmergencyModal = ({ event, isOpen, toggle }: Props) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [messageTypes, setMessageTypes] = useState<number[]>([0]);
    const [message, setMessage] = useState<string>('');
    const [msg, setMsg] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const getMessageTypeOptions = () => {
        return [
            { value: EMERGENCYMSG_TYPE.EMAIL, label: 'Email' },
            { value: EMERGENCYMSG_TYPE.MESSAGE, label: 'Message' },
            { value: EMERGENCYMSG_TYPE.NOTIFICATION, label: 'Notification' },
        ];
    };

    const sendMessage = async () => {
        if (messageTypes.length === 0) return;
        const params = {
            _id: event._id!,
            msgOptions: messageTypes,
            message: message,
        };
        setLoading(true);
        try {
            const { message: resMsg } = await ClubEventApi.emergencyMessage(params);
            setMsg(resMsg);
            setTimeout(() => {
                setMessage('');
                setMessageTypes([0]);
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
                        Emergency Message
                    </CTText>
                    <TouchableOpacity onPress={toggle}>
                        <Icon type={IconType.Ionicons} name="close" size={25} />
                    </TouchableOpacity>
                </View>
                <View style={getStyle(['row', 'justify-between', 'align-items-center', 'py-8'])}>
                    {getMessageTypeOptions().map((x) => (
                        <TouchableOpacity
                            style={getStyle(['row', 'align-items-center'])}
                            onPress={() => {
                                const newMessageTypes = [...messageTypes];
                                const index = newMessageTypes.indexOf(x.value);
                                if (index >= 0) newMessageTypes.splice(index, 1);
                                else newMessageTypes.push(x.value);
                                setMessageTypes(newMessageTypes);
                            }}
                            key={x.value}
                        >
                            <Icon
                                name={messageTypes.includes(x.value) ? 'checkmark-circle' : 'ellipse-outline'}
                                color={messageTypes.includes(x.value) ? colors.secondary : colors.text}
                                type={IconType.Ionicons}
                                size={20}
                            />
                            <CTText style={getStyle('ml-8')}>{x.label}</CTText>
                        </TouchableOpacity>
                    ))}
                </View>
                <CTTextArea value={message} placeholder="Message Here" onChange={(value) => setMessage(value)} />
                {msg && (
                    <CTText color={colors.primary} center bold style={getStyle('mt-8')}>
                        {msg}
                    </CTText>
                )}
                <CTButton loading={loading} color={colors.secondary} onPress={sendMessage} style={getStyle('mt-16')}>
                    <CTText center fontFamily={fonts.montserrat.regular} color={colors.white} bold>
                        Send
                    </CTText>
                </CTButton>
            </View>
        </ReactNativeModal>
    );
};

export default EmergencyModal;
