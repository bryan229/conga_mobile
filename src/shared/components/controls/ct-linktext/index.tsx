import React from 'react';
import { useTheme } from '@services/hooks/useTheme';
import { TouchableOpacity } from 'react-native';
import CTText, { CTTextrProps } from '@shared/components/controls/ct-text';

interface CTLinkTextProps extends CTTextrProps {
    onPress: () => void;
}

const CTLinkText: React.FC<CTLinkTextProps> = ({ color, onPress, children, ...rest }) => {
    const theme = useTheme();
    const { colors } = theme;
    return (
        <TouchableOpacity onPress={onPress}>
            <CTText color={color || colors.primary} {...rest}>
                {children}
            </CTText>
        </TouchableOpacity>
    );
};

export default CTLinkText;
