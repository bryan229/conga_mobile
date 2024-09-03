import { Club, Schedule, User, Venue } from '@services/models';
import { SCHEDULE_STATUS } from '@shared/constants';
import { getTimeZoneMoment } from '@utils';
import moment from 'moment';
import { getVenue } from './club';

export const isInvitedSchedule = (schedule: Schedule, user: User): boolean => {
    return schedule.owner?._id !== user._id;
};

export const isOwnerSchedule = (schedule: Schedule, user: User): boolean => {
    return schedule.owner?._id === user._id;
};

export const isSharedSchedule = (schedule: Schedule, user: User) => {
    if (isOwnerSchedule(schedule, user)) return false;
    return (schedule.members || []).some((x) => x.email === user.email && x.isShareUser);
};

export const isNoShow = (schedule: Schedule, club: Club): boolean => {
    return getTimeZoneMoment(club.timezone).isAfter(moment(`${schedule.date} ${schedule.time}`).add(5, 'minutes'));
};

export const getCurrentScheduleDates = (club: Club, venue: Venue) => {
    let stDate = getTimeZoneMoment(club.timezone).format('YYYY-MM-DD');
    const etDate = venue.rsEtDate;
    const dates: string[] = [];
    while (stDate <= etDate) {
        dates.push(stDate);
        stDate = moment(stDate).add(1, 'day').format('YYYY-MM-DD');
    }
    return dates;
};

export const isAvailableTimeSlotCourt = (venue: Venue, schedule: Schedule): boolean => {
    return (
        (venue.setting?.curtTimeSlots || []).includes(schedule.time) &&
        (venue.setting?.curtActivatedCourts || []).includes(schedule.court)
    );
};

export const isOpenSchedule = (schedule: Schedule): boolean => {
    return schedule.status === SCHEDULE_STATUS.CANCELED || schedule.status === SCHEDULE_STATUS.OPEN;
};

export const isMySchedule = (venue: Venue, schedule: Schedule, user: User): boolean => {
    if (!schedule.owner) return false;
    if (isOwnerSchedule(schedule, user)) return true;
    return venue?.setting?.ruleSettings?.isReqOtherPyName && schedule.members.some((x) => x.email === user.email);
};

export const isChallengeSchedule = (club: Club, venue: Venue, schedule: Schedule): boolean => {
    return (
        venue.setting?.ruleSettings?.canMakeChallenge &&
        schedule.date <= getTimeZoneMoment(club.timezone).format('YYYY-MM-DD')
    );
};

export const isInMemberTypePermission = (schedule: Schedule, user: User, club: Club): boolean => {
    let date = schedule.date,
        time = schedule.time;
    let weekDay = moment(schedule.date).weekday();
    const venuePermission = user.memberType.permissions.find((x) => x.venue === schedule.venue._id);
    if (!venuePermission?.isAllowReserveOTS || !venuePermission.isAllowSched) return false;
    if (
        venuePermission.reserveOTSAdvancedDay > -1 &&
        getTimeZoneMoment(club.timezone).add(venuePermission.reserveOTSAdvancedDay, 'days').format('YYYY-MM-DD') < date
    )
        return false;
    return venuePermission.allowSchedTimeRanges.some(
        (x) => x.day === weekDay && x.timeRanges.some((v) => time >= v.stTime && time <= v.etTime)
    );
};

export const isForwardSchedule = (schedule: Schedule, club: Club): boolean => {
    const venue = getVenue(club, schedule.venue._id);
    return (
        getTimeZoneMoment(club.timezone)
            .subtract(venue?.setting.timeSlotInterval || 0, 'minutes')
            .format('HH:mm') <= schedule.time
    );
};
