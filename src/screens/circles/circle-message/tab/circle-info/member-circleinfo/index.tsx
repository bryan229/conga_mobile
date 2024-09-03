import { Circle, SubClub } from '@services/models';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { useMemo, useState } from 'react';
import createStyles from './style';
import { useTheme } from '@services/hooks/useTheme';
import { View } from 'react-native';
import CTButton from '@shared/components/controls/ct-button';
import CTText from '@shared/components/controls/ct-text';
import { getStyle } from '@shared/theme/themes';
import fonts from '@shared/theme/fonts';
import { CircleApi } from '@services/api';
import { handleError, showAlert, showAlertModal } from '@store/actions';
import { useAppNavigation } from '@services/hooks/useNavigation';
import { hasValue } from '@utils';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import moment from 'moment';

const MemberCircleInfo = ({ circle }: { circle: Circle }) => {
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();
    const navigation = useAppNavigation();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [loading, setLoading] = useState<boolean>(false);

    const leaveCircle = async () => {
        dispatch(
            showAlertModal({
                type: 'warning',
                title: 'Leave Circle',
                message: 'Do you want to leave circle? \n Are you sure?',
                buttons: [
                    {
                        type: 'ok',
                        label: 'Yes',
                        value: 'yes',
                    },
                    {
                        type: 'ok',
                        label: 'No',
                        value: 'no',
                    },
                ],
                handler: async (value: string) => {
                    if (value === 'no') return;
                    setLoading(true);
                    try {
                        const params = { _id: circle._id, member: user?._id };
                        await CircleApi.removeMember(params);
                        setLoading(false);
                        dispatch(
                            showAlert({
                                type: 'success',
                                title: 'Success',
                                message: 'You have been leaving the circle.',
                            })
                        );
                        navigation.navigate('Circles');
                    } catch (error) {
                        setLoading(false);
                        dispatch(handleError(error));
                    }
                },
            })
        );
    };

    const getJoinDate = () => {
        const me = circle.members.find((x) => x.user._id === user?._id);
        if (!me) return '';
        return moment(new Date(me?.updatedDate)).format('MMM DD, YYYY');
    };

    return (
        <View style={styles.containerStyle}>
            <CTText h3 color={colors.text} fontFamily={fonts.montserrat.bold} bold style={getStyle('mb-16')}>
                {circle.name}
            </CTText>
            <CTText color={colors.text} fontFamily={fonts.montserrat.regular} style={getStyle('mb-8')}>
                Since: {moment(circle.createdAt).format('MMM DD, YYYY')}
            </CTText>
            <CTText color={colors.text} fontFamily={fonts.montserrat.regular} style={getStyle('mb-8')}>
                Members: {circle.members.length}
            </CTText>
            <CTText color={colors.text} fontFamily={fonts.montserrat.bold} bold style={getStyle('mb-8')}>
                Leader: {circle.leader.fullName}
            </CTText>
            <CTText color={colors.text} fontFamily={fonts.montserrat.bold} style={getStyle('mb-8')}>
                Join Date: {getJoinDate()}
            </CTText>
            <CTText color={colors.text} fontFamily={fonts.montserrat.bold} style={getStyle('my-8')}>
                {circle.description}
            </CTText>
            {(circle.state || circle.county || circle.city) && (
                <View style={getStyle(['row', 'align-items-center', 'mb-8'])}>
                    <Icon name="location" size={20} type={IconType.Ionicons} color={colors.iconPrimary} />
                    <CTText fontFamily={fonts.montserrat.bold} size={10}>
                        {[circle.state, circle.county, circle.city].filter((x) => !!x).join(', ')}
                    </CTText>
                </View>
            )}
            {circle.subClub && (
                <View style={getStyle(['row', 'align-items-center', 'mb-8'])}>
                    <Icon name="business" size={18} type={IconType.Ionicons} color={colors.iconPrimary} />
                    <CTText fontFamily={fonts.montserrat.bold} size={10} bold style={getStyle('ml-8')}>
                        {(circle.subClub as SubClub).name}
                    </CTText>
                </View>
            )}
            <View style={getStyle(['row', 'align-items-center', 'flex-wrap'])}>
                {hasValue(circle.eligibleGender) && (
                    <View style={styles.tagContainerStyle}>
                        <CTText style={getStyle('capitalize')} size={9} fontFamily={fonts.montserrat.bold} bold>
                            {circle.eligibleGender}
                        </CTText>
                    </View>
                )}
                {hasValue(circle.eligibleLevel) && (
                    <View style={styles.tagContainerStyle}>
                        <CTText style={getStyle('capitalize')} size={9} fontFamily={fonts.montserrat.bold} bold>
                            Level: {circle.eligibleLevel?.from} ~ {circle.eligibleLevel?.to}
                        </CTText>
                    </View>
                )}
                {(circle.ageRanges ?? []).length > 0 && (
                    <View style={styles.tagContainerStyle}>
                        <CTText style={getStyle('capitalize')} size={9} fontFamily={fonts.montserrat.bold} bold>
                            {circle.ageRanges?.join(', ')}
                        </CTText>
                    </View>
                )}
            </View>

            <CTButton loading={loading} onPress={leaveCircle} color={colors.secondary} style={getStyle('mt-32')}>
                <CTText fontFamily={fonts.montserrat.regular} bold color={colors.white} center>
                    Leave Circle
                </CTText>
            </CTButton>
        </View>
    );
};

export default MemberCircleInfo;
