import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { View, TextInput, KeyboardTypeOptions } from 'react-native';
import { Controller, FormState, Control } from 'react-hook-form';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import CTText from '@shared/components/controls/ct-text';
import { CPStyleProp } from '@services/types';

type CTTextInputProps = {
    style?: CPStyleProp;
    inputStyle?: CPStyleProp;
    name?: string;
    label?: string | ReactNode;
    placeholder?: string;
    keyboardType?: KeyboardTypeOptions;
    defaultValue?: string | number;
    value?: string | number;
    onChange?: (value: string) => void;
    required?: boolean;
    editable?: boolean;
    readOnly?: boolean;
    validation?: {
        control: Control<any>;
        formState: FormState<any>;
        rules: any;
    };
};

const CTTextInput: React.FC<CTTextInputProps> = ({
    style,
    inputStyle,
    validation,
    name,
    label,
    placeholder,
    keyboardType,
    onChange,
    value,
    defaultValue,
    required,
    editable = true,
    readOnly = false,
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
                return selectRef.current.focus();
            }
        }
    }, [formState?.submitCount]);

    const selectRef = useRef<TextInput>(null);

    return (
        <View style={style}>
            {label && typeof label === 'string' ? (
                <CTText style={styles.labelTextStyle}>
                    {label}
                    {required && (
                        <CTText color={colors.danger} style={styles.labelRequireStyle}>
                            &nbsp;*
                        </CTText>
                    )}
                </CTText>
            ) : (
                <>{label}</>
            )}
            {name && validation ? (
                <Controller
                    control={control}
                    rules={rules}
                    render={({ field }) => (
                        <TextInput
                            style={[
                                styles.textInputStyle,
                                {
                                    borderColor: hasFocus
                                        ? formState?.errors[name]
                                            ? colors.danger
                                            : colors.primary
                                        : colors.ctrlBorderColor,
                                    backgroundColor: editable ? colors.dynamicWhite : colors.disableBackground,
                                },
                                inputStyle,
                            ]}
                            placeholder={placeholder}
                            onBlur={() => setHasFocus(false)}
                            onFocus={() => setHasFocus(true)}
                            onChangeText={field.onChange}
                            editable={editable && !readOnly}
                            value={String(field.value ?? '')}
                            keyboardType={keyboardType || 'default'}
                            selectionColor={'green'}
                            ref={selectRef}
                        />
                    )}
                    name={name}
                />
            ) : (
                <TextInput
                    style={[
                        styles.textInputStyle,
                        { backgroundColor: editable ? colors.dynamicWhite : colors.disableBackground },
                        inputStyle,
                    ]}
                    placeholder={placeholder}
                    onBlur={() => setHasFocus(false)}
                    onFocus={() => setHasFocus(true)}
                    onChangeText={onChange}
                    defaultValue={String(defaultValue ?? '')}
                    value={String(value ?? '')}
                    keyboardType={keyboardType || 'default'}
                    selectionColor={'green'}
                    editable={editable && !readOnly}
                />
            )}
        </View>
    );
};

export default CTTextInput;
