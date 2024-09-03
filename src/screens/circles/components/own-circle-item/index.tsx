import { useTheme } from '@services/hooks/useTheme';
import { Circle, SubClub } from '@services/models';
import CTText from '@shared/components/controls/ct-text';
import createStyles from './style';
import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import fonts from '@shared/theme/fonts';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import moment from 'moment';
import { getStyle } from '@shared/theme/themes';
import { CIRCLE_MEMBER_STATUS, CIRCLE_STATUS } from '@shared/constants';
import { useAppNavigation } from '@services/hooks/useNavigation';
import { hasValue } from '@utils';

interface Props {
    circle: Circle;
    onPress: () => void;
}

const OwnCircleItem = ({ circle, onPress }: Props) => {
    const theme = useTheme();
    const { colors } = theme;
    const navigation = useAppNavigation();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const requestMembers = circle.members.filter((x) => x.status === CIRCLE_MEMBER_STATUS.REQUESTED);

    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.7} onPress={onPress}>
            <View style={getStyle(['row', 'align-items-center', 'justify-between'])}>
                <View>
                    <CTText h4 color={colors.text} fontFamily={fonts.montserrat.bold} bold>
                        {circle.name}
                    </CTText>
                    <CTText color={colors.text} fontFamily={fonts.montserrat.regular} size={9}>
                        Since {moment(circle.createdAt).format('MMM DD, YYYY')}
                    </CTText>
                </View>
                {requestMembers.length > 0 && (
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('CircleMessage', { initScreen: 'CircleInfo', circleId: circle._id })
                        }
                    >
                        <View style={getStyle(['row', 'justify-center'])}>
                            <Icon type={IconType.Ionicons} name="people" color={colors.danger} size={25} />
                        </View>
                        <CTText fontFamily={fonts.montserrat.bold} size={9} color={colors.danger}>
                            {requestMembers.length} requests
                        </CTText>
                    </TouchableOpacity>
                )}
            </View>
            <CTText
                color={colors.text}
                fontFamily={fonts.montserrat.bold}
                numberOfLines={2}
                ellipsizeMode="tail"
                style={getStyle('my-8')}
            >
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
            <View style={getStyle(['row', 'justify-between', 'align-items-center'])}>
                <CTText color={colors.text} fontFamily={fonts.montserrat.regular} size={9}>
                    {circle.members.length} members
                </CTText>
                {circle.status !== CIRCLE_STATUS.ACTIVATED && (
                    <CTText
                        color={circle.status === CIRCLE_STATUS.BLOCKED ? colors.danger : colors.secondary}
                        fontFamily={fonts.montserrat.regular}
                        bold
                        size={10}
                    >
                        {circle.status.toUpperCase()}
                    </CTText>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default OwnCircleItem;
