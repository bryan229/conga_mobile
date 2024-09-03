import { ClubActionType } from '@store/types';
import { Circle, Club, Guest, MemberType, SubClub, User } from '@services/models';

export const putMyClubs = (clubs: Club[]) => ({
    type: ClubActionType.PUT_MY_CLUBS,
    payload: clubs,
});

export const putMyCircles = (circles: Circle[]) => ({
    type: ClubActionType.PUT_MY_CIRCLES,
    payload: circles,
});

export const putMyGuestAccounts = (guests: Guest[]) => ({
    type: ClubActionType.PUT_MY_GUEST_ACCOUNTS,
    payload: guests,
});

export const putClubs = (clubs: Club[]) => ({
    type: ClubActionType.PUT_CLUBS,
    payload: clubs,
});

export const putSubClubs = (subClubs: SubClub[]) => ({
    type: ClubActionType.PUT_SUB_CLUBS,
    payload: subClubs,
});

export const putClub = (club: Club | null) => ({
    type: ClubActionType.PUT_CLUB,
    payload: club,
});

export const putMemberTypes = (memberTypes: MemberType[]) => ({
    type: ClubActionType.PUT_MEMBER_TYPES,
    payload: memberTypes,
});

export const putSponsors = (sponsors: User[]) => ({
    type: ClubActionType.PUT_SPONSORS,
    payload: sponsors,
});
