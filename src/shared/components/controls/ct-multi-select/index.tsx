import React, { ReactNode, forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Controller, FormState, Control } from 'react-hook-form';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import CTText from '@shared/components/controls/ct-text';
import { CPStyleProp, PickerOption } from '@services/types';
import { useAppDispatch } from '@store/hook';
import { showBottomSheetPicker } from '@store/actions/ui';

interface CTMultiSelectProps {
    style?: CPStyleProp;
    name?: string;
    label?: string | ReactNode;
    options: PickerOption[];
    values?: string[];
    disabled?: boolean;
    onChange?: (values: string[]) => void;
    required?: boolean;
    validation?: {
        control: Control<any>;
        formState: FormState<any>;
        rules: any;
    };
}

interface MultiSelectProps extends Omit<CTMultiSelectProps, 'name' | 'required' | 'validation' | 'label'> {
    onBlur?: () => void;
    onFocus?: () => void;
}

const CTMultiSelect: React.FC<CTMultiSelectProps> = ({
    style,
    validation,
    name,
    label,
    options,
    onChange,
    values = [],
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
                        <MultiSelect
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
                            values={field.value}
                            disabled={disabled}
                            ref={selectRef}
                        />
                    )}
                    name={name}
                />
            ) : (
                <MultiSelect
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
                    values={values}
                    disabled={disabled}
                    ref={selectRef}
                />
            )}
        </View>
    );
};

export default CTMultiSelect;

const MultiSelect = forwardRef<TouchableOpacity, MultiSelectProps>(
    ({ style, options, onChange, onBlur, onFocus, values = [], disabled }, ref) => {
        const theme = useTheme();
        const { colors } = theme;
        const dispatch = useAppDispatch();
        const styles = useMemo(() => createStyles(theme), [theme]);

        const onSelect = (selectedValue: string | string[] | null) => {
            if (onBlur) onBlur();
            if (onChange && selectedValue !== null) onChange(selectedValue as string[]);
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
                            isMulti: true,
                            values,
                            onSelect,
                        })
                    );
                }}
            >
                {(values ?? []).length === 0 ? (
                    <CTText style={styles.placeholderTextStyle} color={colors.placeholder}>
                        Please Select...
                    </CTText>
                ) : (
                    <>
                        {values
                            .map((x) => options.find((v) => v.value === x)?.label)
                            .filter((x) => x)
                            .map((value, index) => (
                                <View style={styles.multiValueStyle} key={index}>
                                    <CTText color={colors.text}>{value}</CTText>
                                </View>
                            ))}
                    </>
                )}
            </TouchableOpacity>
        );
    }
);
