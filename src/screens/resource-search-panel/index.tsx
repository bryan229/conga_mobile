import React, { useEffect, useMemo, useState } from 'react';
import { Keyboard, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import { useAppDispatch, useAppSelector } from '@store/hook';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import { getStyle } from '@shared/theme/themes';
import { useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/types';
import CTSelect from '@shared/components/controls/ct-select';
import { FILTER_DATE_REANGES, FILTER_RADIUS } from '@shared/constants';
import { CongaClubEventQuery } from '@services/types';
import { getCities, getCounties, getFilterDateRangeLabel, getStates } from '@utils';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import CTButton from '@shared/components/controls/ct-button';
import { showAlert } from '@store/actions';

type FormValues = {
    organization: string;
    state: string;
    county: string;
    city: string;
};

type ScreenProps = StackScreenProps<RootStackParamList, 'ResourceSearchPanel'>;

const ResourceSearchPanelScreen = ({ route, navigation }: ScreenProps) => {
    const theme = useTheme();
    const { colors } = theme;
    const dispatch = useAppDispatch();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const userLocation = useAppSelector((state) => state.auth.location);
    const subClubs = useAppSelector((state) => state.club.subClubs);
    const [states] = useState<string[]>(getStates());
    const [counties, setCounties] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const currentQuery = route.params.query;
    const [query, setQuery] = useState<CongaClubEventQuery>(currentQuery);

    const { handleSubmit, control, formState, reset, watch, setValue } = useForm<FormValues>({
        defaultValues: {
            organization: currentQuery.organization ?? 'all',
            state: currentQuery.state ?? '',
            county: currentQuery.county ?? '',
            city: currentQuery.city ?? '',
        },
    });

    useEffect(() => {
        if (currentQuery.address) {
            if (currentQuery.state) {
                setCounties(getCounties(currentQuery.state));
                setCities(getCities(currentQuery.state));
            }
            if (currentQuery.state && currentQuery.county)
                setCities(getCities(currentQuery.state, currentQuery.county));
        }
    }, []);

    useEffect(() => {
        watch(['state', 'county']);
        const subscription = watch((value, { name }) => {
            if (name === 'state') {
                setCounties(value.state ? getCounties(value.state) : []);
                setCities(value.state ? getCities(value.state) : []);
                setValue('county', '');
                setValue('city', '');
            }
            if (name === 'county') {
                setCities(value.state ? getCities(value.state, value.county) : []);
            }
        });
        return () => subscription.unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch]);

    const onSearch = (data: FormValues) => {
        const { state, county, city, organization } = data;
        if (state && !county && !city) {
            dispatch(showAlert({ type: 'warning', title: 'Warning', message: 'Please select county or city' }));
            return;
        }
        let newQuery = {
            ...query,
            state: query.address ? state : undefined,
            county: query.address ? county : undefined,
            city: query.address ? city : undefined,
            organization: organization && organization !== 'all' ? organization : undefined,
        };
        setQuery(newQuery);
        route.params.onChange(newQuery);
        navigation.pop();
    };

    const goBack = () => {
        setQuery(currentQuery);
        reset({
            state: currentQuery.state,
            county: currentQuery.county,
            city: currentQuery.city,
        });
        navigation.pop();
    };

    const getStateOptions = () => {
        return states.map((x) => {
            return { value: x, label: x };
        });
    };

    const getCounyOptions = () => {
        return counties.map((x) => {
            return { value: x, label: x };
        });
    };

    const getCityOptions = () => {
        return cities.map((x) => {
            return { value: x, label: x };
        });
    };

    const getOrganizationOptions = () => {
        return [
            { value: 'all', label: 'All Organizations' },
            ...subClubs.map((x) => {
                return { value: x._id, label: x.name };
            }),
        ];
    };

    return (
        <View style={styles.containerStyle}>
            <View style={getStyle(['row', 'align-items-center', 'justify-between', 'pt-60', 'px-16'])}>
                <CTText h1 color={colors.text} fontFamily={fonts.montserrat.bold}>
                    {route.params.title ?? 'Event Filer'}
                </CTText>
                <TouchableOpacity onPress={goBack}>
                    <Icon name="close" type={IconType.Ionicons} size={30} color={colors.text} />
                </TouchableOpacity>
            </View>
            <KeyboardAwareScrollView>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.contentContainerStyle}>
                        <View style={[styles.itemContainterStyle]}>
                            {Object.values(FILTER_DATE_REANGES).map((x) => (
                                <TouchableOpacity
                                    style={[
                                        getStyle('mb-8'),
                                        query.dateRange === x ? styles.selectedItemStyle : styles.itemStyle,
                                    ]}
                                    key={x}
                                    onPress={() => {
                                        setQuery({ ...query, dateRange: x });
                                    }}
                                >
                                    <CTText
                                        fontFamily={fonts.montserrat.regular}
                                        color={query.dateRange === x ? colors.white : colors.primary}
                                        style={getStyle(['py-12', 'px-16'])}
                                    >
                                        {getFilterDateRangeLabel(x)}
                                    </CTText>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={[styles.itemContainterStyle, getStyle('pt-8'), styles.borderTopStyle]}>
                            {userLocation && (
                                <TouchableOpacity
                                    style={[
                                        getStyle('mb-8'),
                                        query.aroundMe ? styles.selectedItemStyle : styles.itemStyle,
                                    ]}
                                    disabled={!userLocation}
                                    onPress={() => {
                                        setQuery({
                                            ...query,
                                            aroundMe: !query.aroundMe,
                                            address: !query.aroundMe ? false : query.address,
                                            state: undefined,
                                            county: undefined,
                                            city: undefined,
                                        });
                                        reset({ state: '', county: '', city: '' });
                                    }}
                                >
                                    <CTText
                                        fontFamily={fonts.montserrat.regular}
                                        color={query.aroundMe ? colors.white : colors.primary}
                                        style={getStyle(['py-12', 'px-16'])}
                                    >
                                        Around Me
                                    </CTText>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                style={[getStyle('mb-8'), query.address ? styles.selectedItemStyle : styles.itemStyle]}
                                onPress={() => {
                                    setQuery({
                                        ...query,
                                        aroundMe: !query.address ? false : query.aroundMe,
                                        address: !query.address,
                                        state: undefined,
                                        county: undefined,
                                        city: undefined,
                                    });
                                    reset({ state: '', county: '', city: '' });
                                }}
                            >
                                <CTText
                                    fontFamily={fonts.montserrat.regular}
                                    color={query.address ? colors.white : colors.primary}
                                    style={getStyle(['py-12', 'px-16'])}
                                >
                                    Elsewhere
                                </CTText>
                            </TouchableOpacity>
                            {query.address && (
                                <View style={getStyle(['row', 'align-items-center', 'mx-4', 'mt-8'])}>
                                    <CTSelect
                                        name="state"
                                        style={getStyle('col')}
                                        placeholder="State"
                                        options={getStateOptions()}
                                        validation={{ control, formState, rules: { required: true } }}
                                    />
                                    <CTSelect
                                        style={getStyle(['ml-4', 'col'])}
                                        name="county"
                                        options={getCounyOptions()}
                                        placeholder="County"
                                        clearable
                                        validation={{ control, formState, rules: { required: false } }}
                                    />
                                    <CTSelect
                                        style={getStyle(['ml-4', 'col'])}
                                        name="city"
                                        options={getCityOptions()}
                                        placeholder="City"
                                        clearable
                                        validation={{ control, formState, rules: { required: false } }}
                                    />
                                </View>
                            )}
                        </View>
                        <View style={[styles.itemContainterStyle, getStyle('pt-8'), styles.borderTopStyle]}>
                            <CTSelect
                                name="organization"
                                style={getStyle(['col', 'mx-4'])}
                                placeholder="MT Tam Club"
                                options={getOrganizationOptions()}
                                validation={{ control, formState, rules: { required: true } }}
                            />
                        </View>
                        {(query.aroundMe || query.address) && (
                            <View style={[styles.itemContainterStyle, styles.borderTopStyle, getStyle('pt-8')]}>
                                {Object.values(FILTER_RADIUS)
                                    .filter((x) => typeof x === 'number')
                                    .map((x) => (
                                        <TouchableOpacity
                                            style={[
                                                getStyle('mb-8'),
                                                query.radius === x ? styles.selectedItemStyle : styles.itemStyle,
                                            ]}
                                            key={x}
                                            onPress={() => {
                                                setQuery({ ...query, radius: Number(x) });
                                            }}
                                        >
                                            <CTText
                                                fontFamily={fonts.montserrat.regular}
                                                color={query.radius === x ? colors.white : colors.primary}
                                                style={getStyle(['py-12', 'px-16'])}
                                            >
                                                {x} Miles
                                            </CTText>
                                        </TouchableOpacity>
                                    ))}
                            </View>
                        )}
                        <View style={getStyle(['row', 'align-items-center', 'mt-16'])}>
                            <CTButton color={colors.secondary} style={getStyle(['col'])} onPress={goBack}>
                                <CTText center fontFamily={fonts.montserrat.regular} color={colors.white} bold>
                                    Cancel
                                </CTText>
                            </CTButton>

                            <CTButton style={getStyle(['col', 'ml-8'])} onPress={handleSubmit(onSearch)}>
                                <CTText center fontFamily={fonts.montserrat.regular} color={colors.white} bold>
                                    Search
                                </CTText>
                            </CTButton>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
        </View>
    );
};

export default ResourceSearchPanelScreen;
