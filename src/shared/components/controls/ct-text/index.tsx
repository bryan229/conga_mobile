import React from 'react';
import RNText, { IRNTextProps } from '@freakycoder/react-native-custom-text';
import fonts from '@shared/theme/fonts';
import { normalizeText } from '@freakycoder/react-native-helpers';

export interface CTTextrProps extends IRNTextProps {
    color?: string;
    fontFamily?: string;
    size?: number;
    children?: React.ReactNode;
}

const CTText: React.FC<CTTextrProps> = ({
    fontFamily = fonts.montserrat.regular,
    color = '#757575',
    size,
    children,
    style,
    ...rest
}) => {
    return (
        <RNText
            fontFamily={fontFamily}
            color={color}
            style={[style, size ? { fontSize: normalizeText(size) } : {}]}
            {...rest}
        >
            {children}
        </RNText>
    );
};

export default CTText;
