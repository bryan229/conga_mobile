import { AuthAction, AuthActionType, AuthState } from '@store/types';

const initialState: AuthState = {
    user: null,
    credential: null, // email or phone number
    token: null,
    refreshToken: null,
    deviceToken: null,
    location: null,
};

const reducer = (state = initialState, action: AuthAction) => {
    switch (action.type) {
        case AuthActionType.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                refreshToken: action.payload.refreshToken,
            };
        case AuthActionType.PUT_USER_CREDENTIAL:
            return {
                ...state,
                credential: action.payload,
            };
        case AuthActionType.PUT_USER:
            return {
                ...state,
                user: action.payload,
            };
        case AuthActionType.PUT_DEVICE_TOKEN:
            return {
                ...state,
                deviceToken: action.payload,
            };
        case AuthActionType.PUT_USER_LOCATION:
            return {
                ...state,
                location: action.payload,
            };
        default:
            return state;
    }
};

export default reducer;
