import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, TextInput, KeyboardTypeOptions } from 'react-native';
import { Controller, FormState, Control } from 'react-hook-form';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import CTText from '@shared/components/controls/ct-text';
import { CPStyleProp } from '@services/types';
import { ScrollView } from 'react-native';

interface CTTextAreaProps {
    style?: CPStyleProp;
    name?: string;
    label?: string | React.ReactNode;
    placeholder?: string;
    keyboardType?: KeyboardTypeOptions;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    required?: boolean;
    maxHeight?: number;
    editable?: boolean;
    validation?: {
        control: Control<any>;
        formState: FormState<any>;
        rules: any;
    };
}

const CTTextArea: React.FC<CTTextAreaProps> = ({
    style,
    validation,
    name,
    label,
    placeholder,
    keyboardType,
    onChange,
    maxHeight,
    value,
    defaultValue,
    editable = true,
    required,
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
        <View style={[styles.containerStyle, style]}>
            {label && (
                <CTText style={styles.labelTextStyle}>
                    {label}
                    {required && typeof label === 'string' && (
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
                            ]}
                            placeholder={placeholder}
                            onBlur={() => setHasFocus(false)}
                            onFocus={() => setHasFocus(true)}
                            onChangeText={field.onChange}
                            value={field.value}
                            multiline={true}
                            numberOfLines={0}
                            editable={editable}
                            keyboardType={keyboardType || 'default'}
                            selectionColor={'green'}
                            ref={selectRef}
                        />
                    )}
                    name={name}
                />
            ) : (
                <ScrollView>
                    <TextInput
                        style={[
                            styles.textInputStyle,
                            maxHeight ? { maxHeight } : {},
                            { backgroundColor: editable ? colors.dynamicWhite : colors.disableBackground },
                        ]}
                        placeholder={placeholder}
                        onBlur={() => setHasFocus(false)}
                        onFocus={() => setHasFocus(true)}
                        onChangeText={onChange}
                        value={value}
                        defaultValue={defaultValue}
                        multiline={true}
                        numberOfLines={0}
                        keyboardType={keyboardType || 'default'}
                        selectionColor={'green'}
                        editable={editable}
                    />
                </ScrollView>
            )}
        </View>
    );
};

export default CTTextArea;
