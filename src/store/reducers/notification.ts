import { NotificationAction, NotificationActionType, NotificationState } from '@store/types/notification';

const initialState: NotificationState = {
    notifications: [],
};

const reducer = (state = initialState, action: NotificationAction) => {
    switch (action.type) {
        case NotificationActionType.PUT_NOTIFICATIONS:
            return {
                ...state,
                notifications: action.payload,
            };
        default:
            return state;
    }
};

export default reducer;
