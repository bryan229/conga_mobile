import { FILTER_DATE_REANGES } from '@shared/constants';
import { ClubEventAction, ClubEventActionType, ClubEventState } from '@store/types/clubevent';
import moment from 'moment';

const initialState: ClubEventState = {
    query: {
        from: moment().startOf('day').format('YYYY-MM-DD HH:mm'),
        to: moment().add(1, 'months').startOf('day').format('YYYY-MM-DD HH:mm'),
    },
    congaClubEventQuery: {
        dateRange: FILTER_DATE_REANGES.THIRTY_DAYS,
        aroundMe: true,
        address: false,
        onlyMyCicle: false,
        radius: 30,
    },
};

const reducer = (state = initialState, action: ClubEventAction) => {
    switch (action.type) {
        case ClubEventActionType.PUT_CLUBEVENT_QUERY:
            return {
                ...state,
                query: action.payload ?? {
                    from: moment().startOf('day').format('YYYY-MM-DD HH:mm'),
                    to: moment().add(1, 'months').startOf('day').format('YYYY-MM-DD HH:mm'),
                },
            };
        case ClubEventActionType.UPDATE_CLUBEVENT_QUERY:
            return {
                ...state,
                query: { ...state.query, ...action.payload },
            };
        case ClubEventActionType.PUT_CONGA_CLUBEVENT_QUERY:
            return {
                ...state,
                congaClubEventQuery: action.payload ?? {
                    dateRange: FILTER_DATE_REANGES.THIRTY_DAYS,
                    aroundMe: true,
                    radius: 30,
                },
            };
        case ClubEventActionType.UPDATE_CONGA_CLUBEVENT_QUERY:
            return {
                ...state,
                congaClubEventQuery: { ...state.congaClubEventQuery, ...action.payload },
            };
        default:
            return state;
    }
};

export default reducer;
