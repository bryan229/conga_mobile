import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as Progress from 'react-native-progress';
import Clipboard from '@react-native-clipboard/clipboard';
import { View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useIsFocused } from '@react-navigation/native';
import createStyles from './style';
import { HomeStackParamList } from '@navigation/types';
import { useTheme } from '@services/hooks/useTheme';
import CTText from '@shared/components/controls/ct-text';
import { Circle, FacilityResource } from '@services/models';
import fonts from '@shared/theme/fonts';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { TouchableOpacity } from 'react-native';
import { handleError, showAlertModal } from '@store/actions';
import { ResourceApi } from '@services/api';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import CTInfiniteFlatlist from '@shared/components/controls/ct-infinite-flatlist';
import ResourceItem from './components/resource-item';
import MainHeader from '@navigation/components/main-header';
import ResourceSearchOptionPanel from './components/search-option-panel';
import { filterDateRangeToValues, mileToKm } from '@utils';
import CPBottomSheet from '@shared/components/bootom-sheet';
import { useAppNavigation } from '@services/hooks/useNavigation';
import SelectCircleModal from './components/select-circle-modal';
import { putResourceQuery } from '@store/actions/resource';
import { AlertModalButton } from '@services/types';
import { checkSubscription } from '@services/helpers/user';

const LIMIT = 100;

type ScreenProps = StackScreenProps<HomeStackParamList, 'Resources'>;

