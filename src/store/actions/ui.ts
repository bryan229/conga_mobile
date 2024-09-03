import { AlertModalState, AlertType } from '@services/types';
import { CPBottomSheetPickerProps } from '@shared/components/bottom-sheet-picker';
import { UiActionType } from '@store/types';
import { errorParse } from '@utils';
import { logout } from './auth';

export const handleError = (payload: any) => async (dispatch: Function) => {
    const { type, title, message } = errorParse(payload);
    if (type === 'auth') {
        dispatch(logout());
    } else if (type === 'repair') {
    } else if (type === 'close') {
    } else {
        dispatch(showAlert({ type, title, message }));
    }
};

export const setLoading = (payload: boolean) => {
    return {
        type: UiActionType.SET_LOADING,
        payload,
    };
};

export const showAlert = (payload: AlertType) => {
    payload.id = new Date().getTime();
    return {
        type: UiActionType.SHOW_ALERT,
        payload,
    };
};

export const showAlertModal = (payload: AlertModalState) => {
    return {
        type: UiActionType.SHOW_ALERT_MODAL,
        payload,
    };
};

export const closeAlertModal = () => {
    return {
        type: UiActionType.CLOSE_ALERT_MODAL,
    };
};

export const showBottomSheetPicker = (payload: CPBottomSheetPickerProps) => {
    return {
        type: UiActionType.SHOW_DROPUP_PICKER,
        payload,
    };
};

export const closeBottomSheetPicker = () => {
    return {
        type: UiActionType.CLOSE_DROPUP_PICKER,
    };
};

export const setNotiBadge = (payload: boolean) => {
    return {
        type: UiActionType.SET_NOTI_BADGE,
        payload,
    };
};

export const showTooltip = (payload: boolean) => {
    return {
        type: UiActionType.SHOW_TOOLTIP,
        payload,
    };
};
