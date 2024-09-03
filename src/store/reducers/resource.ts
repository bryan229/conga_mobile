import { FILTER_DATE_REANGES } from '@shared/constants';
import { ResourceAction, ResourceActionType } from '@store/types/resource';
import { ResourceState } from '@store/types/resource';

const initialState: ResourceState = {
    query: {
        dateRange: FILTER_DATE_REANGES.THIRTY_DAYS,
        aroundMe: true,
        address: false,
        radius: 30,
    },
};

const reducer = (state = initialState, action: ResourceAction) => {
    switch (action.type) {
        case ResourceActionType.PUT_RESOURCE_QUERY:
            return {
                ...state,
                query: action.payload ?? {
                    dateRange: FILTER_DATE_REANGES.THIRTY_DAYS,
                    aroundMe: true,
                    radius: 30,
                },
            };
        case ResourceActionType.UPDATE_RESOURCE_QUERY:
            return {
                ...state,
                query: { ...state.query, ...action.payload },
            };
        default:
            return state;
    }
};

export default reducer;
