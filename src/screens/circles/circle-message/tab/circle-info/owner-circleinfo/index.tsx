import { Circle, SubClub } from '@services/models';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { useEffect, useMemo, useState } from 'react';
import createStyles from './style';
import { useForm } from 'react-hook-form';
import { useTheme } from '@services/hooks/useTheme';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CTTextInput from '@shared/components/controls/ct-textinput';
import CTTextArea from '@shared/components/controls/ct-textarea';
import CTButton from '@shared/components/controls/ct-button';
import CTText from '@shared/components/controls/ct-text';
import { getStyle } from '@shared/theme/themes';
import fonts from '@shared/theme/fonts';
import { CircleApi } from '@services/api';
import { handleError, showAlert, showAlertModal } from '@store/actions';
import { useAppNavigation } from '@services/hooks/useNavigation';
import { getCities, getCounties, getStates } from '@utils';
import CTSelect from '@shared/components/controls/ct-select';
import { CIRCLE_AGETYPES, ELIGIBLE_GENDERS } from '@shared/constants';
import CTMultiSelect from '@shared/components/controls/ct-multi-select';
import CTSwitch from '@shared/components/controls/ct-switch';

type FormValues = {
    name: string;
    description: string;
    state: string;
    county: string;
    city: string;
    subClub: string;
    eligibleGender: 'male' | 'female' | 'mixed';
    isRestrictedByLevel: boolean;
    eligibleLevelFrom: number;
    eligibleLevelTo: number;
    ageRanges: CIRCLE_AGETYPES[];
};

