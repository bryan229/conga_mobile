import * as React from 'react';
import { createNavigationContainerRef, StackActions } from '@react-navigation/native';
import { RouteName, StackParamList } from '@navigation/types';

interface RefObject<T> {
    current: T | null;
}

export const isReadyRef: RefObject<boolean> = React.createRef<boolean>();
export const navigationRef = createNavigationContainerRef<any>();

export const getCurrentRouteName = () => {
    return navigationRef.current?.getCurrentRoute()?.name;
};

export const navigate = (routeName: RouteName, params?: StackParamList) => {
    if (isReadyRef.current && navigationRef && navigationRef.current) {
        // Perform navigation if the app has mounted
        navigationRef?.current?.navigate(routeName as any, params);
    }
};

export const push = (routeName: RouteName, params?: StackParamList) => {
    if (isReadyRef.current && navigationRef && navigationRef.current) {
        // Perform navigation if the app has mounted
        navigationRef.current.dispatch(StackActions.push(routeName, params));
    }
};

export const goBack = () => {
    if (isReadyRef.current && navigationRef && navigationRef.current) {
        // Perform navigation if the app has mounted
        navigationRef.current.goBack();
    }
};

export const pop = (...args: any) => {
    if (isReadyRef.current && navigationRef && navigationRef.current) {
        // Perform navigation if the app has mounted
        navigationRef.current?.dispatch(StackActions.pop(...args));
    }
};

export const popToTop = () => {
    if (isReadyRef.current && navigationRef && navigationRef.current) {
        // Perform navigation if the app has mounted
        navigationRef.current?.dispatch(StackActions.popToTop());
    }
};

export const reset = (params: any) => {
    if (isReadyRef.current && navigationRef && navigationRef.current) {
        // Perform navigation if the app has mounted
        navigationRef.current?.reset(params);
    }
};
