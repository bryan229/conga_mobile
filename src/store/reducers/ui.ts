import { UiAction, UiActionType, UiState } from '@store/types';

const initialState: UiState = {
    alert: undefined,
    loading: false,
    isOpenDropUpPicker: false,
    dropUpPicker: undefined,
    isNewNoti: false,
    isShowTooltip: true,
    isOpenAlertModal: false,
    alertModalData: undefined,
};

const reducer = (state = initialState, action: UiAction) => {
    switch (action.type) {
        case UiActionType.SET_LOADING:
            return {
                ...state,
                loading: action.payload,
            };
        case UiActionType.SHOW_ALERT:
            return {
                ...state,
                alert: action.payload,
            };
        case UiActionType.SHOW_ALERT_MODAL:
            return {
                ...state,
                isOpenAlertModal: true,
                alertModalData: action.payload,
            };
        case UiActionType.CLOSE_ALERT_MODAL:
            return {
                ...state,
                isOpenAlertModal: false,
            };
        case UiActionType.SHOW_DROPUP_PICKER:
            return {
                ...state,
                isOpenDropUpPicker: true,
                dropUpPicker: action.payload,
            };
        case UiActionType.SHOW_TOOLTIP:
            return {
                ...state,
                isShowTooltip: action.payload,
            };
        case UiActionType.CLOSE_DROPUP_PICKER:
            return {
                ...state,
                isOpenDropUpPicker: false,
            };
        case UiActionType.SET_NOTI_BADGE:
            return {
                ...state,
                isNewNoti: action.payload,
            };
        default:
            return state;
    }
};

export default reducer;
