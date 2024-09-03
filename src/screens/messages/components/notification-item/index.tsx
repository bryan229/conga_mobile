import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import moment from 'moment-timezone';
import createStyles from './style';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import { getStyle } from '@shared/theme/themes';
import { Notification } from '@services/types';
import { CLUBMSG_TYPE } from '@shared/constants';

interface Props {
    notification: Notification;
    onPress: () => void;
    onDelete: () => void;
}

const NotificationItem = ({ notification, onPress, onDelete }: Props) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);

    const renderContent = () => (
        <>
            {notification.type === 'NOTIFICATION' && (
                <TouchableOpacity style={styles.closeBtnStyle} onPress={onDelete}>
                    <Icon name="close" type={IconType.Ionicons} size={30} />
                </TouchableOpacity>
            )}
            <CTText fontFamily={fonts.montserrat.medium} style={getStyle('mb-8')} color={colors.text}>
                {notification.title}
            </CTText>
            <CTText style={getStyle('mb-8')}>{notification.message}</CTText>
            <CTText style={getStyle('mb-8')} color={colors.darkGray} right size={9}>
                {moment(notification.date).format(
                    notification.type === 'CLUB_MSG' ? 'MMM DD, YYYY' : 'MMM DD, YYYY h:mm A'
                )}
            </CTText>
        </>
    );

    const canClick =
        notification.type === 'NOTIFICATION' ||
        (notification.type === 'CLUB_MSG' && notification.data?.type === CLUBMSG_TYPE.CLUB_EVENT);

    if (canClick)
        return (
            <TouchableOpacity style={styles.itemContainerStyle} onPress={onPress}>
                {renderContent()}
            </TouchableOpacity>
        );
    return <View style={styles.itemContainerStyle}>{renderContent()}</View>;
};

export default NotificationItem;
