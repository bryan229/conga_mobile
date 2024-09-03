import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import apiUrl from './apiUrl';
import { VERSION_NUMBER } from '@shared/constants';
import store from '@store';
import { isJsonString } from '@utils';
import { AuthApi } from '@services/api';
import { loginSuccess } from '@store/actions';

declare module 'axios' {
    export interface AxiosRequestConfig {
        _retry?: boolean;
    }
}

axios.interceptors.request.use<AxiosRequestConfig>((config: AxiosRequestConfig) => {
    const token = store.getState().auth.token || '';
    return {
        ...config,
        baseURL: apiUrl.BASE_URL,
        timeout: 30000,
        headers: {
            authorization: `Bearer ${token}`,
            versionNumber: VERSION_NUMBER,
        },
    } as AxiosRequestConfig;
});

axios.interceptors.response.use<AxiosResponse>(
    (response: AxiosResponse) => {
        if (response?.data?.code && response?.data?.code !== 200) {
            return Promise.reject({
                response: {
                    status: response?.data?.code,
                    data: {
                        message: response?.data?.message || '',
                    },
                },
            });
        }

        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config;
        if (!error.response)
            return Promise.reject({
                response: {
                    status: 408,
                    data: {
                        message: 'Request Timeout',
                    },
                },
            });
        else if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            if (originalRequest.data && typeof originalRequest.data === 'string' && isJsonString(originalRequest.data))
                originalRequest.data = JSON.parse(originalRequest.data);
            const refreshToken = store.getState().auth.refreshToken;
            if (!refreshToken) return Promise.reject(error);
            const { token } = await AuthApi.refreshAccessToken({ refreshToken });
            store.dispatch(loginSuccess({ ...store.getState().auth, token, refreshToken }));
            axios.defaults.headers.common.token = token || '';
            return axios(originalRequest);
        }
        return Promise.reject(error);
    }
);

export default axios;
