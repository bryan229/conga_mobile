import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Controller, FormState, Control } from 'react-hook-form';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import CTText from '@shared/components/controls/ct-text';
import { CPStyleProp } from '@services/types';
import moment from 'moment';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';

interface CTDatePickerProps {
    style?: CPStyleProp;
    name?: string;
    label?: string;
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    dateFormat?: string;
    mode?: 'date' | 'time' | 'datetime';
    onChange?: (date: Date) => void;
    required?: boolean;
    validation?: {
        control: Control<any>;
        formState: FormState<any>;
        rules: any;
    };
}

interface DatePickerProps extends Omit<CTDatePickerProps, 'name' | 'required' | 'validation' | 'label'> {
    onBlur?: () => void;
    onFocus?: () => void;
}

const CTDatePicker: React.FC<CTDatePickerProps> = ({
    style,
    validation,
    name,
    label,
    mode = 'date',
    placeholder,
    onChange,
    value,
    dateFormat = 'DD MMMM, YYYY',
    required,
    disabled = false,
}) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [hasFocus, setHasFocus] = useState(false);
    const { colors } = theme;

    const { control, formState, rules } = validation || {};

    useEffect(() => {
        if (selectRef.current && !formState?.isValidating) {
            const errorKeys = Object.keys(formState?.errors || []);
            if (errorKeys.length > 0 && errorKeys[0] === name) {
                setHasFocus(true);
                // return selectRef.current.focus();
            }
        }
    }, [formState?.submitCount]);

    const selectRef = useRef<TouchableOpacity>(null);

    return (
        <View style={style}>
            {label && (
                <CTText style={styles.labelTextStyle}>
                    {label}
                    {required && (
                        <CTText color={colors.danger} style={styles.labelRequireStyle}>
                            &nbsp;*
                        </CTText>
                    )}
                </CTText>
            )}
            {name && validation ? (
                <Controller
                    control={control}
                    rules={rules}
                    render={({ field }) => (
                        <DatePicker
                            style={{
                                borderColor: hasFocus
                                    ? formState?.errors[name || '']
                                        ? colors.danger
                                        : colors.primary
                                    : colors.ctrlBorderColor,
                                backgroundColor: disabled ? colors.disableBackground : colors.dynamicWhite,
                            }}
                            onChange={field.onChange}
                            onFocus={() => setHasFocus(true)}
                            onBlur={() => setHasFocus(false)}
                            value={field.value}
                            placeholder={placeholder}
                            mode={mode}
                            disabled={disabled}
                            dateFormat={dateFormat}
                            ref={selectRef}
                        />
                    )}
                    name={name}
                />
            ) : (
                <DatePicker
                    style={{
                        borderColor: hasFocus
                            ? formState?.errors[name || '']
                                ? colors.danger
                                : colors.primary
                            : colors.ctrlBorderColor,
                        backgroundColor: disabled ? colors.disableBackground : colors.dynamicWhite,
                    }}
                    onChange={onChange}
                    dateFormat={dateFormat}
                    value={value}
                    placeholder={placeholder}
                    disabled={disabled}
                    mode={mode}
                    ref={selectRef}
                />
            )}
        </View>
    );
};

export default CTDatePicker;

const DatePicker = forwardRef<TouchableOpacity, DatePickerProps>(
    ({ style, onChange, onBlur, onFocus, value, placeholder, disabled, dateFormat, mode }, ref) => {
        const theme = useTheme();
        const { colors } = theme;
        const styles = useMemo(() => createStyles(theme), [theme]);
        const [isVisibleDatePicker, setIsVisibleDatePicker] = useState(false);

        const onSelect = (date: Date) => {
            setIsVisibleDatePicker(false);
            if (onBlur) onBlur();
            if (onChange) onChange(date);
        };

        return (
            <TouchableOpacity
                ref={ref}
                style={[styles.selectContainerStyle, style]}
                activeOpacity={0.7}
                onPress={() => {
                    if (disabled) return;
                    if (onFocus) onFocus();
                    setIsVisibleDatePicker(true);
                }}
            >
                <CTText color={value ? colors.text : colors.placeholder}>
                    {value ? moment(value).format(dateFormat) : placeholder || 'Please Select...'}
                </CTText>
                <Icon name="calendar-clear" type={IconType.Ionicons} size={18} color={colors.highlight} />
                <DateTimePickerModal
                    isVisible={isVisibleDatePicker}
                    onConfirm={onSelect}
                    display="spinner"
                    mode={mode}
                    date={value ? moment(value).toDate() : new Date()}
                    onCancel={() => setIsVisibleDatePicker(false)}
                    buttonTextColorIOS={colors.iconPrimary}
                />
            </TouchableOpacity>
        );
    }
);
