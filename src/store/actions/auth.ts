import { AuthApi } from '@services/api';
import { User } from '@services/models';
import { AppThunkAction } from '@store';
import { AuthActionType, LoginSuccessPayload } from '@store/types';
import { setLoading, handleError, showAlert } from './ui';
import { putMyCircles, putMyGuestAccounts } from './club';

export const fetchMe =
    (payload: any): AppThunkAction<void> =>
    async (dispatch) => {
        try {
            const { data, myCircles, myGuestAccounts } = await AuthApi.me(payload);
            dispatch(putUser(data));
            dispatch(putMyCircles(myCircles));
            dispatch(putMyGuestAccounts(myGuestAccounts));
        } catch (error) {
            dispatch(handleError(error));
            Promise.reject(error);
        }
    };

export const updateUser =
    (payload: any): AppThunkAction<void> =>
    async (dispatch) => {
        try {
            dispatch(setLoading(true));
            const { data } = await AuthApi.update(payload);
            dispatch(putUser(data));
            dispatch(setLoading(false));
            dispatch(showAlert({ type: 'success', title: 'Success', message: 'Profile has been saved.' }));
        } catch (error) {
            dispatch(handleError(error));
            dispatch(setLoading(false));
            Promise.reject(error);
        }
    };

export const putUser = (payload: User) => ({
    type: AuthActionType.PUT_USER,
    payload,
});

export const loginSuccess = (payload: LoginSuccessPayload) => ({
    type: AuthActionType.LOGIN_SUCCESS,
    payload,
});

export const putUserCredential = (payload: string) => ({
    type: AuthActionType.PUT_USER_CREDENTIAL,
    payload,
});

export const logout = () => ({
    type: AuthActionType.LOGIN_SUCCESS,
    payload: { user: null, token: null, refreshToken: null, memberType: null },
});

export const putDeviceToken = (payload: string) => ({
    type: AuthActionType.PUT_DEVICE_TOKEN,
    payload,
});

export const putUserLocation = (payload: number[]) => ({
    type: AuthActionType.PUT_USER_LOCATION,
    payload,
});
