import { Circle, Club, Guest, MemberType, SubClub, User } from '@services/models';

export enum ClubActionType {
    PUT_CLUB = 'PUT_CLUB',
    PUT_CLUBS = 'PUT_CLUBS',
    PUT_SUB_CLUBS = 'PUT_SUB_CLUBS',
    PUT_MY_CLUBS = 'PUT_MY_CLUBS',
    PUT_MY_CIRCLES = 'PUT_MY_CIRCLES',
    PUT_MY_GUEST_ACCOUNTS = 'PUT_MY_GUEST_ACCOUNTS',
    PUT_MEMBER_TYPES = 'PUT_MEMBER_TYPES',
    PUT_SPONSORS = 'PUT_SPONSORS',
}

export interface ClubState {
    club: Club | null;
    subClubs: SubClub[];
    circle: Circle | null;
    myClubs: Club[];
    myCircles: Circle[];
    myGuestAccounts: Guest[];
    clubs: Club[];
    memberTypes: MemberType[];
    sponsors: User[];
}

export type PutClubs = {
    type: typeof ClubActionType.PUT_CLUBS;
    payload: Club[];
};

export type PutSubClubs = {
    type: typeof ClubActionType.PUT_SUB_CLUBS;
    payload: SubClub[];
};

export type PutMyClubs = {
    type: typeof ClubActionType.PUT_MY_CLUBS;
    payload: Club[];
};

export type PutMyCircles = {
    type: typeof ClubActionType.PUT_MY_CIRCLES;
    payload: Circle[];
};

export type PutMyGuestAccounts = {
    type: typeof ClubActionType.PUT_MY_GUEST_ACCOUNTS;
    payload: Guest[];
};

export type PutClub = {
    type: typeof ClubActionType.PUT_CLUB;
    payload: Club;
};

export type PutMemberTypes = {
    type: typeof ClubActionType.PUT_MEMBER_TYPES;
    payload: MemberType[];
};

export type PutSponsors = {
    type: typeof ClubActionType.PUT_SPONSORS;
    payload: User[];
};

export type ClubAction =
    | PutClubs
    | PutSubClubs
    | PutMyClubs
    | PutMyCircles
    | PutMyGuestAccounts
    | PutClub
    | PutMemberTypes
    | PutSponsors;
