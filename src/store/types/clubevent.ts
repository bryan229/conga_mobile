import { ClubEventQuery, CongaClubEventQuery } from '@services/types';

export enum ClubEventActionType {
    PUT_CLUBEVENT_QUERY = 'PUT_CLUBEVENT_QUERY',
    UPDATE_CLUBEVENT_QUERY = 'UPDATE_CLUBEVENT_QUERY',
    PUT_CONGA_CLUBEVENT_QUERY = 'PUT_CONGA_CLUBEVENT_QUERY',
    UPDATE_CONGA_CLUBEVENT_QUERY = 'UPDATE_CONGA_CLUBEVENT_QUERY',
}

export interface ClubEventState {
    query: ClubEventQuery;
    congaClubEventQuery: CongaClubEventQuery;
}

export type PutClubEventQuery = {
    type: typeof ClubEventActionType.PUT_CLUBEVENT_QUERY;
    payload: ClubEventQuery;
};

export type UpdateClubEventQuery = {
    type: typeof ClubEventActionType.UPDATE_CLUBEVENT_QUERY;
    payload: { [key: string]: any };
};

export type PutCongaClubEventQuery = {
    type: typeof ClubEventActionType.PUT_CONGA_CLUBEVENT_QUERY;
    payload: CongaClubEventQuery;
};

export type UpdateCongaClubEventQuery = {
    type: typeof ClubEventActionType.UPDATE_CONGA_CLUBEVENT_QUERY;
    payload: { [key: string]: any };
};

export type ClubEventAction =
    | PutClubEventQuery
    | UpdateClubEventQuery
    | PutCongaClubEventQuery
    | UpdateCongaClubEventQuery;
