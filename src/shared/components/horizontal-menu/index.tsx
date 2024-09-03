import React, { ReactNode, useMemo } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import CTText from '@shared/components/controls/ct-text';
import { CPStyleProp } from '@services/types';
import fonts from '@shared/theme/fonts';

interface CPHorizontalMenuProps {
    style?: CPStyleProp;
    menuLabels?: string[];
    menuOptions?: { key: string; label: ReactNode }[];
    activeLabels?: string[];
    onSelect: (item: string) => void;
}

const CPHorizontalMenu: React.FC<CPHorizontalMenuProps> = ({
    style,
    menuOptions = [],
    menuLabels = [],
    activeLabels = [],
    onSelect,
}) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <View style={styles.container}>
            <ScrollView horizontal>
                <View style={[styles.menuContainer, style]}>
                    {menuLabels.length > 0 && (
                        <>
                            {menuLabels.map((label, index) => (
                                <TouchableOpacity onPress={() => onSelect(label)} key={index}>
                                    <CTText
                                        style={[styles.textStyle]}
                                        color={activeLabels.includes(label) ? colors.iconPrimary : colors.text}
                                        fontFamily={
                                            activeLabels.includes(label)
                                                ? fonts.montserrat.bold
                                                : fonts.montserrat.regular
                                        }
                                    >
                                        {label}
                                    </CTText>
                                </TouchableOpacity>
                            ))}
                        </>
                    )}
                    {menuOptions.length > 0 && (
                        <>
                            {menuOptions.map((option, index) => (
                                <TouchableOpacity onPress={() => onSelect(option.key)} key={index}>
                                    {option.label}
                                </TouchableOpacity>
                            ))}
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default CPHorizontalMenu;
