import React, { useMemo } from 'react';
import { Circle, SubClub } from '@services/models';
import { View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import { useAppSelector } from '@store/hook';
import moment from 'moment';
import { CIRCLE_MEMBER_STATUS } from '@shared/constants';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import { hasValue } from '@utils';

interface Props {
    circle: Circle;
}

const CircleInfo = ({ circle }: Props) => {
    const theme = useTheme();
    const { colors, getStyle } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const user = useAppSelector((state) => state.auth.user!);

    const invitedMe = circle.members.find((x) => x.user._id === user?._id && x.status === CIRCLE_MEMBER_STATUS.INVITED);

    return (
        <View style={styles.containerStyle}>
            {invitedMe && (
                <CTText
                    fontFamily={fonts.montserrat.bold}
                    bold
                    color={colors.text}
                    center
                    style={getStyle(['pt-8', 'pb-16'])}
                >
                    You received invitation from this circle at{' '}
                    {moment(new Date(invitedMe.updatedDate)).format('MMM DD, YYYY h:mm A')}
                </CTText>
            )}
            <CTText h4 color={colors.text} fontFamily={fonts.montserrat.bold} bold style={getStyle('mb-8')}>
                {circle.name}
            </CTText>
            <View style={getStyle(['row', 'align-items-center'])}>
                <Icon type={IconType.Ionicons} name="person-circle-outline" size={20} color={colors.text} />
                <CTText color={colors.text} fontFamily={fonts.montserrat.bold} size={10} style={getStyle('ml-4')} bold>
                    {circle.leader.fullName}
                </CTText>
            </View>

            <CTText color={colors.text} fontFamily={fonts.montserrat.bold} style={getStyle('my-8')}>
                {circle.description}
            </CTText>
            {(circle.state || circle.county || circle.city) && (
                <View style={getStyle(['row', 'align-items-center', 'mb-8'])}>
                    <Icon name="location" size={20} type={IconType.Ionicons} color={colors.iconPrimary} />
                    <CTText fontFamily={fonts.montserrat.bold} size={10}>
                        {[circle.state, circle.county, circle.city].filter((x) => !!x).join(', ')}
                    </CTText>
                </View>
            )}
            {circle.subClub && (
                <View style={getStyle(['row', 'align-items-center', 'mb-8'])}>
                    <Icon name="business" size={18} type={IconType.Ionicons} color={colors.iconPrimary} />
                    <CTText fontFamily={fonts.montserrat.bold} size={10} bold style={getStyle('ml-8')}>
                        {(circle.subClub as SubClub).name}
                    </CTText>
                </View>
            )}
            <View style={getStyle(['row', 'align-items-center', 'flex-wrap'])}>
                {hasValue(circle.eligibleGender) && (
                    <View style={styles.tagContainerStyle}>
                        <CTText style={getStyle('capitalize')} size={9} fontFamily={fonts.montserrat.bold} bold>
                            {circle.eligibleGender}
                        </CTText>
                    </View>
                )}
                {hasValue(circle.eligibleLevel) && (
                    <View style={styles.tagContainerStyle}>
                        <CTText style={getStyle('capitalize')} size={9} fontFamily={fonts.montserrat.bold} bold>
                            Level: {circle.eligibleLevel?.from} ~ {circle.eligibleLevel?.to}
                        </CTText>
                    </View>
                )}
                {(circle.ageRanges ?? []).length > 0 && (
                    <View style={styles.tagContainerStyle}>
                        <CTText style={getStyle('capitalize')} size={9} fontFamily={fonts.montserrat.bold} bold>
                            {circle.ageRanges?.join(', ')}
                        </CTText>
                    </View>
                )}
            </View>
            <View style={getStyle(['row', 'justify-between', 'align-items-center', 'mt-4'])}>
                <CTText color={colors.text} fontFamily={fonts.montserrat.regular} right size={9} bold>
                    {circle.members.length} members
                </CTText>
                <CTText color={colors.text} fontFamily={fonts.montserrat.regular} right size={9} bold>
                    Since {moment(circle.createdAt).format('MMM DD, YYYY')}
                </CTText>
            </View>
        </View>
    );
};

export default CircleInfo;
