import { useTheme } from '@services/hooks/useTheme';
import { Request } from '@services/models';
import CTText from '@shared/components/controls/ct-text';
import createStyles from './style';
import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useAppSelector } from '@store/hook';
import { getVenue } from '@services/helpers/club';
import fonts from '@shared/theme/fonts';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import moment from 'moment';
import { getStyle } from '@shared/theme/themes';

interface Props {
    request: Request;
    onPress: () => void;
}
const RequestItem = ({ request, onPress }: Props) => {
    const club = useAppSelector((state) => state.club.club);
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);

    const getTime = () => {
        if (request.isAnyTime) {
            const avtTime = club?.setting?.avtTimeSlots.find((x) => x.name === request.timeRange);
            return `${request.timeRange} (${avtTime?.stTime} ~ ${avtTime?.etTime})`;
        }
        return request.time;
    };

    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.7} onPress={onPress}>
            <CTText h4 color={colors.text} fontFamily={fonts.montserrat.bold}>
                {getVenue(club!, request.venue)?.displayName || ''}
            </CTText>
            <View style={styles.dateInfoContainer}>
                <Icon name="calendar-outline" size={18} type={IconType.Ionicons} color={colors.iconPrimary} />
                <View style={getStyle('ml-8')}>
                    <CTText size={10} fontFamily={fonts.montserrat.bold} color={colors.text}>
                        {moment(request.date).format('dddd, MMM DD, YYYY')} {!request.isAnyTime ? request.time : ''}
                    </CTText>
                    {request.isAnyTime && (
                        <CTText style={getStyle('mt-4')} bold size={9}>
                            {getTime()}
                        </CTText>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default RequestItem;
