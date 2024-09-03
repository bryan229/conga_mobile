import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import CTText from '@shared/components/controls/ct-text';
import { CPStyleProp, PickerOption } from '@services/types';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';

interface CTOptionProps {
    style?: CPStyleProp;
    label?: string;
    options: PickerOption[];
    value: string;
    onChange: (value: string) => void;
}

const CTOption: React.FC<CTOptionProps> = ({ style, label, options = [], value = '', onChange }) => {
    const theme = useTheme();
    const { colors, getStyle } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <View style={style}>
            {label && <CTText style={styles.labelTextStyle}>{label}</CTText>}
            <View style={styles.optionContainerStyle}>
                {options.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.optionButtonContainerStyle, index === 0 ? getStyle('mr-8') : {}]}
                        onPress={() => onChange(option.value)}
                    >
                        <Icon
                            name={option.value === value ? 'checkmark-circle' : 'checkmark-circle-outline'}
                            color={option.value === value ? colors.primary : colors.text}
                            type={IconType.Ionicons}
                            size={20}
                        />
                        <CTText style={styles.optionTextStyle}>{option.label}</CTText>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default CTOption;
