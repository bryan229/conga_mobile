import { ResourceQuery } from '@services/types';

export enum ResourceActionType {
    PUT_RESOURCE_QUERY = 'PUT_RESOURCE_QUERY',
    UPDATE_RESOURCE_QUERY = 'UPDATE_RESOURCE_QUERY',
}

export interface ResourceState {
    query: ResourceQuery;
}

export type PutResourceQuery = {
    type: typeof ResourceActionType.PUT_RESOURCE_QUERY;
    payload: ResourceQuery;
};

export type UpdateResourceQuery = {
    type: typeof ResourceActionType.UPDATE_RESOURCE_QUERY;
    payload: ResourceQuery;
};

export type ResourceAction = PutResourceQuery | UpdateResourceQuery;
