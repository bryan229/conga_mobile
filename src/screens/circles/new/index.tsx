import React, { useEffect, useMemo, useState } from 'react';
import { Keyboard, ScrollView, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { CircleApi } from '@services/api';
import { handleError, showAlert } from '@store/actions';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import BackHeader from '@navigation/components/back-header';
import { getStyle } from '@shared/theme/themes';
import { useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CTTextInput from '@shared/components/controls/ct-textinput';
import CTTextArea from '@shared/components/controls/ct-textarea';
import CTButton from '@shared/components/controls/ct-button';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/types';
import { User } from '@services/models';
import ReactNativeModal from 'react-native-modal';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import SearchMemberContent from '@shared/components/search-member-content';
import CPAvatar from '@shared/components/avatar';
import CTSelect from '@shared/components/controls/ct-select';
import { getCities, getCounties, getStates } from '@utils';
import { CIRCLE_AGETYPES, ELIGIBLE_GENDERS } from '@shared/constants';
import CTSwitch from '@shared/components/controls/ct-switch';
import CTMultiSelect from '@shared/components/controls/ct-multi-select';

type FormValues = {
    name: string;
    description: string;
    state: string;
    county: string;
    city: string;
    subClub: string;
    eligibleGender: ELIGIBLE_GENDERS;
    isRestrictedByLevel: boolean;
    eligibleLevelFrom: number;
    eligibleLevelTo: number;
    ageRanges: CIRCLE_AGETYPES[];
};

type NewCircleScreenProps = StackScreenProps<RootStackParamList, 'NewCircle'>;

const NewCircleScreen = ({ navigation }: NewCircleScreenProps) => {
    const user = useAppSelector((state) => state.auth.user!);
    const club = useAppSelector((state) => state.club.club!);
    const subClubs = useAppSelector((state) => state.club.subClubs);
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [loading, setLoading] = useState<boolean>(false);
    const [members, setMembers] = useState<User[]>([]);
    const [states] = useState<string[]>(getStates());
    const [counties, setCounties] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
    const [isOpenSearchMemberModal, setIsOpenSearchMemberModal] = useState<boolean>(false);
    const { handleSubmit, control, formState, watch, setValue, getValues } = useForm<FormValues>({
        defaultValues: {
            name: '',
            description: '',
            state: '',
            county: '',
            city: '',
            eligibleGender: ELIGIBLE_GENDERS.MIXED,
            ageRanges: [],
            isRestrictedByLevel: false,
        },
    });

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

    const onCreate = async (formData: FormValues) => {
        const { subClub, description, isRestrictedByLevel, eligibleLevelFrom, eligibleLevelTo, ...data } = formData;
        try {
            setLoading(true);
            const params = {
                leader: user._id,
                ...data,
                subClub: subClub || undefined,
                description: description.trim(),
                eligibleLevel: isRestrictedByLevel
                    ? { from: Number(eligibleLevelFrom), to: Number(eligibleLevelTo) }
                    : undefined,
                members: members.map((x) => x._id),
            };
            const { message } = await CircleApi.create(params);
            dispatch(showAlert({ type: 'success', title: 'Success', message }));
            navigation.goBack();
        } catch (error) {
            dispatch(handleError(error));
        } finally {
            setLoading(false);
        }
    };

    const toggle = () => {
        setIsOpenSearchMemberModal(!isOpenSearchMemberModal);
    };

    const removeMember = (member: User) => {
        const newMembers = [...members].filter((x) => x._id !== member._id);
        setMembers(newMembers);
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
        <View style={styles.containerStyle}>
            <BackHeader title="Create Own Circle" style={styles.headerStyle} />
            <KeyboardAwareScrollView>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.contentContainerStyle}>
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
                                <CTText
                                    style={getStyle(['mr-4', 'mb-4'])}
                                    size={10}
                                    fontFamily={fonts.montserrat.regular}
                                >
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
                        {!getValues().subClub && (
                            <>
                                <CTText fontFamily={fonts.montserrat.regular} size={10} style={getStyle('mb-4')}>
                                    Members
                                </CTText>
                                {members.length > 0 && (
                                    <ScrollView style={styles.membersListContainer}>
                                        {members.map((x) => (
                                            <TouchableWithoutFeedback key={x._id}>
                                                <View style={styles.memberItemStyle}>
                                                    <View style={getStyle(['row', 'align-items-center'])}>
                                                        <CPAvatar source={x.photoUrl} name={x.fullName} size={35} />
                                                        <View style={getStyle('ml-8')}>
                                                            <CTText fontFamily={fonts.montserrat.regular}>
                                                                {x.fullName}
                                                            </CTText>
                                                            <CTText fontFamily={fonts.montserrat.regular} size={9}>
                                                                {x.email}
                                                            </CTText>
                                                        </View>
                                                    </View>
                                                    <TouchableOpacity onPress={() => removeMember(x)}>
                                                        <Icon
                                                            type={IconType.Ionicons}
                                                            name="trash"
                                                            color={colors.danger}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        ))}
                                    </ScrollView>
                                )}

                                <TouchableOpacity onPress={toggle} style={styles.addMemberBtnStyle}>
                                    <CTText fontFamily={fonts.montserrat.regular} bold color={colors.text} center>
                                        Add Members
                                    </CTText>
                                </TouchableOpacity>
                            </>
                        )}
                        <CTButton loading={loading} onPress={handleSubmit(onCreate)} style={getStyle('mt-8')}>
                            <CTText fontFamily={fonts.montserrat.regular} bold color={colors.white} center>
                                Create
                            </CTText>
                        </CTButton>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
            <ReactNativeModal
                isVisible={isOpenSearchMemberModal}
                statusBarTranslucent={false}
                backdropOpacity={0.8}
                animationIn="slideInUp"
                animationInTiming={200}
                animationOut="slideOutDown"
                animationOutTiming={300}
            >
                <View style={styles.searchMemberModalContainer}>
                    <View style={getStyle(['row', 'justify-between', 'align-items-center', 'mb-16'])}>
                        <View />
                        <CTText h3 fontFamily={fonts.montserrat.bold} color={colors.text}>
                            Seach Members
                        </CTText>
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedMembers([]);
                                toggle();
                            }}
                        >
                            <Icon name="close" type={IconType.Ionicons} size={25} />
                        </TouchableOpacity>
                    </View>
                    <SearchMemberContent
                        style={styles.searchMemberContentStyle}
                        query={{ club: club._id }}
                        isMulti
                        onResult={setSelectedMembers}
                    />
                    {selectedMembers.length > 0 && (
                        <CTButton
                            onPress={() => {
                                const newMembers = [...members, ...selectedMembers]
                                    .filter((x, index, self) => self.findIndex((v) => v._id === x._id) === index)
                                    .filter((x) => x._id !== user._id);
                                setMembers(newMembers);
                                setSelectedMembers([]);
                                toggle();
                            }}
                        >
                            <CTText fontFamily={fonts.montserrat.regular} bold color={colors.white} center>
                                Add {selectedMembers.length} Members
                            </CTText>
                        </CTButton>
                    )}
                </View>
            </ReactNativeModal>
        </View>
    );
};

export default NewCircleScreen;
