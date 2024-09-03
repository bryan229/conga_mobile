import { FILTER_DATE_REANGES } from '@shared/constants';
import { StyleProp, ViewStyle } from 'react-native';

export type AlertType = {
    id?: number;
    message: string;
    title: string;
    type: 'success' | 'error' | 'warning' | 'info';
};

export type AlertModalButtonType = 'ok' | 'cancel' | 'normal';
export type AlertModalButton = {
    label: string;
    value: string;
    type: AlertModalButtonType;
};

export type AlertModalState = {
    type?: 'success' | 'error' | 'warning' | 'info' | 'question';
    title?: string;
    message: string | JSX.Element;
    buttons?: AlertModalButton[];
    data?: any;
    handler?: (value: string, data?: any) => void;
};

export type CPStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

export type PickerOption = {
    value: string;
    label: string;
};

export type Notification = {
    id: string;
    clubId: string;
    title: string;
    message: string;
    type: 'CLUB_MSG' | 'NOTIFICATION';
    data: any;
    date: string;
};

export type NotificationEventType =
    | 'OPEN_APP_NOTIFICATION'
    | 'ON_NOTIFICATION'
    | 'INIT_NOTIFICATION'
    | 'BACKGROUND_NOTIFICATION';

export type ClubEventQuery = {
    from: string;
    to: string;
    venue?: string;
    court?: number;
    location?: string;
    eventType?: string;
    sponsor?: string;
    invitedMemberTypes?: string;
};

export type OpenScheduleQuery = {
    venue: string;
    date?: string;
    time?: string;
};

export type ResourceQuery = {
    dateRange: FILTER_DATE_REANGES;
    aroundMe: boolean;
    address: boolean;
    organization?: string;
    state?: string;
    county?: string;
    city?: string;
    radius: number;
};

export type CongaClubEventQuery = {
    dateRange: FILTER_DATE_REANGES;
    aroundMe: boolean;
    address: boolean;
    onlyMyCicle?: boolean;
    eventType?: string;
    organization?: string;
    state?: string;
    county?: string;
    city?: string;
    radius: number;
};

export type CircleQuery = {
    state?: string;
    county?: string;
    city?: string;
    subClub?: string;
};

export type OrganizationQuery = {
    aroundMe: boolean;
    address: boolean;
    state?: string;
    county?: string;
    city?: string;
    radius: number;
};

export type Partial<T> = {
    [P in keyof T]?: T[P];
};

export type PermissionCheckResult = {
    valid: boolean;
    message?: string;
    primaryButtonLabel?: string;
    secondaryButtonLabel?: string;
    reason?: string;
};
