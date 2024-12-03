import { useTheme } from '@services/hooks/useTheme';
import { OtherPlayer, Schedule, User } from '@services/models';
import CTText from '@shared/components/controls/ct-text';
import createStyles from './style';
import React, { useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import fonts from '@shared/theme/fonts';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import moment from 'moment';
import { getStyle } from '@shared/theme/themes';
import { convertTimeString } from '@utils';
import { isNoShow, isOwnerSchedule } from '@services/helpers/schedule';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { LEVEL_TYPE, LevelTypes, SCHEDULE_STATUS } from '@shared/constants';
import { getActiveRealVenues } from '@services/helpers/club';
import ReactNativeModal from 'react-native-modal';
import CTSwitch from '@shared/components/controls/ct-switch';
import SearchMemberContent from '@shared/components/search-member-content';
import CTButton from '@shared/components/controls/ct-button';
import { handleError } from '@store/actions';
import { ScheduleApi } from '@services/api';
import SendCircleMsgModal from '../send-circle-message-modal';

interface Props {
    schedule: Schedule;
    toggle: () => void;
    callback: () => void;
}

const ScheduleDetails = ({ schedule, callback, toggle }: Props) => {
    const user = useAppSelector((state) => state.auth.user!);
    const club = useAppSelector((state) => state.club.club!);
    const dispatch = useAppDispatch();
    const venue = getActiveRealVenues(club).find((x) => x._id === schedule.venue._id);
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [isOpenSearchMemberModal, setIsOpenSearchMemberModal] = useState<boolean>(false);
    const reqPlayerCount = venue?.setting?.ruleSettings?.playerCount || 0;
    const maxOtherPlayerCount = venue?.setting?.ruleSettings?.maxShareMemNumPerTimeSlot ?? 4;
    const [isSharing, setIsSharing] = useState<boolean>(() => {
        if (reqPlayerCount <= 0) return schedule.isSharing || false;
        if (schedule.status === SCHEDULE_STATUS.PENDING || (schedule.members.length || 0) < reqPlayerCount) return true;
        return schedule.isSharing || false;
    });
    const [otherPlayers, setOtherPlayers] = useState<OtherPlayer[]>(schedule.members || []);
    const [loading, setLoading] = useState<boolean>(false);
    const [cancelLoading, setCancelLoading] = useState<boolean>(false);
    const [isOpenCircleMsg, setIsOpenCircleMsg] = useState<boolean>(false);
    const [hasSentCircleMsg, setHasSentCircleMsg] = useState<boolean>(false);

    if (!venue) return null;

    const StatusBadge = () => {
        if (!isOwnerSchedule(schedule, user)) return null;
        if (schedule.status === SCHEDULE_STATUS.PENDING)
            return <Icon name="time-slot" type={IconType.Entypo} size={25} color={colors.secondary} />;
        if (schedule.status === SCHEDULE_STATUS.CONFIRM) {
            if (venue.setting?.ruleSettings?.isRequireCheckIn) {
                if (schedule.isArrived)
                    return (
                        <Icon name="checkmark-done-circle" type={IconType.Ionicons} size={30} color={colors.primary} />
                    );
                if (isNoShow(schedule, club))
                    return <Icon name="remove-user" type={IconType.Entypo} size={25} color={colors.danger} />;
            }
            return <Icon name="checkmark-circle" type={IconType.Ionicons} size={30} color={colors.calpyse} />;
        }
        return null;
    };

    const updateSchedule = async () => {
        setLoading(true);
        try {
            let params: any = {
                _id: schedule._id,
                status: SCHEDULE_STATUS.CONFIRM,
                members: otherPlayers,
                isSharing,
            };
            await ScheduleApi.update(params);
            toggle();
            callback();
        } catch (error) {
            dispatch(handleError(error));
        }
        setLoading(false);
    };

    const cancelSchedule = async () => {
        setCancelLoading(true);
        try {
            let params: any = {
                _id: schedule._id,
                status: SCHEDULE_STATUS.CANCELED,
            };
            await ScheduleApi.update(params);
            toggle();
            callback();
        } catch (error) {
            dispatch(handleError(error));
        }
        setCancelLoading(false);
    };

    const OtherPalyerItem = ({ player }: { player: OtherPlayer }) => {
        return (
            <View style={styles.otherPlayerItemContainer}>
                <CTText size={10} color={colors.text}>
                    {player.fullName} {player.isShareUser ? '(Shared)' : '(Invited)'}
                    {venue.setting.ruleSettings.isShowOtherPyLevel &&
                        player.gameLevel &&
                        player.levelType &&
                        ` ${LevelTypes[player.levelType || LEVEL_TYPE.USTA]} ${player.gameLevel}`}
                </CTText>
                <TouchableOpacity
                    onPress={() => {
                        const newPlayers = [...otherPlayers].filter((x) => x.fullName !== player.fullName);
                        setOtherPlayers(newPlayers);
                    }}
                >
                    <Icon name="close" type={IconType.Ionicons} size={25} color={colors.danger} />
                </TouchableOpacity>
            </View>
        );
    };

    const toggleSearchOtherPy = () => {
        setIsOpenSearchMemberModal(!isOpenSearchMemberModal);
    };

    const canShowCircleMsgButton = () => {
        return (
            isOwnerSchedule(schedule, user) &&
            !schedule.circleMessage &&
            !hasSentCircleMsg &&
            otherPlayers.length < maxOtherPlayerCount
        );
    };

    return (
        <View>
            <View>
                <View style={getStyle(['row', 'align-items-center', 'justify-between', 'py-8'])}>
                    <CTText h4 color={colors.text} fontFamily={fonts.montserrat.bold}>
                        {moment(schedule.date).format('dddd, MMM DD, YYYY')}
                    </CTText>
                    <StatusBadge />
                </View>
                <View style={getStyle(['row', 'align-items-center'])}>
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
                <CTSwitch
                    name="isSharing"
                    label={
                        reqPlayerCount > 0
                            ? 'List members to share.'
                            : 'If the box is checked, the timeslot is available for other members to sign up to join you.'
                    }
                    style={getStyle('my-16')}
                    value={isSharing}
                    disabled={
                        hasSentCircleMsg ||
                        !!schedule.circleMessage ||
                        (reqPlayerCount > 0 && (schedule.members.length || 0) < reqPlayerCount)
                    }
                    onChange={(value) => setIsSharing(value)}
                />
                <CTText h5 fontFamily={fonts.montserrat.bold} color={colors.text} style={getStyle('mb-8')}>
                    Other Players
                </CTText>
                <View style={styles.otherPlayerContainers}>
                    {reqPlayerCount > 0 && (
                        <CTText color={colors.danger} size={9}>
                            {venue.setting?.ruleSettings?.isShouldPyMember &&
                                'All players should members of the club. '}
                            This timeslot is required at least{' '}
                            <CTText bold color={colors.danger}>
                                {reqPlayerCount} other player(s).{' '}
                            </CTText>
                            if other players is less than {reqPlayerCount}, it will default to sharing a timeslot.
                        </CTText>
                    )}
                    {otherPlayers.map((x) => (
                        <OtherPalyerItem player={x} key={x.fullName} />
                    ))}
                    {otherPlayers.length < maxOtherPlayerCount && (
                        <TouchableOpacity
                            style={[
                                styles.otherPlayerItemContainer,
                                getStyle(['row', 'justify-center', 'align-items-center', 'mt-8']),
                            ]}
                            onPress={toggleSearchOtherPy}
                        >
                            <Icon name="person-add-outline" type={IconType.Ionicons} size={25} color={colors.primary} />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={getStyle(['row', 'align-items-center', 'mt-16'])}>
                    <CTButton
                        loading={cancelLoading}
                        title="Cancel Schedule"
                        color={colors.secondary}
                        style={getStyle(['mr-8', 'col'])}
                        onPress={cancelSchedule}
                    />
                    <CTButton
                        loading={loading}
                        title={schedule.status !== SCHEDULE_STATUS.CONFIRM ? 'Confirm' : 'Update'}
                        style={getStyle('col')}
                        onPress={updateSchedule}
                    />
                </View>
                {canShowCircleMsgButton() && (
                    <CTButton
                        onPress={() => setIsOpenCircleMsg(true)}
                        color={colors.dynamicWhite}
                        borderColor={colors.primary}
                        style={getStyle('mt-8')}
                    >
                        <CTText fontFamily={fonts.montserrat.regular} color={colors.primary} bold center>
                            Send Circle Message
                        </CTText>
                    </CTButton>
                )}
            </View>
            <ReactNativeModal
                isVisible={isOpenSearchMemberModal}
                statusBarTranslucent={false}
                backdropOpacity={0.8}
                animationIn="slideInLeft"
                animationInTiming={200}
                animationOut="slideOutRight"
                animationOutTiming={300}
                onBackdropPress={toggleSearchOtherPy}
            >
                <View style={styles.searchMemberModalContainer}>
                    <View style={getStyle(['row', 'justify-between', 'align-items-center', 'mb-16'])}>
                        <View />
                        <CTText h3 fontFamily={fonts.montserrat.bold} color={colors.text}>
                            Search Members
                        </CTText>
                        <TouchableOpacity onPress={toggleSearchOtherPy}>
                            <Icon name="close" type={IconType.Ionicons} size={25} />
                        </TouchableOpacity>
                    </View>
                    <SearchMemberContent
                        style={styles.searchMemberContentStyle}
                        query={{ club: club._id }}
                        onResult={(values: User[]) => {
                            const value = values[0];
                            if (value.email !== user.email && !otherPlayers.some((x) => x.email === value.email)) {
                                const newPlayer: OtherPlayer = {
                                    fullName: value.fullName,
                                    email: value.email,
                                    mobilePhone: value.phoneNumber,
                                    isMember: true,
                                    isShareUser: false,
                                    gameLevel: value.gameLevel,
                                    levelType: value.levelType,
                                };
                                const newOtherPlayers = [...otherPlayers, newPlayer];
                                setOtherPlayers(newOtherPlayers);
                            }
                            toggleSearchOtherPy();
                        }}
                    />
                </View>
            </ReactNativeModal>
            <SendCircleMsgModal
                isOpen={isOpenCircleMsg}
                toggle={() => setIsOpenCircleMsg(false)}
                schedule={schedule}
                callback={() => {
                    setIsSharing(true);
                    setHasSentCircleMsg(true);
                    callback();
                }}
            />
        </View>
    );
};

export default ScheduleDetails;
