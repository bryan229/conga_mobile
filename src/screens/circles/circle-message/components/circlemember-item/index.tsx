import { useTheme } from '@services/hooks/useTheme';
import { CircleMember } from '@services/models';
import CTText from '@shared/components/controls/ct-text';
import createStyles from './style';
import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import fonts from '@shared/theme/fonts';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import moment from 'moment';
import { getStyle } from '@shared/theme/themes';
import CPAvatar from '@shared/components/avatar';
import { CIRCLE_MEMBER_STATUS } from '@shared/constants';

interface Props {
    member: CircleMember;
    isLeader?: boolean;
    selected: boolean;
    showSelectSign: boolean;
    onPress?: () => void;
}

const CircleMemberItem = ({ member, isLeader = false, selected, showSelectSign, onPress }: Props) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.7} onPress={onPress}>
            <View style={getStyle(['row', 'align-items-center', 'justify-between'])}>
                <View style={getStyle(['row', 'align-items-center'])}>
                    <CPAvatar source={member.user.photoUrl} name={member.user.fullName} size={40} />
                    <View style={getStyle('ml-8')}>
                        <CTText fontFamily={fonts.montserrat.bold} bold style={getStyle('mb-4')}>
                            {member.user.fullName} {isLeader ? '(Leader)' : ''}
                        </CTText>
                        <CTText fontFamily={fonts.montserrat.bold} size={9}>
                            <CTText
                                fontFamily={fonts.montserrat.bold}
                                size={8}
                                color={member.status === CIRCLE_MEMBER_STATUS.REQUESTED ? colors.primary : colors.text}
                                bold
                            >
                                {member.status.toUpperCase()}: &nbsp;&nbsp;
                            </CTText>
                            {moment(member.updatedDate).format('MMM DD, YYYY')}
                        </CTText>
                    </View>
                </View>
                {showSelectSign && (
                    <View>
                        {selected ? (
                            <Icon
                                type={IconType.Ionicons}
                                name="checkmark-circle-outline"
                                size={25}
                                color={colors.primary}
                            />
                        ) : (
                            <Icon type={IconType.Ionicons} name="ellipse-outline" size={25} />
                        )}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default CircleMemberItem;
