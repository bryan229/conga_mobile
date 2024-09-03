import { Club, Venue } from '@services/models';
import { VENUE_STATUS, VENUE_TYPE } from '@shared/constants';
import store from '@store';

export const getActiveVenues = (club: Club): Venue[] => {
    if (club.venues.length === 0) return [];
    if (typeof club.venues[0] === 'string') return [];
    return club.venues.filter((x) => x.status === VENUE_STATUS.ACTIVATED);
};

export const getActiveRealVenues = (club: Club): Venue[] => {
    if (club.venues.length === 0) return [];
    if (typeof club.venues[0] === 'string') return [];
    let realVenues = club.venues.filter((x) => x.status === VENUE_STATUS.ACTIVATED && x.type === VENUE_TYPE.REAL);
    const user = store.getState()?.auth?.user;
    if (!user || (user.preferredVenue || []).length === 0) return realVenues;
    return realVenues.sort((a, b) => {
        if (user.preferredVenue === a._id && user?.preferredVenue !== b._id) return -1;
        else if (user.preferredVenue !== a._id && user?.preferredVenue === b._id) return 1;
        if (a._id < b._id) return -1;
        else if (a._id > b._id) return 1;
        return 0;
    });
};

export const getActiveVirtualVenues = (club: Club): Venue[] => {
    if (club.venues.length === 0) return [];
    if (typeof club.venues[0] === 'string') return [];
    return club.venues.filter((x) => x.status === VENUE_STATUS.ACTIVATED && x.type === VENUE_TYPE.VIRTUAL);
};

export const getVenue = (club: Club, venueId?: string): Venue | null => {
    if (club.venues.length === 0) return null;
    if (typeof club.venues[0] === 'string') return null;
    return club.venues.find((x) => x._id === venueId) ?? null;
};

export const isReqSubscription = (club: Club): boolean => {
    return !!club.setting?.isReqSubscription && !!club.setting?.subscription?.price;
};
