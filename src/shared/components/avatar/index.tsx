import React, { useMemo } from 'react';
import { useTheme } from '@services/hooks/useTheme';
import CTText from '@shared/components/controls/ct-text';
import { View } from 'react-native';
import { CPStyleProp } from '@services/types';
import createStyles from './style';
import fonts from '@shared/theme/fonts';
import FastImage, { ImageStyle } from 'react-native-fast-image';

interface CPAvatarProps {
    size?: number;
    name?: string;
    source?: string;
    style?: CPStyleProp & ImageStyle;
}

const CPAvatar: React.FC<CPAvatarProps> = ({ style, source, name, size = 30 }) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme, size), [theme]);
    const { colors } = theme;

    const DefaultLogo = () => {
        return (
            <View style={[styles.defaultPhotoContainer, style]}>
                <CTText color={colors.white} fontFamily={fonts.montserrat.bold} style={styles.defaultPhotoText}>
                    {(name || 'C')[0]}
                </CTText>
            </View>
        );
    };
    return (
        <>
            {source ? (
                <FastImage
                    style={[styles.photoImageStyle, style]}
                    source={{ uri: source }}
                    resizeMode={FastImage.resizeMode.cover}
                />
            ) : (
                <DefaultLogo />
            )}
        </>
    );
};

export default CPAvatar;
