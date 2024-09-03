import React, { useMemo, useState } from 'react';
import { Circle } from '@services/models';
import { View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import { useAppDispatch, useAppSelector } from '@store/hook';
import CTButton from '@shared/components/controls/ct-button';
import { handleError, showAlert } from '@store/actions/ui';
import { CircleApi } from '@services/api';
import { CIRCLE_MEMBER_STATUS } from '@shared/constants';
import CPAnimateButtonGroup from '@shared/components/button-animate-group';
import { ScreenWidth } from '@freakycoder/react-native-helpers';
import CircleInfo from './circle-info';
import CircleMembers from './circle-members';

interface Props {
    circle?: Circle;
    callBack: () => void;
}

const CircleDetails = ({ circle, callBack }: Props) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const { colors, getStyle } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const user = useAppSelector((state) => state.auth.user!);
    const [loading, setLoading] = useState(false);
    const [declineLoading, setDeclineLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<string>('Circle Info');

    if (!circle) return null;

    const requestMe = circle.members.find(
        (x) => x.user._id === user?._id && x.status === CIRCLE_MEMBER_STATUS.REQUESTED
    );

    const invitedMe = circle.members.find((x) => x.user._id === user?._id && x.status === CIRCLE_MEMBER_STATUS.INVITED);

    const sentJoinRequest = async () => {
        try {
            setLoading(true);
            const params = { _id: circle._id };
            const { message } = await CircleApi.joinRequest(params);
            setLoading(false);
            dispatch(showAlert({ type: 'success', title: 'Success', message }));
            callBack();
        } catch (error) {
            setLoading(false);
            dispatch(handleError(error));
        }
    };

    const cancelRequest = async () => {
        try {
            setLoading(true);
            const params = { _id: circle._id, member: user._id };
            await CircleApi.removeMember(params);
            setLoading(false);
            dispatch(showAlert({ type: 'success', title: 'Success', message: 'Request has been canceled.' }));
            callBack();
        } catch (error) {
            setLoading(false);
            dispatch(handleError(error));
        }
    };

    const acceptInvite = async () => {
        try {
            setLoading(true);
            const params = { _id: circle._id };
            const { message } = await CircleApi.inviteAccept(params);
            setLoading(false);
            dispatch(showAlert({ type: 'success', title: 'Success', message }));
            callBack();
        } catch (error) {
            setLoading(false);
            dispatch(handleError(error));
        }
    };

    const declineInvite = async () => {
        try {
            setDeclineLoading(true);
            const params = { _id: circle._id, member: user._id };
            await CircleApi.removeMember(params);
            setDeclineLoading(false);
            dispatch(showAlert({ type: 'success', title: 'Success', message: 'Invitation has been declined.' }));
            callBack();
        } catch (error) {
            setDeclineLoading(false);
            dispatch(handleError(error));
        }
    };

    return (
        <View style={styles.containerStyle}>
            <CPAnimateButtonGroup
                buttons={['Circle Info', 'Members']}
                onSelect={setActiveTab}
                activeBtn={activeTab}
                width={ScreenWidth - 32}
            />
            {activeTab === 'Circle Info' && <CircleInfo circle={circle} />}
            {activeTab === 'Members' && <CircleMembers circle={circle} />}
            {invitedMe ? (
                <View style={getStyle(['row', 'align-items-center', 'mt-16'])}>
                    <CTButton
                        style={getStyle(['col', 'mr-8'])}
                        onPress={declineInvite}
                        loading={declineLoading}
                        color={colors.secondary}
                    >
                        <CTText color={colors.white} center bold fontFamily={fonts.montserrat.bold}>
                            Decline
                        </CTText>
                    </CTButton>
                    <CTButton style={getStyle('col')} onPress={acceptInvite} loading={loading}>
                        <CTText color={colors.white} center bold fontFamily={fonts.montserrat.bold}>
                            Accept
                        </CTText>
                    </CTButton>
                </View>
            ) : (
                <>
                    {!requestMe ? (
                        <CTButton style={getStyle('mt-16')} onPress={sentJoinRequest} loading={loading}>
                            <CTText color={colors.white} center bold fontFamily={fonts.montserrat.bold}>
                                Join the circle
                            </CTText>
                        </CTButton>
                    ) : (
                        <CTButton
                            style={getStyle('mt-16')}
                            onPress={cancelRequest}
                            loading={loading}
                            color={colors.secondary}
                        >
                            <CTText color={colors.white} center bold fontFamily={fonts.montserrat.bold}>
                                Cancel Request
                            </CTText>
                        </CTButton>
                    )}
                </>
            )}
        </View>
    );
};

export default CircleDetails;