const OwnerCircleInfo = ({ circle }: { circle: Circle }) => {
    const subClubs = useAppSelector((state) => state.club.subClubs);
    const dispatch = useAppDispatch();
    const navigation = useAppNavigation();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [saveLoading, setSaveLoading] = useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const [states] = useState<string[]>(getStates());
    const [counties, setCounties] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const { handleSubmit, control, formState, watch, setValue, getValues } = useForm<FormValues>({
        defaultValues: {
            name: circle.name,
            description: circle.description,
            state: circle.state,
            county: circle.county,
            city: circle.city,
            subClub: (circle.subClub as SubClub)?._id,
            eligibleGender: circle.eligibleGender,
            eligibleLevelFrom: circle.eligibleLevel?.from,
            eligibleLevelTo: circle.eligibleLevel?.to,
            ageRanges: circle.ageRanges ?? [],
            isRestrictedByLevel: !!circle.eligibleLevel,
        },
    });

    useEffect(() => {
        if (circle.state) {
            setCounties(getCounties(circle.state));
            if (circle.county) setCities(getCities(circle.state, circle.county));
            else setCities(getCities(circle.state));
        }
    }, []);

    useEffect(() => {
        watch(['state', 'county', 'subClub', 'isRestrictedByLevel']);
        const subscription = watch((value, { name }) => {
            if (name === 'state') {
                setCounties(value.state ? getCounties(value.state) : []);
                setCities(value.state ? getCities(value.state) : []);
                setValue('county', '');
                setValue('city', '');
            }
            if (name === 'county') {
                setCities(value.state ? getCities(value.state, value.county) : []);
                setValue('city', '');
            }
        });
        return () => subscription.unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch]);

    const onSave = async (formData: FormValues) => {
        const { subClub, description, isRestrictedByLevel, eligibleLevelFrom, eligibleLevelTo, ...data } = formData;
        try {
            const params = {
                _id: circle._id,
                ...data,
                subClub: subClub || undefined,
                description: description.trim(),
                eligibleLevel: isRestrictedByLevel
                    ? { from: Number(eligibleLevelFrom), to: Number(eligibleLevelTo) }
                    : undefined,
            };
            setSaveLoading(true);
            const { message } = await CircleApi.update(params);
            dispatch(showAlert({ type: 'success', title: 'Success', message }));
        } catch (error) {
            dispatch(handleError(error));
        } finally {
            setSaveLoading(false);
        }
    };

    const deleteCircle = async () => {
        dispatch(
            showAlertModal({
                type: 'warning',
                title: 'Delete Circle',
                message: 'Do you want to delete this circle? \n Are you sure?',
                buttons: [
                    {
                        type: 'ok',
                        label: 'Yes',
                        value: 'yes',
                    },
                    {
                        type: 'ok',
                        label: 'No',
                        value: 'no',
                    },
                ],
                handler: async (value: string) => {
                    if (value === 'no') return;
                    setDeleteLoading(true);
                    try {
                        const params = { _id: circle._id };
                        await CircleApi.delete(params);
                        setDeleteLoading(false);
                        dispatch(
                            showAlert({ type: 'success', title: 'Success', message: 'Circle haas been deleted.' })
                        );
                        navigation.navigate('Circles');
                    } catch (error) {
                        setDeleteLoading(false);
                        dispatch(handleError(error));
                    }
                },
            })
        );
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

    const getSubClubOptions = () => {
        return subClubs.map((x) => {
            return { value: x._id, label: x.name };
        });
    };

    const getGenderOptions = () => {
        return [
            { value: ELIGIBLE_GENDERS.MALE, label: 'Male' },
            { value: ELIGIBLE_GENDERS.FEMALE, label: 'Female' },
            { value: ELIGIBLE_GENDERS.MIXED, label: 'Mixed' },
        ];
    };

    const getAgeRangeOptions = () => {
        return [
            { value: CIRCLE_AGETYPES.ADULT, label: 'Adult' },
            { value: CIRCLE_AGETYPES.SENIOR, label: 'Senior' },
            { value: CIRCLE_AGETYPES.JUNIOR, label: 'Junior' },
        ];
    };

    return (
        <KeyboardAwareScrollView>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.circleInfoContainerStyle}>
                    <CTTextInput
                        style={getStyle('mb-8')}
                        name="name"
                        label="Name"
                        placeholder="Pickleball"
                        required
                        validation={{ control, formState, rules: { required: true } }}
                    />
                    <CTTextArea
                        style={getStyle('mb-8')}
                        name="description"
                        label="Description"
                        placeholder="Description Here"
                        required
                        validation={{ control, formState, rules: { required: true } }}
                    />
                    <CTSelect
                        style={getStyle('mb-8')}
                        name="subClub"
                        label="Please select if this is a circle only for guests of any club, resort, or hotel"
                        clearable
                        options={getSubClubOptions()}
                        validation={{ control, formState, rules: { required: false } }}
                    />
                    {!getValues().subClub && (
                        <>
                            <CTText style={getStyle('mb-4')} size={10}>
                                If this circle is only for users in a specific region, please add that region.
                            </CTText>
                            <View style={styles.addressContainerStyle}>
                                <CTSelect
                                    name="state"
                                    style={getStyle('mb-8')}
                                    placeholder="State"
                                    options={getStateOptions()}
                                    required
                                    clearable
                                    validation={{ control, formState, rules: { required: false } }}
                                />
                                <CTSelect
                                    style={getStyle('mb-8')}
                                    name="county"
                                    options={getCounyOptions()}
                                    placeholder="County"
                                    clearable
                                    required
                                    validation={{ control, formState, rules: { required: false } }}
                                />
                                <CTSelect
                                    style={getStyle('mb-8')}
                                    name="city"
                                    options={getCityOptions()}
                                    placeholder="City"
                                    clearable
                                    required
                                    validation={{ control, formState, rules: { required: false } }}
                                />
                            </View>
                        </>
                    )}
                    <CTSelect
                        style={getStyle('mb-8')}
                        name="eligibleGender"
                        label="Eligible Gender"
                        options={getGenderOptions()}
                        clearable
                        validation={{ control, formState, rules: { required: false } }}
                    />
                    <CTSwitch
                        name="isRestrictedByLevel"
                        label="Is restricted by game level of members?"
                        style={[getStyle(['mb-16', 'mt-8'])]}
                        validation={{ control, formState, rules: { required: false } }}
                    />
                    {getValues().isRestrictedByLevel && (
                        <View style={getStyle('mb-8')}>
                            <CTText style={getStyle(['mr-4', 'mb-4'])} size={10} fontFamily={fonts.montserrat.regular}>
                                Eligible Game Level
                                <CTText color={colors.danger} size={12}>
                                    &nbsp;*
                                </CTText>
                            </CTText>
                            <View style={getStyle('row')}>
                                <CTTextInput
                                    style={getStyle(['col', 'mr-8'])}
                                    name="eligibleLevelFrom"
                                    placeholder="3.5"
                                    required
                                    keyboardType="numeric"
                                    validation={{ control, formState, rules: { required: true } }}
                                />
                                <CTTextInput
                                    style={getStyle('col')}
                                    name="eligibleLevelTo"
                                    placeholder="5.0"
                                    required
                                    keyboardType="numeric"
                                    validation={{ control, formState, rules: { required: true } }}
                                />
                            </View>
                        </View>
                    )}
                    <CTMultiSelect
                        style={getStyle('mb-8')}
                        name="ageRanges"
                        label="Eligible Age Ranges"
                        options={getAgeRangeOptions()}
                        validation={{ control, formState, rules: { required: false } }}
                    />
                    <CTButton loading={saveLoading} onPress={handleSubmit(onSave)} style={getStyle('my-32')}>
                        <CTText fontFamily={fonts.montserrat.regular} bold color={colors.white} center>
                            Save
                        </CTText>
                    </CTButton>
                    <CTButton loading={deleteLoading} onPress={deleteCircle} color={colors.danger}>
                        <CTText fontFamily={fonts.montserrat.regular} bold color={colors.white} center>
                            Delete Circle
                        </CTText>
                    </CTButton>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
    );
};

export default OwnerCircleInfo;
