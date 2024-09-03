import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import createStyles from './style';
import { SubClub } from '@services/models';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import { getStyle } from '@shared/theme/themes';
import { hasValue, kmToMile } from '@utils';

interface Props {
    organization: SubClub;
    onPress: () => void;
}

const OrganizationItem = ({ organization, onPress }: Props) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.7} onPress={onPress}>
            <View style={getStyle(['row', 'align-items-center', 'mb-4'])}>
                <Icon name="business-outline" size={18} type={IconType.Ionicons} color={colors.iconPrimary} />
                <CTText
                    style={getStyle('ml-8')}
                    fontFamily={fonts.montserrat.regular}
                    color={colors.text}
                    bold
                    size={12}
                >
                    {organization?.name}
                </CTText>
            </View>
            <View style={getStyle(['row', 'align-items-center', 'mb-4'])}>
                <Icon name="location-outline" size={18} type={IconType.Ionicons} color={colors.iconPrimary} />
                <CTText style={getStyle('ml-8')} size={10} fontFamily={fonts.montserrat.bold} color={colors.text}>
                    {organization.address}
                </CTText>
            </View>
            {hasValue(organization.distance) && (
                <View style={getStyle(['row', 'align-items-center'])}>
                    <Icon name="car-outline" size={18} type={IconType.Ionicons} color={colors.iconPrimary} />
                    <CTText style={getStyle('ml-8')} size={10} fontFamily={fonts.montserrat.bold} color={colors.text}>
                        {Math.round(kmToMile(organization.distance! / 1000) * 100) / 100} mile
                    </CTText>
                </View>
            )}
        </TouchableOpacity>
    );
};

export default OrganizationItem;
