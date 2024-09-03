import { Circle, ClubEvent, User } from '@services/models';
import { CLUBEVENT_REG_RESTRICT_TYPE, CLUB_TYPE } from '@shared/constants';
import store from '@store';

export const getEventSponsorPhoto = (event: ClubEvent) => {
    if (!event.sponsor) return '';
    return typeof event.sponsor === 'string' ? '' : event.sponsor?.photoUrl;
};

export const getEventSponsorName = (event: ClubEvent) => {
    if (!event.sponsor) return '';
    return typeof event.sponsor === 'string' ? '' : event.sponsor?.fullName;
};

export const getTotalRegUserCount = (event: ClubEvent) => {
    return (event.regUsers ?? []).reduce((s, v) => s + 1 + (v.guests ?? 0), 0);
};

export const canRegForEvent = (event: ClubEvent, user: User) => {
    if (!event.isRequireReg) return false;
    if (isEventFull(event)) return false;
    return !event.regUsers.some((x) => x.user.email.toLowerCase() === user.email.toLowerCase());
};

export const isEventFull = (event: ClubEvent) => {
    if (!event.maxRegCount) return false;
    return event.maxRegCount < getTotalRegUserCount(event);
};

export const canEventRegMultiWeeks = (event: ClubEvent) => {
    return (event.isFree ?? true) && event.isRequireReg && event.canRegMultiWeeks;
};

export const canEventAddGuest = (event: ClubEvent) => {
    if (!event.isRequireReg) return false;
    if (event.regRestrictType === CLUBEVENT_REG_RESTRICT_TYPE.ONLY_CIRCLE_MEMBERS) return false;
    return store
        .getState()
        .club.memberTypes.filter((x) => x.isAllowClubEvent)
        .every((x) => event.invitedMemberTypes?.includes(x._id));
};

export const getEventMaxRegWeeks = (event: ClubEvent) => {
    if (!event.isRequireReg || !event.canRegMultiWeeks) return 0;
    return event.maxRegMultiWeeks ? Math.min(event.maxRegMultiWeeks || 2, event.repeatedWeeks ?? 1) : 2;
};

export const isPublicEventOfMclClub = (event: ClubEvent) => {
    const congaClub = store.getState().club.clubs.find((x) => x.type === CLUB_TYPE.VIRTUAL);
    return congaClub?._id !== event.club?._id;
};

export const isSponsor = (event: ClubEvent, user: User | string) => {
    if (!event.sponsor) return false;
    const userId = typeof user === 'string' ? user : user._id;
    const sponsorId = typeof event.sponsor === 'string' ? event.sponsor : event.sponsor._id;
    return userId === sponsorId;
};

export const isOnlyCircleEvent = (event: ClubEvent) => {
    return event.regRestrictType === CLUBEVENT_REG_RESTRICT_TYPE.ONLY_CIRCLE_MEMBERS;
};

export const isOnlyGuestEvent = (event: ClubEvent) => {
    return event.regRestrictType === CLUBEVENT_REG_RESTRICT_TYPE.ONLY_SUBCLUB_MEMBERS;
};

export const isMemberOfCircle = (circles: Circle[] | string[]) => {
    const myCircles = store.getState().club.myCircles;
    if (circles.length === 0) return false;
    return circles.some((x) => myCircles.some((v) => v._id === (typeof x === 'string' ? x : x._id)));
};
