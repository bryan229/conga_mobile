import React, { ReactNode, useMemo } from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import { useAppNavigation } from '@services/hooks/useNavigation';
import createStyles from './style';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';

type HeaderPropsType = {
    style?: ViewStyle;
    title?: string;
    titleComponent?: ReactNode;
    goBack?: () => void;
    children?: ReactNode;
};

const BackHeader: React.FC<HeaderPropsType> = ({ title, titleComponent, goBack, children, style }) => {
    const navigation = useAppNavigation();
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const { colors } = theme;

    const goBackPress = () => {
        if (goBack) goBack();
        else navigation.pop();
    };

    return (
        <View style={[styles.container, style]}>
            <View style={styles.titleContainerStyle}>
                <TouchableOpacity onPress={goBackPress}>
                    <Icon
                        name="arrow-back"
                        type={IconType.Ionicons}
                        size={30}
                        color={colors.text}
                        style={styles.backIconStyle}
                    />
                </TouchableOpacity>
                {titleComponent ? (
                    titleComponent
                ) : (
                    <CTText h1 color={colors.text} fontFamily={fonts.montserrat.bold} style={styles.titleStyle}>
                        {title}
                    </CTText>
                )}
            </View>
            {children}
        </View>
    );
};

export default BackHeader;
