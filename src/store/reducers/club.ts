import { ClubAction, ClubActionType, ClubState } from '@store/types';

const initialState: ClubState = {
    club: null,
    subClubs: [],
    circle: null,
    myClubs: [],
    myCircles: [],
    myGuestAccounts: [],
    clubs: [],
    memberTypes: [],
    sponsors: [],
};

const reducer = (state = initialState, action: ClubAction) => {
    switch (action.type) {
        case ClubActionType.PUT_MY_CLUBS:
            return {
                ...state,
                myClubs: action.payload,
            };
        case ClubActionType.PUT_CLUBS:
            return {
                ...state,
                clubs: action.payload,
            };
        case ClubActionType.PUT_SUB_CLUBS:
            return {
                ...state,
                subClubs: action.payload,
            };
        case ClubActionType.PUT_MY_CIRCLES:
            return {
                ...state,
                myCircles: action.payload,
            };
        case ClubActionType.PUT_MY_GUEST_ACCOUNTS:
            return {
                ...state,
                myGuestAccounts: action.payload,
            };
        case ClubActionType.PUT_CLUB:
            return {
                ...state,
                club: action.payload,
            };
        case ClubActionType.PUT_MEMBER_TYPES:
            return {
                ...state,
                memberTypes: action.payload,
            };
        case ClubActionType.PUT_SPONSORS:
            return {
                ...state,
                sponsors: action.payload,
            };
        default:
            return state;
    }
};

export default reducer;
