import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import { CPStyleProp, OpenScheduleQuery } from '@services/types';
import { useAppDispatch, useAppSelector } from '@store/hook';
import CPHorizontalMenu from '@shared/components/horizontal-menu';
import { showBottomSheetPicker } from '@store/actions/ui';
import createStyles from './style';
import { getActiveRealVenues, getVenue } from '@services/helpers/club';
import moment from 'moment';
import { getCurrentScheduleDates } from '@services/helpers/schedule';
import { convertTimeString, getTimeZoneMoment } from '@utils';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import { getStyle } from '@shared/theme/themes';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';

const mapQueryKeyToMenu: { [key: string]: string } = {
    venue: 'Venue',
    date: 'Date',
    time: 'Time',
};

interface Props {
    style?: CPStyleProp;
    query: OpenScheduleQuery;
    onChange: (qry: OpenScheduleQuery) => void;
}

const OpenScheduleSearchPanel = ({ style, query, onChange }: Props) => {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const club = useAppSelector((state) => state.club.club!);
    const [menuOptions, setMenuOptions] = useState<{ key: string; label: ReactNode }[]>([]);
    const [activeMenuItems, setActiveMenuItems] = useState<string[]>([]);
    const venues = getActiveRealVenues(club).filter(
        (x) => x.rsEtDate >= getTimeZoneMoment(club.timezone).format('YYYY-MM-DD')
    );

    useEffect(() => {
        setMenuOptions(getMenuOptions());
        const newActiveItems: string[] = Object.keys(query || {})
            .filter((key) => query[key as keyof OpenScheduleQuery])
            .map((key) => mapQueryKeyToMenu[key]);
        setActiveMenuItems(newActiveItems);
    }, [query]);

    const getMenuOptions = () => {
        const venue = getVenue(club, query.venue)!;
        const dates = getCurrentScheduleDates(club, venue);
        const newMenuOptions: { key: string; label: ReactNode }[] = [
            {
                key: 'Venue',
                label: (
                    <View style={getStyle(['row', 'align-items-center'])}>
                        <Icon name="location" size={18} type={IconType.Entypo} color={colors.iconPrimary} />
                        <View style={getStyle(['ml-4', 'mr-8'])}>
                            <CTText size={10} fontFamily={fonts.montserrat.bold} color={colors.primary}>
                                {venue.displayName}
                            </CTText>
                        </View>
                    </View>
                ),
            },
            {
                key: 'Date',
                label: (
                    <View style={getStyle(['row', 'align-items-center'])}>
                        <Icon name="calendar-outline" size={18} type={IconType.Ionicons} color={colors.iconPrimary} />
                        <View style={getStyle(['ml-4', 'mr-8'])}>
                            <CTText size={10} fontFamily={fonts.montserrat.bold} color={colors.primary}>
                                {query.date
                                    ? moment(query.date).format('MMM DD')
                                    : `${moment(dates[0]).format('MMM DD')} ~ ${moment(dates[dates.length - 1]).format(
                                          'MMM DD'
                                      )}`}
                            </CTText>
                        </View>
                    </View>
                ),
            },
            {
                key: 'Time',
                label: (
                    <View style={getStyle(['row', 'align-items-center'])}>
                        <Icon name="time" size={18} type={IconType.Ionicons} color={colors.iconPrimary} />
                        <View style={getStyle(['ml-4', 'mr-8'])}>
                            <CTText size={10} fontFamily={fonts.montserrat.bold} color={colors.primary}>
                                {query.time
                                    ? query.time === 'any_morning'
                                        ? 'Any Morning'
                                        : query.time === 'any_afternoon'
                                        ? 'Any Afternoon'
                                        : convertTimeString(query.time, 'hh:mm A')
                                    : 'Any Time'}
                            </CTText>
                        </View>
                    </View>
                ),
            },
        ];
        return newMenuOptions;
    };

    const venueOptions = () => {
        return venues.map((x) => {
            return { value: x._id, label: x.displayName };
        });
    };

    const dateOptions = () => {
        const venue = getVenue(club, query.venue);
        return [
            { value: 'any_date', label: 'Any Date' },
            ...getCurrentScheduleDates(club, venue!).map((x) => {
                return { value: x, label: moment(x).format('dddd, MMM DD, YYYY') };
            }),
        ];
    };

    const timeOptions = () => {
        const venue = getVenue(club, query.venue);
        return [
            { value: 'any_time', label: 'Any Time' },
            { value: 'any_morning', label: 'Any Morning' },
            { value: 'any_afternoon', label: 'Any Afternoon' },
            ...(venue?.setting.curtTimeSlots || []).map((x) => {
                return { value: x, label: convertTimeString(x, 'hh:mm A') };
            }),
        ];
    };

    const onSelectVenue = (value: string | string[] | null, index: number) => {
        if (index < 0 || !value) return;
        onChange({ ...query, venue: value as string, date: undefined, time: undefined });
    };

    const onSelectDate = (value: string | string[] | null, index: number) => {
        if (index < 0 || !value) return;
        if (index === 0) return onChange({ ...query, date: undefined });
        onChange({ ...query, date: value as string });
    };

    const onSelectTime = (value: string | string[] | null, index: number) => {
        if (index < 0 || !value) return;
        if (index === 0) return onChange({ ...query, time: undefined });
        onChange({ ...query, time: value as string });
    };

    const onSelectMenu = (menu: string) => {
        if (menu === 'Venue') {
            dispatch(
                showBottomSheetPicker({
                    options: venueOptions(),
                    value: query.venue,
                    onSelect: onSelectVenue,
                })
            );
        } else if (menu === 'Date') {
            dispatch(
                showBottomSheetPicker({
                    options: dateOptions(),
                    value: String(query.date),
                    onSelect: onSelectDate,
                })
            );
        } else if (menu === 'Time') {
            dispatch(
                showBottomSheetPicker({
                    options: timeOptions(),
                    value: query.time,
                    onSelect: onSelectTime,
                })
            );
        }
    };

    if ((menuOptions || []).length === 0) return null;

    return (
        <View style={[styles.container, style]}>
            <CPHorizontalMenu menuOptions={menuOptions!} activeLabels={activeMenuItems} onSelect={onSelectMenu} />
        </View>
    );
};

export default OpenScheduleSearchPanel;
