import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Controller, FormState, Control } from 'react-hook-form';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import CTText from '@shared/components/controls/ct-text';
import { CPStyleProp } from '@services/types';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';

interface CTClickableTextInputProps {
    style?: CPStyleProp;
    name?: string;
    label?: string;
    value?: string;
    disabled?: boolean;
    clearable?: boolean;
    onPress?: () => void;
    onChange?: (value?: string) => void;
    required?: boolean;
    validation?: {
        control: Control<any>;
        formState: FormState<any>;
        rules: any;
    };
}

interface ClickableTextInputProps
    extends Omit<CTClickableTextInputProps, 'name' | 'required' | 'validation' | 'label'> {
    onBlur?: () => void;
    onFocus?: () => void;
}

const CTClickableTextInput: React.FC<CTClickableTextInputProps> = ({
    style,
    validation,
    name,
    label,
    onPress,
    onChange,
    value,
    clearable = true,
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

    const selectRef = useRef<View>(null);

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
                        <ClickableTextInput
                            style={{
                                borderColor: hasFocus
                                    ? formState?.errors[name || '']
                                        ? colors.danger
                                        : colors.primary
                                    : colors.ctrlBorderColor,
                                backgroundColor: disabled ? colors.disableBackground : colors.dynamicWhite,
                            }}
                            onChange={field.onChange}
                            onPress={onPress}
                            onFocus={() => setHasFocus(true)}
                            onBlur={() => setHasFocus(false)}
                            value={field.value}
                            clearable={clearable}
                            disabled={disabled}
                            ref={selectRef}
                        />
                    )}
                    name={name}
                />
            ) : (
                <ClickableTextInput
                    style={{
                        borderColor: hasFocus
                            ? formState?.errors[name || '']
                                ? colors.danger
                                : colors.primary
                            : colors.ctrlBorderColor,
                        backgroundColor: disabled ? colors.disableBackground : colors.dynamicWhite,
                    }}
                    onPress={onPress}
                    onChange={onChange}
                    value={value}
                    disabled={disabled}
                    clearable={clearable}
                    ref={selectRef}
                />
            )}
        </View>
    );
};

export default CTClickableTextInput;

const ClickableTextInput = forwardRef<View, ClickableTextInputProps>(
    ({ style, onPress, onFocus, onChange, value, disabled, clearable }, ref) => {
        const theme = useTheme();
        const { colors } = theme;
        const styles = useMemo(() => createStyles(theme), [theme]);

        useEffect(() => {
            onChange?.(value);
        }, [value]);

        return (
            <View ref={ref} style={[styles.selectContainerStyle, style]}>
                <TouchableOpacity
                    style={[styles.btnContainerStyle]}
                    activeOpacity={0.7}
                    onPress={() => {
                        if (disabled) return;
                        onFocus?.();
                        onPress?.();
                    }}
                >
                    <CTText color={value ? colors.text : colors.placeholder} numberOfLines={1} ellipsizeMode="tail">
                        {value || 'Please Select...'}
                    </CTText>
                </TouchableOpacity>
                <TouchableOpacity>
                    {clearable && value && (
                        <TouchableOpacity>
                            <Icon
                                name="close"
                                type={IconType.Ionicons}
                                size={24}
                                color={colors.highlight}
                                onPress={() => {
                                    if (disabled) return;
                                    onChange?.('');
                                }}
                            />
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>
            </View>
        );
    }
);
