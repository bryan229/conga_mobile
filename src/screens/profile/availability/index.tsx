import React, { useMemo } from 'react';
import { View } from 'react-native';
import createStyles from './style';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { useForm } from 'react-hook-form';
import { useTheme } from '@services/hooks/useTheme';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import CTSelect from '@shared/components/controls/ct-select';
import { updateUser } from '@store/actions';
import { TouchableOpacity } from 'react-native';
import CTText from '@shared/components/controls/ct-text';
import { WEEKDAYS } from '@shared/constants';
import { getStyle } from '@shared/theme/themes';
import { UserAvt } from '@services/models';
import moment from 'moment';
import CTButton from '@shared/components/controls/ct-button';
import { ScrollView } from 'react-native';

type FormValues = {
    timeSlot: string;
    weekDay: string;
    repeatWeeks?: string;
};

const Availability = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const club = useAppSelector((state) => state.club.club);
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const { handleSubmit, control, formState, reset } = useForm<FormValues>({
        defaultValues: {
            timeSlot: '',
            weekDay: '',
            repeatWeeks: '',
        },
    });

    const addNewAvt = (data: FormValues) => {
        const { timeSlot, weekDay, repeatWeeks } = data;
        const getExpireDate = () => {
            if (repeatWeeks === 'always') return undefined;
            if (repeatWeeks === 'current_week')
                return moment().startOf('week').add(Number(weekDay), 'days').format('YYYY-MM-DD');
            if (repeatWeeks === 'current_month')
                return moment().endOf('month').startOf('week').add(Number(weekDay), 'days').format('YYYY-MM-DD');
            return moment()
                .add(Number(repeatWeeks) - 1, 'weeks')
                .startOf('week')
                .add(Number(weekDay), 'days')
                .format('YYYY-MM-DD');
        };
        const newAvts = [
            ...(user?.availability || []),
            { timeSlot, weekDay: Number(weekDay), expireDate: getExpireDate() },
        ];
        const params = { _id: user?._id, availability: newAvts };
        dispatch(updateUser(params));
        reset({ timeSlot: '', weekDay: '', repeatWeeks: '' });
    };

    const deleteAvt = (index: number) => {
        const newAvts = [...(user?.availability || [])];
        newAvts.splice(index, 1);
        const params = { _id: user?._id, availability: newAvts };
        dispatch(updateUser(params));
    };

    const getWeekdayOptions = () => {
        return WEEKDAYS.map((x, index) => {
            return { value: String(index), label: x };
        });
    };

    const getAvtTimeslotOptions = () => {
        return (club?.setting?.avtTimeSlots || []).map((x) => {
            return { value: x.name, label: `${x.name} (${x.stTime}~${x.etTime})` };
        });
    };

    const getRepeatOptions = () => {
        return [
            { value: 'always', label: 'Always' },
            { value: 'current_week', label: 'Current Week' },
            { value: 'current_month', label: 'Current Month' },
            ...Array(51)
                .fill(1)
                .map((_, index) => {
                    return { value: `${index + 2}`, label: `${index + 2} Weeks` };
                }),
        ];
    };

    const AvtItem = ({ avt, index }: { avt: UserAvt; index: number }) => {
        return (
            <View style={styles.avtItemContainerStyle}>
                <View style={styles.avtItemTextContainerStyle}>
                    <CTText style={styles.dateTimeTextStyle} center>
                        {avt.timeSlot} on {WEEKDAYS[avt.weekDay]}
                    </CTText>
                    <View style={styles.expireTextContainerStyle}>
                        <CTText color={colors.danger} size={8} style={getStyle('mb-4')}>
                            Expire Date
                        </CTText>
                        <CTText size={8}>
                            {!avt.expireDate ? 'NONE' : moment(avt.expireDate, 'YYYY-MM-DD').format('MMM/DD/YY')}
                        </CTText>
                    </View>
                </View>
                <TouchableOpacity style={styles.removeBtnContainerStyle} onPress={() => deleteAvt(index)}>
                    <Icon type={IconType.Ionicons} name="trash-outline" size={20} color={colors.white} />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.containerStyle}>
            <CTText center size={10} color={colors.primary} style={getStyle('mb-8')}>
                I am interested and available to play on the dates and times below
            </CTText>
            <CTText style={getStyle(['pt-24', 'pb-12'])} h4 bold>
                Add New Availability
            </CTText>
            <View>
                <View style={getStyle('row')}>
                    <CTSelect
                        style={[styles.controlStyle, getStyle(['col', 'mr-4'])]}
                        name="weekDay"
                        label="Weekday"
                        required
                        options={getWeekdayOptions()}
                        validation={{ control, formState, rules: { required: true } }}
                    />
                    <CTSelect
                        style={[styles.controlStyle, getStyle(['col', 'ml-4'])]}
                        name="timeSlot"
                        label="Time"
                        required
                        options={getAvtTimeslotOptions()}
                        validation={{ control, formState, rules: { required: true } }}
                    />
                </View>
                <View style={getStyle(['row', 'align-items-end'])}>
                    <CTSelect
                        style={[styles.controlStyle, getStyle(['col', 'mr-4'])]}
                        name="repeatWeeks"
                        label="Repeat Cycle"
                        required
                        options={getRepeatOptions()}
                        validation={{ control, formState, rules: { required: true } }}
                    />
                    <CTButton
                        title="Add New"
                        style={[styles.addNewBtnStyle, getStyle(['col', 'mb-8', 'ml-4'])]}
                        onPress={handleSubmit(addNewAvt)}
                    />
                </View>
            </View>
            <CTText style={getStyle(['pt-24', 'pb-12'])} h4 bold>
                My Availabilities
            </CTText>
            <ScrollView style={styles.avtsContainerStyle}>
                {(user?.availability || []).map((x, index) => (
                    <AvtItem avt={x} key={index} index={index} />
                ))}
            </ScrollView>
        </View>
    );
};

export default Availability;