const FacilityResourcesScreen: React.FC<ScreenProps> = () => {
    const club = useAppSelector((state) => state.club.club!);
    const user = useAppSelector((state) => state.auth.user!);
    const myCircles = useAppSelector((state) => state.club.myCircles);
    const userLocation = useAppSelector((state) => state.auth.location);
    const query = useAppSelector((state) => state.resource.query);
    const navigation = useAppNavigation();
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const isFocused = useIsFocused();
    const [resources, setResources] = useState<FacilityResource[]>([]);
    const [selectedResource, setSelectedResource] = useState<FacilityResource>();
    const [isOpenAction, setIsOpenAction] = useState(false);
    const [isOpenCircle, setIsOpenCircle] = useState(false);
    const [isRefresh, setIsRefresh] = useState(false);
    const [isLoadMore, setIsLoadMore] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchResources = useCallback(
        async (skip: number, displayLoading?: boolean) => {
            if (displayLoading) setLoading(true);
            try {
                const params = {
                    club: club?._id,
                    stDate: filterDateRangeToValues(query.dateRange).from,
                    etDate: filterDateRangeToValues(query.dateRange).to,
                    coordinates: query.aroundMe ? userLocation : undefined,
                    state: query.address ? query.state : undefined,
                    county: query.address ? query.county : undefined,
                    city: query.address ? query.city : undefined,
                    subClub: query.organization,
                    radius: mileToKm(query.radius),
                    skip: skip,
                    limit: Math.min(200, Math.max((resources ?? []).length, LIMIT)),
                };
                const res = await ResourceApi.retrieve(params);
                if (skip === 0) setResources(res.data);
                else
                    setResources((prev) =>
                        [...prev, ...res.data].filter(
                            (x, index, self) => self.findIndex((v) => v._id === x._id) === index
                        )
                    );
                setTotalCount(res.totalCount);
            } catch (error) {
                dispatch(handleError(error));
            }
            setLoading(false);
        },
        [query]
    );

    useEffect(() => {
        if (isFocused) fetchResources(0, true);
    }, [isFocused, query]);

    const onSelectResource = (resource: FacilityResource) => {
        const { valid, message, primaryButtonLabel, secondaryButtonLabel } = checkSubscription();
        if (valid) {
            setSelectedResource(resource);
            toggle();
        } else if (message) {
            const buttons: AlertModalButton[] = [];
            if (primaryButtonLabel) buttons.push({ type: 'ok', label: primaryButtonLabel, value: 'yes' });
            if (secondaryButtonLabel) buttons.push({ type: 'cancel', label: secondaryButtonLabel, value: 'no' });
            dispatch(
                showAlertModal({
                    type: 'warning',
                    title: 'Warning',
                    message,
                    buttons,
                    handler: async (value: string) => {
                        if (value === 'yes') {
                            return navigation.navigate('Subscription', { user, club });
                        }
                    },
                })
            );
        }
    };

    const renderItem = ({ item }: { item: FacilityResource; index?: number }) => (
        <ResourceItem resource={item} onPress={() => onSelectResource(item)} />
    );

    const onLoadMore = async () => {
        setIsLoadMore(true);
        await fetchResources(resources.length);
        setIsLoadMore(false);
    };

    const onRefresh = async () => {
        setIsRefresh(true);
        await fetchResources(0);
        setIsRefresh(false);
    };

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

    const onCopyEmail = () => {
        toggle();
        Clipboard.setString(selectedResource?.contactEmail ?? '');
    };

    const onCopyNumber = () => {
        toggle();
        Clipboard.setString(selectedResource?.contactPhoneNumber ?? '');
    };

    const onCreateNewCircleMessage = (circle: Circle) => {
        toggle();
        navigation.navigate('CircleMessage', {
            initScreen: 'NewMessage',
            circleId: circle._id,
            resourceId: selectedResource?._id,
        });
    };

    const toggle = () => {
        setIsOpenAction(!isOpenAction);
    };

    const toggleCircle = () => {
        setIsOpenCircle(!isOpenCircle);
    };

    const onOpenFilter = () => {
        navigation.navigate('ResourceSearchPanel', {
            title: 'Resource Filter',
            query,
            onChange: (query) => dispatch(putResourceQuery(query)),
        });
    };

    const BottomActionSheetButtons = () => (
        <View>
            <View style={styles.bottomSheetButtonGroupStyle}>
                {selectedResource?.contactEmail && (
                    <TouchableOpacity
                        style={[styles.bottomSheetButtonStyle, styles.borderBottomStyle]}
                        onPress={onCopyEmail}
                    >
                        <Icon name="mail-outline" type={IconType.Ionicons} size={20} color={colors.text} />
                        <CTText
                            color={colors.text}
                            fontFamily={fonts.montserrat.semiBold}
                            style={styles.bottomSheetButtonTextStyle}
                        >
                            Copy Email
                        </CTText>
                    </TouchableOpacity>
                )}
                {selectedResource?.contactPhoneNumber && (
                    <TouchableOpacity
                        style={[styles.bottomSheetButtonStyle, styles.borderBottomStyle]}
                        onPress={onCopyNumber}
                    >
                        <Icon name="call-outline" type={IconType.Ionicons} size={20} color={colors.text} />
                        <CTText
                            color={colors.text}
                            fontFamily={fonts.montserrat.semiBold}
                            style={styles.bottomSheetButtonTextStyle}
                        >
                            Copy Phone Number
                        </CTText>
                    </TouchableOpacity>
                )}
                {myCircles.length > 0 && (
                    <TouchableOpacity
                        style={styles.bottomSheetButtonStyle}
                        onPress={() => {
                            if (myCircles.length > 1) toggleCircle();
                            else onCreateNewCircleMessage(myCircles[0]);
                        }}
                    >
                        <Icon name="checkmark-circle" type={IconType.Ionicons} size={20} color={colors.primary} />
                        <CTText
                            color={colors.primary}
                            fontFamily={fonts.montserrat.semiBold}
                            style={styles.bottomSheetButtonTextStyle}
                        >
                            Create New Circle Message
                        </CTText>
                    </TouchableOpacity>
                )}
            </View>
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
            <SelectCircleModal
                isOpen={isOpenCircle}
                toggle={toggleCircle}
                callback={(circle) => onCreateNewCircleMessage(circle)}
            />
        </View>
    );

    return (
        <View style={styles.containerStyle}>
            <MainHeader title="Resources" />
            <View style={styles.contentStyle}>
                <Loading />
                <ResourceSearchOptionPanel query={query} onOpenFilter={onOpenFilter} />
                <View style={styles.listContainerStyle}>
                    <CTInfiniteFlatlist<FacilityResource>
                        style={styles.listStyle}
                        renderItem={renderItem}
                        totalCount={totalCount}
                        data={resources}
                        isLoadMore={isLoadMore}
                        onLoadMore={onLoadMore}
                        isRefresh={isRefresh}
                        onRefresh={onRefresh}
                    />
                </View>
                {selectedResource && (
                    <CPBottomSheet
                        isVisible={isOpenAction}
                        toggle={toggle}
                        style={styles.bottomSheetStyle}
                        isHideButton={false}
                    >
                        <BottomActionSheetButtons />
                    </CPBottomSheet>
                )}
            </View>
        </View>
    );
};

export default FacilityResourcesScreen;
