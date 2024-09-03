import { AlertModalState, AlertType } from '@services/types';
import { CPBottomSheetPickerProps } from '@shared/components/bottom-sheet-picker';

export enum UiActionType {
    SHOW_ALERT = 'SHOW_ALERT',
    SHOW_ALERT_MODAL = 'SHOW_ALERT_MODAL',
    CLOSE_ALERT_MODAL = 'CLOSE_ALERT_MODAL',
    SET_LOADING = 'SET_LOADING',
    SHOW_DROPUP_PICKER = 'SHOW_DROPUP_PICKER',
    CLOSE_DROPUP_PICKER = 'CLOSE_DROPUP_PICKER',
    SET_NOTI_BADGE = 'SET_NOTI_BADGE',
    SHOW_TOOLTIP = 'SHOW_TOOLTIP',
}

export interface UiState {
    alert?: AlertType;
    loading: boolean;
    isOpenDropUpPicker: boolean;
    dropUpPicker?: CPBottomSheetPickerProps;
    isNewNoti: boolean;
    isShowTooltip: boolean;
    isOpenAlertModal: boolean;
    alertModalData?: AlertModalState;
}

export type SetLoading = {
    type: typeof UiActionType.SET_LOADING;
    payload: boolean;
};

export type ShowAlert = {
    type: typeof UiActionType.SHOW_ALERT;
    payload: AlertType;
};

export type showAlertModal = {
    type: typeof UiActionType.SHOW_ALERT_MODAL;
    payload: AlertModalState;
};

export type closeAlertModal = {
    type: typeof UiActionType.CLOSE_ALERT_MODAL;
};

export type showBottomSheetPicker = {
    type: typeof UiActionType.SHOW_DROPUP_PICKER;
    payload: CPBottomSheetPickerProps;
};

export type showTooltip = {
    type: typeof UiActionType.SHOW_TOOLTIP;
    payload: boolean;
};

export type closeBottomSheetPicker = {
    type: typeof UiActionType.CLOSE_DROPUP_PICKER;
};

export type SetNotiBadge = {
    type: typeof UiActionType.SET_NOTI_BADGE;
    payload: boolean;
};

export type UiAction =
    | SetLoading
    | ShowAlert
    | showBottomSheetPicker
    | closeBottomSheetPicker
    | SetNotiBadge
    | showTooltip
    | showAlertModal
    | closeAlertModal;
