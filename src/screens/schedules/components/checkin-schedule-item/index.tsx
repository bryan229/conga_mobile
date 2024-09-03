import { useTheme } from '@services/hooks/useTheme';
import { Schedule } from '@services/models';
import CTText from '@shared/components/controls/ct-text';
import createStyles from './style';
import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import fonts from '@shared/theme/fonts';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import moment from 'moment';
import { getStyle } from '@shared/theme/themes';
import { convertTimeString } from '@utils';
import { useAppSelector } from '@store/hook';
import { LEVEL_TYPE, LevelTypes, SCHEDULE_STATUS } from '@shared/constants';
import { getActiveRealVenues } from '@services/helpers/club';

interface Props {
    schedule: Schedule;
    onPress: () => void;
}

const CheckInScheduleItem = ({ schedule, onPress }: Props) => {
    const club = useAppSelector((state) => state.club.club!);
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const venueSetting = getActiveRealVenues(club).find((x) => x._id === schedule.venue._id)?.setting;

    const getOwnerName = () => {
        let ownerName = schedule.owner.fullName;
        if (
            venueSetting?.ruleSettings.isReqOtherPyName &&
            venueSetting?.ruleSettings.isShowOtherPyLevel &&
            schedule.owner.gameLevel
        )
            ownerName += ` (${LevelTypes[schedule.owner.levelType || LEVEL_TYPE.USTA]} ${schedule.owner.gameLevel})`;
        return ownerName;
    };

    const StatusBadge = () => {
        if (schedule.status === SCHEDULE_STATUS.CONFIRM) {
            if (venueSetting?.ruleSettings?.isRequireCheckIn) {
                if (schedule.isArrived)
                    return (
                        <Icon name="checkmark-done-circle" type={IconType.Ionicons} size={30} color={colors.primary} />
                    );
            }
            return <Icon name="checkmark-circle" type={IconType.Ionicons} size={30} color={colors.calpyse} />;
        }
        return null;
    };

    const OtherPlayerInfo = () => {
        if ((schedule.members || []).length === 0) return null;
        return (
            <View style={styles.otherPlayerContainer}>
                {(schedule.members || []).map((x) => (
                    <View style={styles.otherPlayerBadgeContainer} key={x.fullName}>
                        <Icon name="person-outline" size={16} type={IconType.Ionicons} color={colors.iconPrimary} />
                        <View style={getStyle(['ml-4'])}>
                            <CTText size={8} fontFamily={fonts.montserrat.bold} color={colors.text}>
                                {x.fullName}
                            </CTText>
                        </View>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.7} onPress={onPress}>
            <View style={getStyle(['row', 'align-items-center', 'justify-between'])}>
                <CTText h4 color={colors.text} fontFamily={fonts.montserrat.bold}>
                    {moment(schedule.date).format('dddd, MMM DD, YYYY')}
                </CTText>
                <StatusBadge />
            </View>
            <View style={styles.dateAndLocationInfoContainer}>
                <Icon name="location" size={18} type={IconType.Entypo} color={colors.iconPrimary} />
                <View style={getStyle(['ml-8', 'mr-16'])}>
                    <CTText size={10} fontFamily={fonts.montserrat.bold} color={colors.text}>
                        {schedule.venue.displayName}, {schedule.venue.courtDisplayName} {schedule.court + 1}
                    </CTText>
                </View>
                <Icon name="calendar-outline" size={18} type={IconType.Ionicons} color={colors.iconPrimary} />
                <View style={getStyle('ml-8')}>
                    <CTText size={10} fontFamily={fonts.montserrat.bold} color={colors.text}>
                        {convertTimeString(schedule.time, 'hh:mm A')}
                    </CTText>
                </View>
            </View>
            <View style={getStyle(['row', 'align-items-center', 'mt-8'])}>
                <Icon name="person-circle" size={20} type={IconType.Ionicons} color={colors.iconPrimary} />
                <View style={getStyle(['ml-8'])}>
                    <CTText size={10} fontFamily={fonts.montserrat.bold} color={colors.text}>
                        {getOwnerName()}
                    </CTText>
                </View>
            </View>
            <OtherPlayerInfo />
        </TouchableOpacity>
    );
};

export default CheckInScheduleItem;
