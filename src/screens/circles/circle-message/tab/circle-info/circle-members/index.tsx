import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { Circle, CircleMember, User } from '@services/models';
import { CircleApi } from '@services/api';
import { handleError, showAlert, showAlertModal } from '@store/actions';
import CPBottomSheet from '@shared/components/bootom-sheet';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import CTInfiniteFlatlist from '@shared/components/controls/ct-infinite-flatlist';
import CircleMemberItem from '../../../components/circlemember-item';
import { CIRCLE_MEMBER_STATUS, CIRCLE_STATUS } from '@shared/constants';
import { getStyle } from '@shared/theme/themes';
import ReactNativeModal from 'react-native-modal';
import SearchMemberContent from '@shared/components/search-member-content';

const CircleMembers = ({ circle }: { circle: Circle }) => {
    const dispatch = useAppDispatch();
    const club = useAppSelector((state) => state.club.club);
    const user = useAppSelector((state) => state.auth.user);
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentCircle, setCircle] = useState<Circle>(circle);
    const [isOpenAction, setIsOpenAction] = useState<boolean>(false);
    const [selectedMember, setSelectedMember] = useState<CircleMember>();
    const [isOpenSearchMemberModal, setIsOpenSearchMemberModal] = useState<boolean>(false);

    const isOwnCircle = circle.leader._id === user?._id;

    const fetchCircle = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await CircleApi.read({ _id: circle._id });
            setCircle(data as Circle);
            setLoading(false);
        } catch (error) {
            dispatch(handleError(error));
            setLoading(false);
        }
    }, [circle._id]);

    useEffect(() => {
        if (circle._id) fetchCircle();
    }, [circle._id]);

    const toggle = () => {
        setIsOpenAction(!isOpenAction);
    };

    const approveRequest = async () => {
        if (!selectedMember) return;
        try {
            setLoading(true);
            const params = { _id: currentCircle._id, member: selectedMember.user._id };
            const { data } = await CircleApi.joinApprove(params);
            setCircle(data as Circle);
            setLoading(false);
            toggle();
        } catch (error) {
            setLoading(false);
            dispatch(handleError(error));
        }
    };

    const declineRequest = async () => {
        if (!selectedMember) return;
        try {
            setLoading(true);
            const params = { _id: currentCircle._id, member: selectedMember.user._id };
            const { data } = await CircleApi.removeMember(params);
            setCircle(data as Circle);
            setLoading(false);
            toggle();
        } catch (error) {
            setLoading(false);
            dispatch(handleError(error));
        }
    };

    const removeMember = async () => {
        if (!selectedMember) return;
        try {
            setLoading(true);
            const params = { _id: currentCircle._id, member: selectedMember.user._id };
            const { data } = await CircleApi.removeMember(params);
            setCircle(data as Circle);
            setLoading(false);
            toggle();
        } catch (error) {
            setLoading(false);
            dispatch(handleError(error));
        }
    };

    const memberInvite = async (member: User) => {
        try {
            setLoading(true);
            const params = { _id: currentCircle._id, member: member._id };
            const { data } = await CircleApi.inviteMember(params);
            setCircle(data as Circle);
            setLoading(false);
            dispatch(showAlert({ type: 'success', title: 'Success', message: 'Invitation sent.' }));
        } catch (error) {
            setLoading(false);
            dispatch(handleError(error));
        }
    };

    const renderItem = ({ item }: { item: CircleMember; index?: number }) => (
        <CircleMemberItem
            isLeader={item.user?._id === circle.leader?._id}
            member={item}
            selected={false}
            showSelectSign={false}
            onPress={() => {
                if (!isOwnCircle || item.user?._id === circle.leader?._id || circle.status === CIRCLE_STATUS.BLOCKED)
                    return;
                setSelectedMember(item);
                toggle();
            }}
        />
    );

    const BottomActionSheetButtons = () => (
        <View>
            {selectedMember?.status === CIRCLE_MEMBER_STATUS.REQUESTED ? (
                <View style={styles.bottomSheetButtonGroupStyle}>
                    <TouchableOpacity
                        style={[styles.bottomSheetButtonStyle, styles.borderBottom]}
                        onPress={approveRequest}
                    >
                        <Icon name="checkmark-circle" type={IconType.Ionicons} size={20} color={colors.primary} />
                        <CTText
                            color={colors.primary}
                            fontFamily={fonts.montserrat.semiBold}
                            style={styles.bottomSheetButtonTextStyle}
                        >
                            Approve
                        </CTText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bottomSheetButtonStyle} onPress={declineRequest}>
                        <Icon name="trash-outline" type={IconType.Ionicons} size={20} color={colors.danger} />
                        <CTText
                            color={colors.danger}
                            fontFamily={fonts.montserrat.semiBold}
                            style={styles.bottomSheetButtonTextStyle}
                        >
                            Decline
                        </CTText>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.bottomSheetButtonGroupStyle}>
                    <TouchableOpacity style={styles.bottomSheetButtonStyle} onPress={removeMember}>
                        <Icon name="trash-outline" type={IconType.Ionicons} size={20} color={colors.danger} />
                        <CTText
                            color={colors.danger}
                            fontFamily={fonts.montserrat.semiBold}
                            style={styles.bottomSheetButtonTextStyle}
                        >
                            Remove
                        </CTText>
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.buttomSheetCancelButtonContainer}>
                <TouchableOpacity style={styles.bottomSheetCancelButtonStyle} onPress={toggle}>
                    <CTText
                        fontFamily={fonts.montserrat.semiBold}
                        style={styles.bottomSheetCancelButtonTextStyle}
                        color={colors.primary}
                    >
                        Close
                    </CTText>
                </TouchableOpacity>
            </View>
        </View>
    );

    const Loading = () => {
        if (!loading) return null;
        return (
            <View style={styles.loadingContainerStyle}>
                <Progress.Circle
                    size={25}
                    indeterminate={loading}
                    color="white"
                    borderWidth={3}
                    borderColor={colors.primary}
                />
            </View>
        );
    };

    const getMembers = () => {
        return currentCircle.members.sort((a, b) => {
            const aValue =
                a.status === CIRCLE_MEMBER_STATUS.REQUESTED ? 0 : a.status === CIRCLE_MEMBER_STATUS.APPROVED ? 1 : 2;
            const bValue =
                b.status === CIRCLE_MEMBER_STATUS.REQUESTED ? 0 : b.status === CIRCLE_MEMBER_STATUS.APPROVED ? 1 : 2;
            return aValue - bValue;
        });
    };

    return (
        <View style={styles.containerStyle}>
            {isOwnCircle && !circle.subClub && (
                <TouchableOpacity
                    style={styles.inviteBtnStyle}
                    onPress={() => {
                        if (circle.status !== CIRCLE_STATUS.BLOCKED) return setIsOpenSearchMemberModal(true);
                        dispatch(
                            showAlertModal({
                                type: 'warning',
                                title: 'Warning',
                                message: `This circle has been ${circle.status}`,
                            })
                        );
                    }}
                >
                    <Icon type={IconType.Ionicons} name="add" color={colors.primary} />
                    <CTText
                        fontFamily={fonts.montserrat.regular}
                        bold
                        center
                        style={getStyle('ml-8')}
                        color={colors.primary}
                    >
                        Invite Member
                    </CTText>
                </TouchableOpacity>
            )}
            <View style={styles.listContainerStyle}>
                <Loading />
                <CTInfiniteFlatlist<CircleMember>
                    style={styles.listStyle}
                    renderItem={renderItem}
                    totalCount={getMembers().length}
                    data={getMembers()}
                />
                <CPBottomSheet
                    isVisible={isOpenAction}
                    toggle={toggle}
                    style={styles.bottomSheetStyle}
                    isHideButton={false}
                >
                    <BottomActionSheetButtons />
                </CPBottomSheet>
            </View>
            <ReactNativeModal
                isVisible={isOpenSearchMemberModal}
                statusBarTranslucent={false}
                backdropOpacity={0.8}
                animationIn="slideInUp"
                animationInTiming={200}
                animationOut="slideOutDown"
                animationOutTiming={300}
            >
                <View style={styles.searchMemberModalContainer}>
                    <View style={getStyle(['row', 'justify-between', 'align-items-center', 'mb-16'])}>
                        <View />
                        <CTText h3 fontFamily={fonts.montserrat.bold} color={colors.text}>
                            Seach Members
                        </CTText>
                        <TouchableOpacity onPress={() => setIsOpenSearchMemberModal(false)}>
                            <Icon name="close" type={IconType.Ionicons} size={25} />
                        </TouchableOpacity>
                    </View>
                    <SearchMemberContent
                        style={styles.searchMemberContentStyle}
                        query={{ club: club?._id }}
                        onResult={(values) => {
                            memberInvite(values[0]);
                            setIsOpenSearchMemberModal(false);
                        }}
                    />
                </View>
            </ReactNativeModal>
        </View>
    );
};

export default CircleMembers;
