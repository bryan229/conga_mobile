import { User } from '@services/models';

export enum AuthActionType {
    AUTH_LOGIN = 'AUTH_LOGIN',
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    PUT_USER_CREDENTIAL = 'PUT_USER_CREDENTIAL',
    PUT_USER_LOCATION = 'PUT_USER_LOCATION',
    PUT_USER = 'PUT_USER',
    PUT_DEVICE_TOKEN = 'PUT_DEVICE_TOKEN',
}

export interface AuthState {
    user: User | null;
    credential: string | null;
    token: string | null;
    refreshToken: string | null;
    deviceToken: string | null;
    location: number[] | null;
}
export interface AuthLoginPayload {
    user: User | null | undefined;
    token: string | null | undefined;
}

export type AuthLogin = {
    type: typeof AuthActionType.AUTH_LOGIN;
    payload: AuthLoginPayload;
};
export interface LoginSuccessPayload {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
}

export type LoginSuccess = {
    type: typeof AuthActionType.LOGIN_SUCCESS;
    payload: LoginSuccessPayload;
};

export type PutUser = {
    type: typeof AuthActionType.PUT_USER;
    payload: User;
};

export type PutDeviceToken = {
    type: typeof AuthActionType.PUT_DEVICE_TOKEN;
    payload: string;
};

export type PutUserCredential = {
    type: typeof AuthActionType.PUT_USER_CREDENTIAL;
    payload: string;
};

export type PutUserLocation = {
    type: typeof AuthActionType.PUT_USER_LOCATION;
    payload: number[];
};

export type AuthAction = AuthLogin | LoginSuccess | PutUser | PutDeviceToken | PutUserCredential | PutUserLocation;
