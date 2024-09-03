import React, { useEffect, useMemo, useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import { CPStyleProp, ClubEventQuery } from '@services/types';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { VENUE_TYPE } from '@shared/constants';
import CPHorizontalMenu from '@shared/components/horizontal-menu';
import { showBottomSheetPicker } from '@store/actions/ui';
import createStyles from './style';
import { getActiveVenues } from '@services/helpers/club';
import { updateClubEventQuery } from '@store/actions/clubevent';
import moment from 'moment';

const mapQueryKeyToMenu: { [key: string]: string } = {
    from: 'From',
    to: 'To',
    venue: 'Venue',
    court: 'Court',
    location: 'Location',
    eventType: 'Event Type',
    sponsor: 'Sponsor',
    invitedMemberTypes: 'Member Type',
};

interface Props {
    style?: CPStyleProp;
}

const ClubEventSearchPanel = ({ style }: Props) => {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const query = useAppSelector((state) => state.clubEvent.query);
    const club = useAppSelector((state) => state.club.club);
    const sponsors = useAppSelector((state) => state.club.sponsors);
    const memberTypes = useAppSelector((state) => state.club.memberTypes);
    const [menuItems, setMenuItems] = useState<string[]>();
    const [activeMenuItems, setActiveMenuItems] = useState<string[]>([]);
    const [isOpenDatePicker, setIsOpenDatePicker] = useState<boolean>(false);
    const [selectedDateType, setSelectedDateType] = useState<'From' | 'To'>();

    useEffect(() => {
        let _menuItems: string[] = ['From', 'To', 'Venue', 'Event Type', 'Sponsor', 'Member Type'];
        if (query.venue) {
            const currentVenue = getActiveVenues(club!).find((x) => x._id === query.venue);
            if (currentVenue?.type === VENUE_TYPE.VIRTUAL)
                _menuItems = ['From', 'To', 'Venue', 'Location', 'Event Type', 'Sponsor', 'Member Type'];
            else _menuItems = ['From', 'To', 'Venue', 'Court', 'Event Type', 'Sponsor', 'Member Type'];
        }
        setMenuItems(_menuItems);
    }, [query.venue]);

    useEffect(() => {
        const newActiveItems: string[] = Object.keys(query || {})
            .filter((key) => query[key as keyof ClubEventQuery])
            .map((key) => mapQueryKeyToMenu[key]);
        setActiveMenuItems(newActiveItems);
    }, [query]);

    const venueOptions = () => {
        return [
            { value: 'all', label: 'All' },
            ...getActiveVenues(club!).map((x) => {
                return { value: x._id, label: x.displayName };
            }),
        ];
    };

    const courtOptions = () => {
        if (!query.venue) return [];
        const currentVenue = getActiveVenues(club!).find((x) => x._id === query.venue);
        if (currentVenue?.type === VENUE_TYPE.REAL) {
            return [
                { value: 'all', label: 'All' },
                ...(currentVenue.setting?.curtActivatedCourts || []).map((x) => {
                    return { value: String(x), label: `${currentVenue.courtDisplayName} ${x + 1}` };
                }),
            ];
        }
        return [
            { value: 'all', label: 'All' },
            ...(currentVenue?.setting?.activatedLocations || []).map((x) => {
                return { value: x, label: x };
            }),
        ];
    };

    const eventTypeOptions = () => {
        return [
            { value: 'all', label: 'All' },
            ...(club?.setting?.eventTypes || []).map((x) => {
                return { value: x, label: x };
            }),
        ];
    };

    const sponsorOptions = () => {
        return [
            { value: 'all', label: 'All' },
            ...sponsors.map((x) => {
                return { value: x._id, label: x.fullName };
            }),
        ];
    };

    const memberTypeOptions = () => {
        return [
            { value: 'all', label: 'All' },
            ...memberTypes
                .filter((x) => x.isAllowClubEvent)
                .map((x) => {
                    return { value: x._id, label: x.name };
                }),
        ];
    };

    const onSelectVenue = (value: string | string[] | null, index: number) => {
        if (index < 0 || !value) return;
        if (index === 0) dispatch(updateClubEventQuery({ venue: undefined }));
        else dispatch(updateClubEventQuery({ venue: value as string }));
    };

    const onSelectCourt = (value: string | string[] | null, index: number) => {
        if (index < 0 || !value) return;
        if (index === 0) dispatch(updateClubEventQuery({ court: undefined }));
        else dispatch(updateClubEventQuery({ court: Number(value as string), location: undefined }));
    };

    const onSelectLocation = (value: string | string[] | null, index: number) => {
        if (index < 0 || !value) return;
        if (index === 0) dispatch(updateClubEventQuery({ location: undefined }));
        else dispatch(updateClubEventQuery({ location: value as string, court: undefined }));
    };

    const onSelectEventType = (value: string | string[] | null, index: number) => {
        if (index < 0 || !value) return;
        if (index === 0) dispatch(updateClubEventQuery({ eventType: undefined }));
        else dispatch(updateClubEventQuery({ eventType: value as string }));
    };

    const onSelectSponsor = (value: string | string[] | null, index: number) => {
        if (index < 0 || !value) return;
        if (index === 0) dispatch(updateClubEventQuery({ sponsor: undefined }));
        else dispatch(updateClubEventQuery({ sponsor: value as string }));
    };

    const onSelectMemberType = (value: string | string[] | null, index: number) => {
        if (index < 0 || !value) return;
        if (index === 0) dispatch(updateClubEventQuery({ invitedMemberTypes: undefined }));
        else dispatch(updateClubEventQuery({ invitedMemberTypes: value as string }));
    };

    const onSelectDate = (value: any) => {
        setIsOpenDatePicker(false);
        dispatch(
            updateClubEventQuery(
                selectedDateType === 'From'
                    ? { from: moment(value).startOf('day').toDate() }
                    : { to: moment(value).endOf('day').toDate() }
            )
        );
    };

    const onSelectMenu = (menu: string) => {
        if (menu === 'From' || menu === 'To') {
            setIsOpenDatePicker(true);
            setSelectedDateType(menu);
        } else {
            setIsOpenDatePicker(false);
            if (menu === 'Venue') {
                dispatch(
                    showBottomSheetPicker({
                        options: venueOptions(),
                        value: query.venue,
                        onSelect: onSelectVenue,
                    })
                );
            } else if (menu === 'Court') {
                dispatch(
                    showBottomSheetPicker({
                        options: courtOptions(),
                        value: String(query.court),
                        onSelect: onSelectCourt,
                    })
                );
            } else if (menu === 'Location') {
                dispatch(
                    showBottomSheetPicker({
                        options: courtOptions(),
                        value: query.location,
                        onSelect: onSelectLocation,
                    })
                );
            } else if (menu === 'Event Type') {
                dispatch(
                    showBottomSheetPicker({
                        options: eventTypeOptions(),
                        value: query.eventType,
                        onSelect: onSelectEventType,
                    })
                );
            } else if (menu === 'Sponsor') {
                dispatch(
                    showBottomSheetPicker({
                        options: sponsorOptions(),
                        value: query.sponsor,
                        onSelect: onSelectSponsor,
                    })
                );
            } else if (menu === 'Member Type') {
                dispatch(
                    showBottomSheetPicker({
                        options: memberTypeOptions(),
                        value: query.invitedMemberTypes,
                        onSelect: onSelectMemberType,
                    })
                );
            }
        }
    };

    if ((menuItems || []).length === 0) return null;

    return (
        <View style={[styles.container, style]}>
            <CPHorizontalMenu menuLabels={menuItems!} activeLabels={activeMenuItems} onSelect={onSelectMenu} />
            <DateTimePickerModal
                isVisible={isOpenDatePicker}
                onConfirm={onSelectDate}
                display="spinner"
                mode="date"
                maximumDate={selectedDateType === 'From' ? moment(query.to).toDate() : undefined}
                minimumDate={selectedDateType === 'To' ? moment(query.from).toDate() : undefined}
                date={moment(selectedDateType === 'From' ? query.from : query.to).toDate() || new Date()}
                onCancel={() => setIsOpenDatePicker(false)}
                buttonTextColorIOS={colors.dynamicPrimary}
            />
        </View>
    );
};

export default ClubEventSearchPanel;
