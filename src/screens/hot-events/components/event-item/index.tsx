import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import moment from 'moment-timezone';
import createStyles from './style';
import { ClubEvent } from '@services/models';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import { getTotalRegUserCount, isPublicEventOfMclClub } from '@services/helpers/clubevent';
import { hasValue, htmlToString } from '@utils';
import CPAvatar from '@shared/components/avatar';
import { getStyle } from '@shared/theme/themes';
import { CLUBEVENT_REG_RESTRICT_TYPE, CLUB_TYPE, GENDER, VENUE_TYPE } from '@shared/constants';
import { useAppSelector } from '@store/hook';

interface Props {
    event: ClubEvent;
    onPress: () => void;
}

const HotEventItem = ({ event, onPress }: Props) => {
    const theme = useTheme();
    const clubs = useAppSelector((state) => state.club.clubs);
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const congaClub = clubs.find((x) => x.type === CLUB_TYPE.VIRTUAL);

    const getCourtsOrLocations = () => {
        if (!event.venue) return '';
        const club = clubs.find((x) => x._id === event.club?._id);
        if (!club) return '';
        const venue = club?.venues.find((x) => x._id === (event.venue?._id ?? event.venue));
        if (!venue) return '';
        if (venue.type === VENUE_TYPE.REAL) {
            if ((event.courts ?? []).length > 0) {
                if ((venue.setting.curtActivatedCourts ?? []).every((x) => event.courts!.includes(x)))
                    return `All ${venue.courtDisplayName}`;
                return `${venue.courtDisplayName} ${event.courts?.map((x) => x + 1).join(', ')}`;
            }
        } else if (venue.type === VENUE_TYPE.VIRTUAL) return (event.locations || []).join(', ');
        return '';
    };

    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.7} onPress={onPress}>
            <CTText h4 color={colors.text} fontFamily={fonts.montserrat.bold}>
                {event.title}
            </CTText>
            <View style={getStyle(['row', 'align-items-center', 'mt-8'])}>
                <Icon name="calendar-outline" size={18} type={IconType.Ionicons} color={colors.iconPrimary} />
                <CTText style={getStyle(['ml-8'])} size={10} fontFamily={fonts.montserrat.bold} color={colors.text}>
                    {moment(event.start).format('MMM DD, YYYY h:mm A')} ~ {moment(event.end).format('h:mm A')}
                </CTText>
            </View>
            <CTText h5 color={colors.placeholder} style={getStyle('mt-8')} numberOfLines={3} ellipsizeMode="tail">
                {htmlToString(event.description)}
            </CTText>
            <View style={getStyle(['row', 'align-items-center', 'my-8', 'flex-wrap'])}>
                <View style={styles.tagContainerStyle}>
                    <CTText style={getStyle('capitalize')} size={9} fontFamily={fonts.montserrat.bold} bold>
                        {event.eventType}
                    </CTText>
                </View>
                <View style={styles.tagContainerStyle}>
                    <CTText fontFamily={fonts.montserrat.bold} size={9} bold>
                        {event.regRestrictType === CLUBEVENT_REG_RESTRICT_TYPE.ONLY_CIRCLE_MEMBERS
                            ? 'Only Circle Members'
                            : event.regRestrictType === CLUBEVENT_REG_RESTRICT_TYPE.ALL_MEMBERS
                            ? 'All Members'
                            : event.regRestrictType === CLUBEVENT_REG_RESTRICT_TYPE.PARTICULAR_AREA
                            ? `Particular Area (${event.invitedZipCode})`
                            : event.regRestrictType === CLUBEVENT_REG_RESTRICT_TYPE.ONLY_SUBCLUB_MEMBERS
                            ? 'Only Guests'
                            : 'All Club Members'}
                    </CTText>
                </View>
                {hasValue(event.eligibleGender) &&
                    (event.eligibleGender === GENDER.MALE || event.eligibleGender === GENDER.FEMALE) && (
                        <View style={styles.tagContainerStyle}>
                            <CTText style={getStyle('capitalize')} size={9} fontFamily={fonts.montserrat.bold} bold>
                                {event.eligibleGender === GENDER.MALE
                                    ? 'Male'
                                    : event.eligibleGender === GENDER.FEMALE
                                    ? 'Female'
                                    : ''}
                            </CTText>
                        </View>
                    )}
                {hasValue(event.eligibleLevel) && (
                    <View style={styles.tagContainerStyle}>
                        <CTText style={getStyle('capitalize')} size={9} fontFamily={fonts.montserrat.bold} bold>
                            Level: {event.eligibleLevel?.from} ~ {event.eligibleLevel?.to}
                        </CTText>
                    </View>
                )}
                {!event.isFree && hasValue(event.price) && (
                    <View style={styles.tagContainerStyle}>
                        <CTText style={getStyle('capitalize')} size={9} fontFamily={fonts.montserrat.bold} bold>
                            $ {event.price}
                        </CTText>
                    </View>
                )}
            </View>
            {isPublicEventOfMclClub(event) ? (
                <View style={getStyle(['row', 'align-items-center', 'mb-8'])}>
                    <Icon name="location" size={18} type={IconType.Ionicons} color={colors.iconPrimary} />
                    <CTText style={getStyle('ml-8')} size={10} fontFamily={fonts.montserrat.bold}>
                        {event.club?.displayName} {event.venue?.displayName ?? ''} {getCourtsOrLocations()}
                    </CTText>
                </View>
            ) : (
                <View style={getStyle(['row', 'align-items-center', 'mb-8'])}>
                    <Icon name="location" size={18} type={IconType.Ionicons} color={colors.iconPrimary} />
                    <CTText style={getStyle('ml-8')} size={10} fontFamily={fonts.montserrat.bold}>
                        {event.resource?.subClub?.name} {event.resource?.name}
                    </CTText>
                </View>
            )}
            <View style={getStyle(['row', 'align-items-center', 'justify-between'])}>
                <View style={getStyle(['row', 'align-items-center'])}>
                    <CPAvatar name={congaClub?.displayName} source={congaClub?.logoUrl} />
                    <CTText
                        style={getStyle('ml-8')}
                        fontFamily={fonts.montserrat.bold}
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        size={12}
                        bold
                    >
                        {congaClub?.displayName}
                    </CTText>
                </View>
                {event.isRequireReg && (
                    <View style={getStyle(['row', 'align-items-center'])}>
                        <Icon name="people" type={IconType.Ionicons} size={18} color={colors.iconPrimary} />
                        <CTText style={getStyle('ml-8')} fontFamily={fonts.montserrat.bold}>
                            <CTText fontFamily={fonts.montserrat.bold}>{event.maxRegCount || '--'}</CTText>
                            <CTText color={colors.placeholder}>&nbsp;|&nbsp;</CTText>
                            <CTText fontFamily={fonts.montserrat.bold} color={colors.primary}>
                                {getTotalRegUserCount(event)}
                            </CTText>
                        </CTText>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default HotEventItem;
