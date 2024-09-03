import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import * as Progress from 'react-native-progress';
import createStyles from './style';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { Club, Request, RequestTemplate, Venue } from '@services/models';
import { ClubApi, RequestApi } from '@services/api';
import { handleError, putClub } from '@store/actions';
import { getActiveRealVenues } from '@services/helpers/club';
import { getTimeZoneMoment } from '@utils';
import { useAppNavigation } from '@services/hooks/useNavigation';
import moment from 'moment';
import { canMakeRequest, getRequestTemplateDates, isAvailableRequest } from '@services/helpers/request';
import CTSelect from '@shared/components/controls/ct-select';
import { getStyle } from '@shared/theme/themes';
import CTButton from '@shared/components/controls/ct-button';
import { RouteProp, useIsFocused, useRoute } from '@react-navigation/native';
import { RequestTabStackParamList } from '@navigation/types';

const SubmitRequest = () => {
    let appClub = useAppSelector((state) => state.club.club);
    const user = useAppSelector((state) => state.auth.user)!;
    const route = useRoute<RouteProp<RequestTabStackParamList, 'SubmitRequest'>>();
    const [request, setRequest] = useState<Request>();
    const isFocused = useIsFocused();
    const navigate = useAppNavigation();
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [club, setClub] = useState<Club>(appClub!);
    const [venue, setVenue] = useState<Venue>();
    const [template, setTemplate] = useState<RequestTemplate>();
    const [date, setDate] = useState<string | undefined>('');
    const [time, setTime] = useState<string | undefined>('');
    const [timeRange, setTimeRange] = useState<string | undefined>('');
    const [isAnyTime, setIsAnyTime] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchClubForUpdate = async () => {
        try {
            setLoading(true);
            const { data: _club } = await ClubApi.read({ _id: appClub?._id! });
            dispatch(putClub(_club));
            setClub(_club);
            const _request = route?.params?.request;
            setRequest(_request);
            if (_request) {
                if (getVenues().length === 0) return;
                const _venue = getVenues().find((x) => x._id === _request.venue);
                setVenue(_venue);
                setTemplate(_request.template);
                setDate(_request.date);
                setTime(_request.time || '');
                setTimeRange(_request.timeRange || '');
                setIsAnyTime(_request.isAnyTime ?? false);
            } else {
                if (getVenues().length === 0) return;
                const _venue = getVenues()[0];
                setVenue(_venue);
                if (_venue && _venue.releasedTemplates.length) {
                    const _template = _venue.releasedTemplates[0];
                    setTemplate(_venue.releasedTemplates[0]);
                    const dates = getRequestTemplateDates(_template);
                    if (dates.length === 0) return;
                    const _date = dates[0];
                    setDate(_date);
                    const times = getTimes({ v: _venue, t: _template, d: _date });
                    const _time = times[0];
                    setTime(_time);
                    setTimeRange('');
                }
            }
            setLoading(false);
        } catch (error) {
            dispatch(handleError(error));
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) fetchClubForUpdate();
    }, [isFocused]);

    const getVenues = (): Venue[] => {
        return getActiveRealVenues(club!).filter((x) =>
            (x.releasedTemplates || []).some((v) => v.stDate > getTimeZoneMoment(club?.timezone!).format('YYYY-MM-DD'))
        );
    };

    const getTimes = ({ v, t, d }: { v?: Venue; t?: RequestTemplate; d?: string }) => {
        const _venue = v || venue;
        const _template = t || template;
        const _date = d || date;
        if (!_venue || !_template || !_date) return [];
        return (venue?.setting.timeSlots || []).filter(
            (x) =>
                isAvailableRequest(_template, _date, x) && canMakeRequest({ user, venue: _venue, date: _date, time: x })
        );
    };

    const getTimeRanges = () => {
        if (!template || !date || !venue) return [];
        return (club?.setting?.avtTimeSlots || []).filter((x) => canMakeRequest({ user, venue, date, timeRange: x }));
    };

    const getVenueOptions = () => {
        return getVenues().map((x) => {
            return { value: x._id, label: x.displayName };
        });
    };

    const getTemplateOptions = () => {
        if (!venue) return [];
        return venue.releasedTemplates.map((x) => {
            return { value: x._id, label: `${x.stDate} ~ ${x.etDate}` };
        });
    };

    const getDateOptions = () => {
        if (!venue || !template) return [];
        return getRequestTemplateDates(template).map((x) => {
            return { value: x, label: moment(x).format('dddd, MMM DD, YYYY') };
        });
    };

    const getTimeOptions = () => {
        if (!venue || !template || !date) return [];
        return getTimes({ v: venue, t: template, d: date }).map((x) => {
            return { value: x, label: x };
        });
    };

    const getTimeRangeOptions = () => {
        if (!venue || !template || !date) return [];
        return getTimeRanges().map((x) => {
            return { value: x.name, label: `${x.name} (${x.stTime} ~ ${x.etTime})` };
        });
    };

    const submit = async () => {
        if (!venue || !template || !date || (!time && !timeRange)) return;
        setSubmitLoading(true);
        try {
            if (request) {
                let params: any = {
                    _id: request?._id,
                    date,
                    isAnyTime,
                };
                if (isAnyTime) params = { ...params, timeRange };
                else params = { ...params, time };
                await RequestApi.update(params);
            } else {
                let params: any = {
                    user: user._id!,
                    venue: venue._id!,
                    template: template._id,
                    date,
                    isAnyTime,
                };
                if (isAnyTime) params = { ...params, timeRange };
                else params = { ...params, time };
                await RequestApi.create(params);
            }
            navigate.navigate('Requests');
        } catch (error) {
            dispatch(handleError(error));
        }
        setSubmitLoading(false);
    };

    const Loading = () => {
        if (!loading) return null;
        return (
            <View style={styles.loadingContainerStyle}>
                <Progress.Circle
                    size={25}
                    indeterminate={loading}
                    color="white"
                    borderWidth={3}
                    borderColor={colors.primary}
                />
            </View>
        );
    };

    return (
        <View style={styles.containerStyle}>
            <Loading />
            <ScrollView style={styles.scrollContainerStyle}>
                <CTSelect
                    style={getStyle('mb-8')}
                    name="venue"
                    label="Select Venue"
                    options={getVenueOptions()}
                    value={venue?._id}
                    disabled={!!request}
                    onChange={(value) => {
                        const _venue = getVenues().find((x) => x._id === value);
                        setVenue(_venue);
                        if (_venue && _venue.releasedTemplates.length) {
                            const _template = _venue.releasedTemplates[0];
                            setTemplate(_venue.releasedTemplates[0]);
                            const dates = getRequestTemplateDates(_template);
                            if (dates.length === 0) return;
                            const _date = dates[0];
                            setDate(_date);
                            const times = getTimes({ v: _venue, t: _template, d: _date });
                            const _time = times[0];
                            setTime(_time);
                            setIsAnyTime(false);
                            setTimeRange('');
                        }
                    }}
                />
                <CTSelect
                    style={getStyle('mb-8')}
                    name="template"
                    label="Select Cycle"
                    options={getTemplateOptions()}
                    disabled={!!request}
                    value={template?._id}
                    onChange={(value) => {
                        const _template = venue?.releasedTemplates.find((x) => x._id === value);
                        setTemplate(_template);
                        const dates = getRequestTemplateDates(_template!);
                        if (dates.length === 0) return;
                        const _date = dates[0];
                        setDate(_date);
                        const times = getTimes({ v: venue, t: _template, d: _date });
                        const _time = times[0];
                        setTime(_time);
                        setIsAnyTime(false);
                        setTimeRange('');
                    }}
                />
                <CTSelect
                    style={getStyle('mb-8')}
                    name="date"
                    label="Select Date"
                    options={getDateOptions()}
                    value={date}
                    onChange={(value) => {
                        setDate(value);
                        const times = getTimes({ v: venue, t: template, d: value });
                        const _time = times[0];
                        setTime(_time);
                        setIsAnyTime(false);
                        setTimeRange('');
                    }}
                />
                <CTSelect
                    style={getStyle('mb-8')}
                    name="time"
                    label="Select Time"
                    placeholder="NONE"
                    options={getTimeOptions()}
                    value={time}
                    onChange={(value) => {
                        setTime(value);
                        setTimeRange('');
                        setIsAnyTime(false);
                    }}
                />
                <CTSelect
                    style={getStyle('mb-32')}
                    name="timeRange"
                    label="Any Time"
                    placeholder="NONE"
                    options={getTimeRangeOptions()}
                    value={timeRange}
                    onChange={(value) => {
                        setTimeRange(value);
                        setTime('');
                        setIsAnyTime(true);
                    }}
                />
                <CTButton loading={submitLoading} title={request ? 'Update' : 'Submit'} onPress={submit} />
            </ScrollView>
        </View>
    );
};

export default SubmitRequest;
