import { useTheme } from '@services/hooks/useTheme';
import CTButton from '@shared/components/controls/ct-button';
import CTText from '@shared/components/controls/ct-text';
import CTTextInput from '@shared/components/controls/ct-textinput';
import fonts from '@shared/theme/fonts';
import { getStyle } from '@shared/theme/themes';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import createStyles from './style';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import CTSelect from '@shared/components/controls/ct-select';
import { getCities, getCounties, getStates } from '@utils';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type FormValues = {
    clubName: string;
    name: string;
    state: string;
    county: string;
    city: string;
};

type ScreenProps = StackScreenProps<RootStackParamList, 'AddResource'>;

const AddResourceScreen = ({ route, navigation }: ScreenProps) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [counties, setCounties] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const { handleSubmit, control, formState, watch, setValue } = useForm<FormValues>({
        defaultValues: {
            clubName: '',
            name: '',
            state: '',
            county: '',
            city: '',
        },
    });

    useEffect(() => {
        watch(['state', 'county', 'city']);
        const subscription = watch((value, { name }) => {
            if (name === 'state') {
                setCounties(value.state ? getCounties(value.state) : []);
                setCities([]);
                setValue('county', '');
                setValue('city', '');
            }
            if (name === 'county') {
                setCities(value.state && value.county ? getCities(value.state, value.county) : []);
                setValue('city', '');
            }
        });
        return () => subscription.unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch]);

    const onSubmit = (data: FormValues) => {
        route.params?.callback?.({ ...data, createdBy: 'user' });
        navigation.pop();
    };

    const getStateOptions = () => {
        return getStates().map((x) => {
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

    return (
        <View style={styles.containerStyle}>
            <View style={getStyle(['row', 'align-items-center', 'justify-between', 'pt-60', 'pb-16'])}>
                <CTText h1 color={colors.text} fontFamily={fonts.montserrat.bold}>
                    Add Resource
                </CTText>
                <TouchableOpacity onPress={() => navigation.pop()}>
                    <Icon name="close" type={IconType.Ionicons} size={30} color={colors.text} />
                </TouchableOpacity>
            </View>
            <KeyboardAwareScrollView>
                <CTTextInput
                    style={getStyle('mb-8')}
                    name="clubName"
                    label="Club Name"
                    placeholder="Meadow Crek Club"
                    required
                    validation={{ control, formState, rules: { required: true } }}
                />
                <CTTextInput
                    style={getStyle('mb-8')}
                    name="name"
                    label="Resource Name"
                    placeholder="Indoor Court 12"
                    required
                    validation={{ control, formState, rules: { required: true } }}
                />
                <CTSelect
                    style={getStyle('mb-8')}
                    name="state"
                    label="State"
                    options={getStateOptions()}
                    required
                    validation={{ control, formState, rules: { required: true } }}
                />
                <CTSelect
                    style={getStyle('mb-8')}
                    name="county"
                    label="County"
                    options={getCounyOptions()}
                    required
                    validation={{ control, formState, rules: { required: true } }}
                />
                <CTSelect
                    style={getStyle('mb-32')}
                    name="city"
                    label="City"
                    options={getCityOptions()}
                    required
                    validation={{ control, formState, rules: { required: true } }}
                />
                <CTButton onPress={handleSubmit(onSubmit)}>
                    <CTText fontFamily={fonts.montserrat.regular} bold color={colors.white} center>
                        Add
                    </CTText>
                </CTButton>
            </KeyboardAwareScrollView>
        </View>
    );
};

export default AddResourceScreen;
