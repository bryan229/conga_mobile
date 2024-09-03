import React, { useEffect, useMemo, useState } from 'react';
import { View, TextInput, KeyboardTypeOptions } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import CTText from '@shared/components/controls/ct-text';
import { CPStyleProp } from '@services/types';
import { useDebouncedCallback } from 'use-debounce';

interface CTDebounceTextInputProps {
    style?: CPStyleProp;
    name?: string;
    label?: string;
    editable?: boolean;
    placeholder?: string;
    keyboardType?: KeyboardTypeOptions;
    initValue?: string;
    onChange?: (value: string) => void;
}

const CTDebounceTextInput: React.FC<CTDebounceTextInputProps> = ({
    style,
    label,
    editable = true,
    placeholder,
    keyboardType,
    initValue = '',
    onChange,
}) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [hasFocus, setHasFocus] = useState(false);
    const [value, setValue] = useState('');
    const { colors } = theme;

    useEffect(() => {
        setValue(initValue);
    }, [initValue]);

    const debounced = useDebouncedCallback((v) => {
        if (!v || v.length > 1) if (onChange) onChange(v);
    }, 500);

    return (
        <View style={style}>
            {label && <CTText style={styles.labelTextStyle}>{label}</CTText>}
            <TextInput
                style={[
                    styles.textInputStyle,
                    {
                        backgroundColor: editable ? colors.dynamicWhite : colors.disableBackground,
                        borderColor: hasFocus ? colors.primary : colors.ctrlBorderColor,
                    },
                ]}
                placeholder={placeholder}
                onBlur={() => setHasFocus(false)}
                onFocus={() => setHasFocus(true)}
                onChangeText={(v) => {
                    setValue(v);
                    debounced(String(v));
                }}
                value={String(value ?? '')}
                keyboardType={keyboardType || 'default'}
                editable={editable}
                selectionColor={'green'}
            />
        </View>
    );
};

export default CTDebounceTextInput;
