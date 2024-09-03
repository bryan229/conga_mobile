import { useTheme } from '@services/hooks/useTheme';
import { ChatList } from '@services/models';
import CTText from '@shared/components/controls/ct-text';
import createStyles from './style';
import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import moment from 'moment';
import { getStyle } from '@shared/theme/themes';
import CPAvatar from '@shared/components/avatar';

interface Props {
    chatList: ChatList;
    onPress: () => void;
}

const ChatListItem = ({ chatList, onPress }: Props) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.7} onPress={onPress}>
            <View style={getStyle(['row', 'align-items-center'])}>
                <View style={styles.avatarContainer}>
                    <CPAvatar source={chatList.partnerId.photoUrl} name={chatList.partnerId.fullName} size={40} />
                    {!chatList.isRead && <View style={styles.unReadBadgeStyle} />}
                </View>
                <View style={getStyle(['ml-8', 'col'])}>
                    <View style={getStyle(['row', 'align-items-center', 'justify-between', 'mb-4'])}>
                        <CTText bold color={colors.text} style={getStyle('col')}>
                            {chatList.partnerId.fullName}
                        </CTText>
                        <CTText color={colors.darkGray} size={8}>
                            {moment(chatList.updatedAt).format('MMM DD, h:mm A')}
                        </CTText>
                    </View>
                    <View>
                        <CTText
                            color={colors.darkGray}
                            bold={!chatList.isRead}
                            size={10}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {chatList.latestMsg}
                        </CTText>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ChatListItem;
