import React, { useMemo } from 'react';
import { useTheme } from '@services/hooks/useTheme';
import { ClubEvent } from '@services/models';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import { useAppSelector } from '@store/hook';
import moment from 'moment-timezone';
import { View } from 'react-native';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import createStyles from './style';
import { hasValue, htmlToString } from '@utils';
import { getMemberTypeName } from '@services/helpers/user';
import CPAvatar from '@shared/components/avatar';
import { getEventSponsorName, getEventSponsorPhoto, getTotalRegUserCount } from '@services/helpers/clubevent';
import { CLUBEVENT_REG_RESTRICT_TYPE, GENDER, VENUE_TYPE } from '@shared/constants';
import { getStyle } from '@shared/theme/themes';
import { isUserDefinedResource } from '@services/helpers/resource';

interface Props {
    event: ClubEvent;
}

const EventDetails = ({ event }: Props) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const club = useAppSelector((state) => state.club.club);
    const myClubs = useAppSelector((state) => state.club.myClubs);
    const memberTypes = useAppSelector((state) => state.club.memberTypes);

    const hasDiscount = () => {
        return myClubs.some((x) => x._id === event.club._id) && !event.isFree && event.price && event.discount;
    };

    const getCourtsOrLocations = () => {
        if (!event.venue) return '';
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

    const getInvitedMembers = () => {
        if (event.regRestrictType === CLUBEVENT_REG_RESTRICT_TYPE.ONLY_CIRCLE_MEMBERS) return 'Only Circle Members';
        if (event.regRestrictType === CLUBEVENT_REG_RESTRICT_TYPE.ONLY_CLUB_MEMBERS) {
            const allowClubEventMemberTypes = memberTypes.filter((x) => x.isAllowClubEvent);
            if (
                (event.invitedMemberTypes || []).length === 0 ||
                allowClubEventMemberTypes.every((x) => (event.invitedMemberTypes ?? []).includes(x._id))
            )
                return 'All Club Members';
            return (event.invitedMemberTypes || [])
                .map((x) => getMemberTypeName(x))
                .filter((x) => !!x)
                .join(', ');
        }
        if (event.regRestrictType === CLUBEVENT_REG_RESTRICT_TYPE.ONLY_SUBCLUB_MEMBERS) {
            return 'Only Guests';
        }
        if (event.regRestrictType === CLUBEVENT_REG_RESTRICT_TYPE.PARTICULAR_AREA)
            return `Particular Area (${event.invitedZipCode})`;
        return 'All Members';
    };

    const EventTitle = () => (
        <View style={getStyle(['row', 'align-items-center', 'justify-between', 'mb-8'])}>
            <CTText h4 color={colors.text} fontFamily={fonts.montserrat.bold}>
                {event.title}
            </CTText>
            {event.isRequireReg && (
                <View style={getStyle(['row', 'align-items-center'])}>
                    <Icon name="people" type={IconType.Ionicons} size={18} color={colors.iconPrimary} />
                    <CTText style={getStyle(['ml-8'])} size={10} fontFamily={fonts.montserrat.bold}>
                        <CTText fontFamily={fonts.montserrat.bold}>{event.maxRegCount || '--'}</CTText>
                        <CTText color={colors.placeholder}>&nbsp;|&nbsp;</CTText>
                        <CTText fontFamily={fonts.montserrat.bold} color={colors.primary}>
                            {getTotalRegUserCount(event)}
                        </CTText>
                    </CTText>
                </View>
            )}
        </View>
    );

    const EventDate = () => (
        <View style={getStyle(['row', 'align-items-center', 'mt-8'])}>
            <Icon name="calendar-outline" size={18} type={IconType.Ionicons} color={colors.iconPrimary} />
            <CTText style={getStyle(['ml-8'])} size={10} fontFamily={fonts.montserrat.bold} color={colors.text}>
                {moment(event.start).format('MMM DD, YYYY h:mm A')} ~ {moment(event.end).format('h:mm A')}
            </CTText>
        </View>
    );

    const EventDescription = () => {
        if (!htmlToString(event.description)) return null;
        return (
            <CTText h5 color={colors.placeholder} style={getStyle('mt-8')} numberOfLines={3} ellipsizeMode="tail">
                {htmlToString(event.description)}
            </CTText>
        );
    };

    const EventTypeAndInvitedMemberTypes = () => {
        return (
            <View style={getStyle(['row', 'align-items-center', 'my-8', 'flex-wrap'])}>
                <View style={styles.tagContainerStyle}>
                    <CTText style={getStyle('capitalize')} size={9} fontFamily={fonts.montserrat.bold} bold>
                        {event.eventType}
                    </CTText>
                </View>
                <View style={styles.tagContainerStyle}>
                    <CTText fontFamily={fonts.montserrat.bold} size={9} bold>
                        {getInvitedMembers()}
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
                        <View style={getStyle(['row', 'align-items-center'])}>
                            <CTText style={getStyle('capitalize')} size={9} fontFamily={fonts.montserrat.bold} bold>
                                ${(event.price ?? 0) - (hasDiscount() ? (event.price ?? 0) * (event.discount ?? 0) : 0)}
                            </CTText>
                            {hasDiscount() ? (
                                <CTText
                                    size={9}
                                    color={colors.danger}
                                    style={[styles.strikeThroughStyle, getStyle('ml-4')]}
                                >
                                    ${event.price}
                                </CTText>
                            ) : null}
                        </View>
                    </View>
                )}
            </View>
        );
    };

    const EventSponsor = () => {
        if (!event.sponsor) return null;
        return (
            <View style={getStyle(['row', 'align-items-center'])}>
                <CPAvatar name={getEventSponsorName(event)} source={getEventSponsorPhoto(event)} />
                <CTText style={getStyle(['ml-8'])} fontFamily={fonts.montserrat.bold}>
                    {getEventSponsorName(event)}
                </CTText>
            </View>
        );
    };

    const EventLocation = () => {
        if (event.venue)
            return (
                <View style={getStyle(['row', 'align-items-center', 'mb-8'])}>
                    <Icon name="location" size={20} type={IconType.Ionicons} color={colors.iconPrimary} />
                    <CTText style={getStyle(['capitalize', 'ml-8'])} size={10} fontFamily={fonts.montserrat.bold}>
                        {event.venue?.displayName}
                        {getCourtsOrLocations() && (
                            <CTText>
                                &nbsp;<CTText color={colors.placeholder}>|</CTText> &nbsp;{getCourtsOrLocations()}
                            </CTText>
                        )}
                    </CTText>
                </View>
            );
        if (event.resource)
            return (
                <View style={getStyle(['row', 'align-items-center', 'mb-8'])}>
                    <Icon name="location" size={20} type={IconType.Ionicons} color={colors.iconPrimary} />
                    <View style={getStyle('ml-8')}>
                        <CTText size={10} fontFamily={fonts.montserrat.regular}>
                            {isUserDefinedResource(event.resource)
                                ? event.resource.clubName
                                : event.resource.subClub?.name}{' '}
                            {event.resource.name}
                        </CTText>
                        {isUserDefinedResource(event.resource) && (
                            <CTText
                                size={10}
                                fontFamily={fonts.montserrat.regular}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {event.resource.city}, {event.resource.county}, {event.resource.state}
                            </CTText>
                        )}
                        {!isUserDefinedResource(event.resource) && event.resource.address && (
                            <CTText
                                size={10}
                                fontFamily={fonts.montserrat.regular}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {event.resource.address}
                            </CTText>
                        )}
                    </View>
                </View>
            );
        return null;
    };

    const EventCircle = () => {
        if (
            event.regRestrictType !== CLUBEVENT_REG_RESTRICT_TYPE.ONLY_CIRCLE_MEMBERS ||
            (event.invitedCircles ?? []).length === 0
        )
            return null;
        return (
            <View style={getStyle(['row', 'align-items-center', 'mb-8'])}>
                <Icon name="people-circle-outline" size={20} type={IconType.Ionicons} color={colors.iconPrimary} />
                <CTText
                    style={getStyle(['ml-8'])}
                    size={10}
                    fontFamily={fonts.montserrat.bold}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {event.invitedCircles?.map((x) => x.name).join(', ')}
                </CTText>
            </View>
        );
    };
    const EventGuests = () => {
        if (event.regRestrictType !== CLUBEVENT_REG_RESTRICT_TYPE.ONLY_SUBCLUB_MEMBERS || !event.resource?.subClub)
            return null;
        return (
            <View style={getStyle(['row', 'align-items-center', 'mb-8'])}>
                <Icon name="people-circle-outline" size={20} type={IconType.Ionicons} color={colors.iconPrimary} />
                <CTText
                    style={getStyle(['ml-8'])}
                    size={10}
                    fontFamily={fonts.montserrat.bold}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {event.resource.subClub?.name} Guests
                </CTText>
            </View>
        );
    };

    return (
        <View>
            <EventTitle />
            <EventDate />
            <EventDescription />
            <EventTypeAndInvitedMemberTypes />
            <EventCircle />
            <EventGuests />
            <EventLocation />
            <EventSponsor />
        </View>
    );
};

export default EventDetails;
