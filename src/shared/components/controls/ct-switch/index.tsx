import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Switch } from 'react-native-switch';
import { Controller, FormState, Control } from 'react-hook-form';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import CTText from '@shared/components/controls/ct-text';
import { CPStyleProp } from '@services/types';
import { getStyle } from '@shared/theme/themes';

interface CTSwitchProps {
    style?: CPStyleProp;
    name?: string;
    label?: string;
    defaultValue?: boolean;
    value?: boolean;
    onChange?: (value: boolean) => void;
    disabled?: boolean;
    required?: boolean;
    rightLabel?: boolean;
    validation?: {
        control: Control<any>;
        formState: FormState<any>;
        rules: any;
    };
}

const CTSwitch: React.FC<CTSwitchProps> = ({
    style,
    validation,
    name,
    label,
    rightLabel = true,
    onChange,
    value,
    required,
    disabled = false,
}) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const { colors } = theme;
    const { control, rules } = validation || {};

    return (
        <View style={style}>
            {name && validation ? (
                <Controller
                    control={control}
                    rules={rules}
                    render={({ field }) => (
                        <View style={styles.containerStyle}>
                            {label && !rightLabel && (
                                <CTText style={[styles.labelTextStyle, getStyle('mr-4')]}>
                                    {label}
                                    {required && (
                                        <CTText color={colors.danger} style={styles.labelRequireStyle}>
                                            &nbsp;*
                                        </CTText>
                                    )}
                                </CTText>
                            )}
                            <Switch
                                onValueChange={(v) => {
                                    if (disabled) return;
                                    field.onChange(v);
                                }}
                                value={field.value}
                                disabled={disabled}
                                circleSize={25}
                                barHeight={27}
                                circleBorderWidth={0}
                                backgroundActive={colors.borderColor}
                                backgroundInactive={colors.borderColor}
                                circleActiveColor={disabled ? colors.white : colors.primary}
                                circleInActiveColor={colors.white}
                                changeValueImmediately={true}
                                renderActiveText={false}
                                renderInActiveText={false}
                                switchWidthMultiplier={2}
                                switchBorderRadius={25}
                            />
                            {label && rightLabel && (
                                <CTText style={styles.labelTextStyle}>
                                    {label}
                                    {required && (
                                        <CTText color={colors.danger} style={styles.labelRequireStyle}>
                                            &nbsp;*
                                        </CTText>
                                    )}
                                </CTText>
                            )}
                        </View>
                    )}
                    name={name}
                />
            ) : (
                <View style={styles.containerStyle}>
                    {label && !rightLabel && (
                        <CTText style={[styles.labelTextStyle, getStyle('mr-4')]}>
                            {label}
                            {required && (
                                <CTText color={colors.danger} style={styles.labelRequireStyle}>
                                    &nbsp;*
                                </CTText>
                            )}
                        </CTText>
                    )}
                    <Switch
                        value={value}
                        onValueChange={(v) => {
                            if (disabled || !onChange) return;
                            onChange(v);
                        }}
                        disabled={disabled}
                        circleSize={25}
                        barHeight={27}
                        circleBorderWidth={0}
                        backgroundActive={colors.borderColor}
                        backgroundInactive={colors.borderColor}
                        circleActiveColor={disabled ? colors.disablePrimary : colors.primary}
                        circleInActiveColor={disabled ? colors.highlight : colors.white}
                        changeValueImmediately={true}
                        renderActiveText={false}
                        renderInActiveText={false}
                        switchWidthMultiplier={2}
                        switchBorderRadius={25}
                    />
                    {label && rightLabel && (
                        <CTText style={styles.labelTextStyle} color={disabled ? colors.darkGray : colors.text}>
                            {label}
                            {required && (
                                <CTText color={colors.danger} style={styles.labelRequireStyle}>
                                    &nbsp;*
                                </CTText>
                            )}
                        </CTText>
                    )}
                </View>
            )}
        </View>
    );
};

export default CTSwitch;
