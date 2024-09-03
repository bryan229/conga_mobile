import { FILTER_DATE_REANGES } from '@shared/constants';
import moment from 'moment-timezone';
import addressJson from './address.json';

type ErrorParseReturnType = {
    type: 'error' | 'warning' | 'auth' | 'repair' | 'close';
    title: string;
    message: string;
};

export const validateEmail = (value: string): boolean => {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
};

export const getTimeZoneMoment = (timezone: string): moment.Moment => {
    if (timezone) return moment(moment().tz(timezone).format('YYYY-MM-DD HH:mm'));
    return moment();
};

export const convertTimeString = (timeString: string, outFormat: string): string => {
    return moment(`${moment().format('YYYY-MM-DD')} ${timeString}`).format(outFormat);
};

export const capitalizeString = (value: string): string => {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export const htmlToString = (htmlString: string): string => {
    if (!htmlString) return '';
    return htmlString
        ?.replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .trim();
};

export const isJsonString = (str: string) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

export const hasValue = (value: any) => {
    return value !== undefined && value !== null;
};

export const errorParse = (error: any): ErrorParseReturnType => {
    if (error.response?.status === 401) {
        return { type: 'auth', title: '', message: '' };
    } else if (error.response?.status === 403 && !error.response.data?.message) {
        return { type: 'auth', title: '', message: '' };
    } else if (error.response?.status === 410) {
        return {
            type: 'error',
            title: 'Update App',
            message: 'Please update your mobile app at either the Apple Store or Google Play to get current version.',
        };
    } else if (error.response?.status === 350) {
        return { type: 'close', title: '', message: '' };
    }
    const message = error.response?.data ? error.response?.data?.message || 'Unknow Error' : String(error);
    const type = error.response?.status < 400 ? 'warning' : 'error';
    const title = type === 'warning' ? 'Warning' : error.response?.data ? 'API Error' : 'Error';
    return { type, title, message };
};

export const getChatTopic = (userId1: string, userId2: string) => {
    if (userId1 > userId2) return `${userId1}:${userId2}`;
    return `${userId2}:${userId1}`;
};

export const filterDateRangeToValues = (dateRange: FILTER_DATE_REANGES) => {
    if (dateRange === FILTER_DATE_REANGES.TODAY)
        return {
            from: moment().startOf('day').format('YYYY-MM-DD HH:mm'),
            to: moment().endOf('day').format('YYYY-MM-DD HH:mm'),
        };
    if (dateRange === FILTER_DATE_REANGES.ONE_WEEK)
        return {
            from: moment().startOf('day').format('YYYY-MM-DD HH:mm'),
            to: moment().add(1, 'weeks').endOf('day').format('YYYY-MM-DD HH:mm'),
        };
    if (dateRange === FILTER_DATE_REANGES.TWO_WEEKS)
        return {
            from: moment().startOf('day').format('YYYY-MM-DD HH:mm'),
            to: moment().add(2, 'weeks').endOf('day').format('YYYY-MM-DD HH:mm'),
        };
    if (dateRange === FILTER_DATE_REANGES.THIRTY_DAYS)
        return {
            from: moment().startOf('day').format('YYYY-MM-DD HH:mm'),
            to: moment().add(30, 'days').endOf('day').format('YYYY-MM-DD HH:mm'),
        };
    if (dateRange === FILTER_DATE_REANGES.NINETY_DAYS)
        return {
            from: moment().startOf('day').format('YYYY-MM-DD HH:mm'),
            to: moment().add(90, 'days').endOf('day').format('YYYY-MM-DD HH:mm'),
        };
    return {
        from: moment().startOf('day').format('YYYY-MM-DD HH:mm'),
        to: moment().add(1, 'months').endOf('day').format('YYYY-MM-DD HH:mm'),
    };
};

export const getFilterDateRangeLabel = (dateRange: FILTER_DATE_REANGES) => {
    if (dateRange === FILTER_DATE_REANGES.TODAY) return 'Today';
    if (dateRange === FILTER_DATE_REANGES.ONE_WEEK) return 'Next week';
    if (dateRange === FILTER_DATE_REANGES.TWO_WEEKS) return 'Next 2 weeks';
    if (dateRange === FILTER_DATE_REANGES.THIRTY_DAYS) return 'Next 30 days';
    if (dateRange === FILTER_DATE_REANGES.NINETY_DAYS) return 'Next 90 days';
    return 'In a Month';
};

export const mileToKm = (mile: number) => {
    return mile * 1.60934;
};

export const kmToMile = (km: number) => {
    return km / 1.60934;
};

export const getStates = () => {
    return Array.from(new Set(addressJson.map((x) => x.state))).sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));
};

export const getCounties = (state: string) => {
    return Array.from(new Set(addressJson.filter((x) => x.state === state).map((x) => x.county))).sort((a, b) =>
        a > b ? 1 : a < b ? -1 : 0
    );
};

export const getCities = (state: string, county?: string) => {
    if (county)
        return Array.from(
            new Set(addressJson.filter((x) => x.state === state && x.county === county).map((x) => x.city))
        ).sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));
    else
        return Array.from(new Set(addressJson.filter((x) => x.state === state).map((x) => x.city))).sort((a, b) =>
            a > b ? 1 : a < b ? -1 : 0
        );
};
