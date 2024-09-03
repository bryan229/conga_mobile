import { ClubEventQuery, CongaClubEventQuery } from '@services/types';
import { ClubEventActionType } from '@store/types/clubevent';

export const putClubEventQuery = (query?: ClubEventQuery) => ({
    type: ClubEventActionType.PUT_CLUBEVENT_QUERY,
    payload: query,
});

export const updateClubEventQuery = (value: { [key: string]: any }) => ({
    type: ClubEventActionType.UPDATE_CLUBEVENT_QUERY,
    payload: value,
});

export const putCongaClubEventQuery = (query?: CongaClubEventQuery) => ({
    type: ClubEventActionType.PUT_CONGA_CLUBEVENT_QUERY,
    payload: query,
});

export const updateCongaClubEventQuery = (value: { [key: string]: any }) => ({
    type: ClubEventActionType.UPDATE_CONGA_CLUBEVENT_QUERY,
    payload: value,
});
