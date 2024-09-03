import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import moment from 'moment-timezone';
import createStyles from './style';
import { FacilityResource } from '@services/models';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import { getStyle } from '@shared/theme/themes';
import { hasValue } from '@utils';

interface Props {
    resource: FacilityResource;
    onPress: () => void;
}

const ResourceItem = ({ resource, onPress }: Props) => {
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
                    {resource.subClub?.name}
                </CTText>
            </View>
            <View style={getStyle(['row', 'align-items-center', 'mb-4'])}>
                <Icon name="grid-outline" size={18} type={IconType.Ionicons} color={colors.iconPrimary} />
                <CTText style={getStyle('ml-8')} fontFamily={fonts.montserrat.regular} color={colors.text}>
                    {resource.name}
                </CTText>
            </View>
            <View style={getStyle(['row', 'align-items-center'])}>
                <Icon name="calendar-outline" size={18} type={IconType.Ionicons} color={colors.iconPrimary} />
                <View style={getStyle('ml-8')}>
                    <CTText size={10} fontFamily={fonts.montserrat.bold} color={colors.text}>
                        {moment(resource.start).format('MMM DD, YYYY h:mm A')} ~ {moment(resource.end).format('h:mm A')}{' '}
                    </CTText>
                    {resource.repeatedWeeks > 1 && (
                        <CTText size={10} fontFamily={fonts.montserrat.bold} color={colors.text}>
                            (Every week for {resource.repeatedWeeks} weeks)
                        </CTText>
                    )}
                </View>
            </View>
            <View style={getStyle(['row', 'align-items-center', 'mt-4'])}>
                <Icon name="location-outline" size={18} type={IconType.Ionicons} color={colors.iconPrimary} />
                <CTText
                    style={getStyle('ml-8')}
                    size={10}
                    fontFamily={fonts.montserrat.bold}
                    color={colors.text}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {resource.address}
                </CTText>
            </View>
            <View style={getStyle(['row', 'align-items-center', 'mt-4'])}>
                <Icon name="mail-outline" size={18} type={IconType.Ionicons} color={colors.iconPrimary} />
                <CTText style={getStyle('ml-8')} size={10} fontFamily={fonts.montserrat.bold} color={colors.text}>
                    {resource.contactEmail}
                </CTText>
            </View>
            <View style={getStyle(['row', 'align-items-center', 'mt-4'])}>
                <View style={getStyle(['row', 'align-items-center', 'mr-16'])}>
                    <Icon name="call-outline" size={18} type={IconType.Ionicons} color={colors.iconPrimary} />
                    <CTText style={getStyle('ml-8')} size={10} fontFamily={fonts.montserrat.bold} color={colors.text}>
                        {resource.contactPhoneNumber}
                    </CTText>
                </View>
                {(resource.minCapacity || resource.maxCapacity) && (
                    <View style={getStyle(['row', 'align-items-center', 'mr-16'])}>
                        <Icon name="people-outline" size={18} type={IconType.Ionicons} color={colors.iconPrimary} />
                        <CTText
                            style={getStyle('ml-8')}
                            size={10}
                            fontFamily={fonts.montserrat.bold}
                            color={colors.text}
                        >
                            {[resource.minCapacity, resource.maxCapacity].filter((x) => hasValue(x)).join(' ~ ')}
                        </CTText>
                    </View>
                )}
            </View>
            {(resource.price || resource.distance) && (
                <View style={getStyle(['row', 'align-items-center', 'mt-4'])}>
                    {resource.distance && (
                        <View style={getStyle(['row', 'align-items-center', 'mr-16'])}>
                            <Icon name="car-outline" size={18} type={IconType.Ionicons} color={colors.iconPrimary} />
                            <CTText
                                style={getStyle('ml-8')}
                                size={10}
                                fontFamily={fonts.montserrat.bold}
                                color={colors.text}
                            >
                                {Math.floor(resource.distance / 1000)} km
                            </CTText>
                        </View>
                    )}
                    {resource.price && (
                        <View style={getStyle(['row', 'align-items-center'])}>
                            <Icon name="cash-outline" size={18} type={IconType.Ionicons} color={colors.iconPrimary} />
                            <CTText
                                style={getStyle('ml-8')}
                                size={10}
                                fontFamily={fonts.montserrat.bold}
                                color={colors.text}
                            >
                                ${' '}
                                <CTText color={colors.text} bold>
                                    {resource.price}
                                </CTText>{' '}
                                / hr
                            </CTText>
                        </View>
                    )}
                </View>
            )}

            {resource.note && (
                <CTText
                    style={getStyle('my-8')}
                    size={10}
                    fontFamily={fonts.montserrat.regular}
                    color={colors.text}
                    ellipsizeMode="tail"
                >
                    Note: {resource.note}
                </CTText>
            )}
        </TouchableOpacity>
    );
};

export default ResourceItem;
