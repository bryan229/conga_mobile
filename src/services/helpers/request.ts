import { RequestTemplate, TimeRange, User, Venue } from '@services/models';
import moment from 'moment';

export const isAvailableRequest = (template: RequestTemplate, date: string, time: string): boolean => {
    const dateIndex = getRequestTemplateDates(template).indexOf(date);
    const timeIndex = template.timeSlots.indexOf(time);
    return template.dateTimeSettings.some((x) => x.date === dateIndex && x.time === timeIndex);
};

export const getRequestTemplateDates = (template: RequestTemplate) => {
    let stDate = template?.stDate;
    const etDate = template?.etDate;
    const dates: string[] = [];
    while (stDate <= etDate) {
        dates.push(stDate);
        stDate = moment(stDate).add(1, 'day').format('YYYY-MM-DD');
    }
    return dates;
};

export const canMakeRequest = ({
    user,
    venue,
    date,
    time,
    timeRange,
}: {
    user: User;
    venue: Venue;
    date: string;
    time?: string;
    timeRange?: TimeRange;
}): boolean => {
    const weekDay = moment(date).weekday();
    const venuePermission = user.memberType.permissions.find((x) => x.venue === venue._id);
    if (!venuePermission) return false;
    const reqAllowTimeRanges = venuePermission.allowSchedTimeRanges.find((x) => x.day === weekDay);
    if (!reqAllowTimeRanges) return false;
    if (time) return reqAllowTimeRanges.timeRanges.some((x) => time >= x.stTime && time <= x.etTime);
    if (timeRange)
        return reqAllowTimeRanges.timeRanges.some((x) => timeRange.stTime >= x.stTime && timeRange.etTime <= x.etTime);
    return false;
};
