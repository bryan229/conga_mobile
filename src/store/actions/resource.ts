import { ResourceQuery } from '@services/types';
import { ResourceActionType } from '@store/types/resource';

export const putResourceQuery = (query?: ResourceQuery) => ({
    type: ResourceActionType.PUT_RESOURCE_QUERY,
    payload: query,
});

export const updateResourceQuery = (value: { [key: string]: any }) => ({
    type: ResourceActionType.UPDATE_RESOURCE_QUERY,
    payload: value,
});
