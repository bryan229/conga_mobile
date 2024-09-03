import React, { ReactNode, forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Controller, FormState, Control } from 'react-hook-form';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import CTText from '@shared/components/controls/ct-text';
import { CPStyleProp, PickerOption } from '@services/types';
import { useAppDispatch } from '@store/hook';
import { showBottomSheetPicker } from '@store/actions/ui';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';

interface CTSelectProps {
    style?: CPStyleProp;
    name?: string;
    label?: string | ReactNode;
    options: PickerOption[];
    value?: string;
    disabled?: boolean;
    clearable?: boolean;
    placeholder?: string;
    onChange?: (value?: string) => void;
    required?: boolean;
    validation?: {
        control: Control<any>;
        formState: FormState<any>;
        rules: any;
    };
}

interface SelectProps extends Omit<CTSelectProps, 'name' | 'required' | 'validation' | 'label'> {
    onBlur?: () => void;
    onFocus?: () => void;
}

const CTSelect: React.FC<CTSelectProps> = ({
    style,
    validation,
    name,
    label,
    options,
    onChange,
    value,
    required,
    placeholder = 'Please Select...',
    disabled = false,
    clearable = false,
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
                    {typeof label === 'string' ? (
                        <>
                            {label}
                            {required && (
                                <CTText color={colors.danger} style={styles.labelRequireStyle}>
                                    &nbsp;*
                                </CTText>
                            )}
                        </>
                    ) : (
                        label
                    )}
                </CTText>
            )}
            {name && validation ? (
                <Controller
                    control={control}
                    rules={rules}
                    render={({ field }) => (
                        <Select
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
                            options={options}
                            value={field.value}
                            disabled={disabled}
                            clearable={clearable}
                            placeholder={placeholder}
                            ref={selectRef}
                        />
                    )}
                    name={name}
                />
            ) : (
                <Select
                    style={{
                        borderColor: hasFocus
                            ? formState?.errors[name || '']
                                ? colors.danger
                                : colors.primary
                            : colors.ctrlBorderColor,
                        backgroundColor: disabled ? colors.disableBackground : colors.dynamicWhite,
                    }}
                    onChange={onChange}
                    options={options}
                    value={value}
                    disabled={disabled}
                    clearable={clearable}
                    placeholder={placeholder}
                    ref={selectRef}
                />
            )}
        </View>
    );
};

export default CTSelect;

const Select = forwardRef<TouchableOpacity, SelectProps>(
    ({ style, options, onChange, onBlur, onFocus, value, disabled, clearable, placeholder }, ref) => {
        const theme = useTheme();
        const { colors } = theme;
        const dispatch = useAppDispatch();
        const styles = useMemo(() => createStyles(theme), [theme]);

        const onSelect = (selectedValue: string | string[] | null) => {
            if (onBlur) onBlur();
            if (onChange && selectedValue !== null) onChange(selectedValue as string);
        };

        return (
            <TouchableOpacity
                ref={ref}
                style={[styles.selectContainerStyle, style]}
                activeOpacity={0.7}
                onPress={() => {
                    if (disabled) return;
                    if (onFocus) onFocus();
                    dispatch(
                        showBottomSheetPicker({
                            options,
                            value,
                            onSelect,
                        })
                    );
                }}
            >
                <CTText color={value ? colors.text : colors.placeholder} style={{ flexShrink: 1 }}>
                    {value ? options.find((op) => op.value === value)?.label : placeholder}
                </CTText>
                {clearable && value !== '' && value !== undefined && value !== null && (
                    <TouchableOpacity>
                        <Icon
                            name="close"
                            type={IconType.Ionicons}
                            size={24}
                            color={colors.highlight}
                            onPress={() => {
                                onSelect('');
                            }}
                        />
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        );
    }
);
