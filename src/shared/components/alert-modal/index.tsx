import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import ReactNativeModal from 'react-native-modal';
import createStyles from './style';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import { AlertModalState } from '@services/types';
import CTText from '../controls/ct-text';
import fonts from '@shared/theme/fonts';

interface CPAlertModalProps {
    isVisible: boolean;
    toggle: () => void;
    alertData: AlertModalState;
}

const CPAlertModal: React.FC<CPAlertModalProps> = ({ isVisible, toggle, alertData }) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const { type, title, message, buttons, data, handler } = alertData;

    const AlertIcon = () => {
        if (type === 'success')
            return (
                <Icon
                    name="ios-checkmark-done-circle-outline"
                    type={IconType.Ionicons}
                    color={colors.iconPrimary}
                    size={35}
                />
            );
        if (type === 'question')
            return <Icon name="ios-help-circle-outline" type={IconType.Ionicons} color={colors.calpyse} size={35} />;
        if (type === 'error')
            return <Icon name="ios-close-circle-outline" type={IconType.Ionicons} color={colors.danger} size={35} />;
        if (type === 'warning')
            return <Icon name="warning-outline" type={IconType.Ionicons} color={colors.secondary} size={35} />;
        return <Icon name="information-circle-outline" type={IconType.Ionicons} color={colors.calpyse} size={35} />;
    };

    const Message = () => (
        <View style={styles.messageContainerStyle}>
            {title && (
                <CTText style={styles.titleStyle} fontFamily={fonts.montserrat.bold} h3 color={colors.text}>
                    {title}
                </CTText>
            )}
            {typeof message === 'string' ? <CTText>{message}</CTText> : <View>{message}</View>}
        </View>
    );

    const Buttons = () => (
        <View style={styles.buttonContainerStyle}>
            {(buttons || [{ value: 'ok', label: 'Ok', type: 'ok' }]).map((button, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => {
                        if (handler) handler(button.value, data);
                        toggle();
                    }}
                >
                    <CTText
                        style={
                            button.type === 'normal'
                                ? styles.normalButtonStyle
                                : button.type === 'cancel'
                                ? styles.dangerButtonStyle
                                : styles.cancelButtonStyle
                        }
                        color={
                            button.type === 'normal'
                                ? colors.black
                                : button.type === 'cancel'
                                ? colors.danger
                                : colors.primary
                        }
                    >
                        {button.label}
                    </CTText>
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <ReactNativeModal
            isVisible={isVisible}
            // hasBackdrop={false}
            backdropOpacity={0.8}
            animationIn="fadeIn"
            animationInTiming={50}
            animationOut="fadeOut"
            animationOutTiming={100}
            onBackdropPress={() => {
                if (handler) handler('no', data);
                toggle();
            }}
        >
            <View style={styles.containerStyle}>
                <View style={styles.alertContainerStyle}>
                    <AlertIcon />
                    <Message />
                </View>
                <Buttons />
            </View>
        </ReactNativeModal>
    );
};

export default CPAlertModal;
