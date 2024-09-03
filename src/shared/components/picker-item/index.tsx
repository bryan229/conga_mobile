import { CPStyleProp } from '@services/types';
import React, { ReactNode, useMemo } from 'react';
import { useTheme } from '@services/hooks/useTheme';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import createStyles from './style';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';

interface CPPickerItemProps {
    style?: CPStyleProp;
    children: ReactNode;
    onPress?: () => void;
    index?: number;
    selected?: boolean;
}
const CPPickerItem: React.FC<CPPickerItemProps> = ({ children, index = 1, onPress, selected = false }) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), []);
    const { colors } = theme;
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.5}>
            <View style={[styles.container, index % 2 === 0 ? { backgroundColor: colors.separator } : {}]}>
                {children}
                {selected && (
                    <Icon
                        name="checkmark"
                        type={IconType.Ionicons}
                        color={colors.iconPrimary}
                        size={20}
                        style={styles.iconStyle}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
};

export default CPPickerItem;
