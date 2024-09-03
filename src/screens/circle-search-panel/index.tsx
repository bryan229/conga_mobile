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
import { CircleQuery } from '@services/types';
import { getCities, getCounties, getStates } from '@utils';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import CTButton from '@shared/components/controls/ct-button';
import { showAlert } from '@store/actions';

type FormValues = {
    state: string;
    county: string;
    city: string;
    subClub?: string;
};

type ScreenProps = StackScreenProps<RootStackParamList, 'CircleSearchPanel'>;

const CircleSearchPanelScreen = ({ route, navigation }: ScreenProps) => {
    const theme = useTheme();
    const { colors } = theme;
    const dispatch = useAppDispatch();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const subClubs = useAppSelector((state) => state.club.subClubs);
    const [states] = useState<string[]>(getStates());
    const [counties, setCounties] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const currentQuery = route.params.query;
    const [query, setQuery] = useState<CircleQuery>(currentQuery);

    const { handleSubmit, control, formState, reset, watch, setValue } = useForm<FormValues>({
        defaultValues: {
            state: currentQuery.state ?? '',
            county: currentQuery.county ?? '',
            city: currentQuery.city ?? '',
            subClub: currentQuery.subClub,
        },
    });

    useEffect(() => {
        if (currentQuery.state) {
            setCounties(getCounties(currentQuery.state));
            setCities(getCities(currentQuery.state));
        }
        if (currentQuery.state && currentQuery.county) setCities(getCities(currentQuery.state, currentQuery.county));
    }, []);

    useEffect(() => {
        watch(['state', 'county', 'subClub']);
        const subscription = watch((value, { name }) => {
            if (name === 'state') {
                setCounties(value.state ? getCounties(value.state) : []);
                setCities(value.state ? getCities(value.state) : []);
                setValue('county', '');
                setValue('city', '');
                if (value.state && value.subClub !== 'all') setValue('subClub', undefined);
            }
            if (name === 'county') {
                setCities(value.state ? getCities(value.state, value.county) : []);
            }
            if (name === 'subClub') {
                if (value.subClub && value.subClub !== 'all') {
                    setValue('state', '');
                    setValue('county', '');
                    setValue('city', '');
                }
            }
        });
        return () => subscription.unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch]);

    const onSearch = (data: FormValues) => {
        const { state, county, city, subClub } = data;
        if (state && !county && !city) {
            dispatch(showAlert({ type: 'warning', title: 'Warning', message: 'Please select county or city' }));
            return;
        }
        let newQuery = {
            ...query,
            state: state ?? undefined,
            county: county ?? undefined,
            city: city ?? undefined,
            subClub: subClub && subClub !== 'all' ? subClub : undefined,
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
            subClub: currentQuery.subClub,
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
                        <View style={[getStyle('py-16'), styles.borderBottomStyle]}>
                            <CTText
                                style={getStyle('mb-4')}
                                fontFamily={fonts.montserrat.regular}
                                color={colors.darkGray}
                            >
                                Region
                            </CTText>
                            <View style={getStyle(['row', 'align-items-center'])}>
                                <CTSelect
                                    name="state"
                                    style={getStyle('col')}
                                    placeholder="State"
                                    options={getStateOptions()}
                                    clearable
                                    validation={{ control, formState, rules: { required: false } }}
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
                        </View>

                        <View style={getStyle('py-16')}>
                            <CTText
                                style={getStyle('mb-4')}
                                fontFamily={fonts.montserrat.regular}
                                color={colors.darkGray}
                            >
                                Organization
                            </CTText>
                            <CTSelect
                                name="subClub"
                                placeholder="Hilton Resort"
                                options={getOrganizationOptions()}
                                validation={{ control, formState, rules: { required: false } }}
                            />
                        </View>
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

export default CircleSearchPanelScreen;
