import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as Progress from 'react-native-progress';
import Clipboard from '@react-native-clipboard/clipboard';
import { View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useIsFocused } from '@react-navigation/native';
import createStyles from './style';
import { RootStackParamList } from '@navigation/types';
import { useTheme } from '@services/hooks/useTheme';
import CTText from '@shared/components/controls/ct-text';
import { FacilityResource } from '@services/models';
import fonts from '@shared/theme/fonts';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { FILTER_DATE_REANGES } from '@shared/constants';
import { TouchableOpacity } from 'react-native';
import { handleError } from '@store/actions';
import { ResourceApi } from '@services/api';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import CTInfiniteFlatlist from '@shared/components/controls/ct-infinite-flatlist';
import ResourceItem from './components/resource-item';
import ResourceSearchOptionPanel from './components/search-option-panel';
import { ResourceQuery } from '@services/types';
import { filterDateRangeToValues, mileToKm } from '@utils';
import CPBottomSheet from '@shared/components/bootom-sheet';
import { useAppNavigation } from '@services/hooks/useNavigation';
import BackHeader from '@navigation/components/back-header';

const LIMIT = 100;

type ScreenProps = StackScreenProps<RootStackParamList, 'SearchResources'>;

const SearchResourcesScreen: React.FC<ScreenProps> = ({ route }) => {
    const club = useAppSelector((state) => state.club.club);
    const myCircles = useAppSelector((state) => state.club.myCircles);
    const userLocation = useAppSelector((state) => state.auth.location);
    const navigation = useAppNavigation();
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const isFocused = useIsFocused();
    const [query, setQuery] = useState<ResourceQuery>({
        dateRange: FILTER_DATE_REANGES.THIRTY_DAYS,
        aroundMe: !!userLocation,
        address: !userLocation,
        radius: 30,
    });
    const [resources, setResources] = useState<FacilityResource[]>([]);
    const [selectedResource, setSelectedResource] = useState<FacilityResource>();
    const [isOpenAction, setIsOpenAction] = useState(false);
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
                    subClub: query.organization,
                    coordinates: query.aroundMe ? userLocation : undefined,
                    state: query.address ? query.state : undefined,
                    county: query.address ? query.county : undefined,
                    city: query.address ? query.city : undefined,
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

    const renderItem = ({ item }: { item: FacilityResource; index?: number }) => (
        <ResourceItem
            resource={item}
            onPress={() => {
                setSelectedResource(item);
                toggle();
            }}
        />
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

    const onSelectResource = () => {
        toggle();
        if (selectedResource) route.params?.callback?.(selectedResource);
        navigation.goBack();
    };

    const toggle = () => {
        setIsOpenAction(!isOpenAction);
    };

    const onOpenFilter = () => {
        navigation.navigate('ResourceSearchPanel', {
            title: 'Resource Filter',
            query,
            onChange: setQuery,
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
                    <TouchableOpacity style={styles.bottomSheetButtonStyle} onPress={onSelectResource}>
                        <Icon name="checkmark-circle" type={IconType.Ionicons} size={20} color={colors.primary} />
                        <CTText
                            color={colors.primary}
                            fontFamily={fonts.montserrat.semiBold}
                            style={styles.bottomSheetButtonTextStyle}
                        >
                            Select Resource
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
        </View>
    );

    return (
        <View style={styles.containerStyle}>
            <BackHeader title="Resources" />
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

export default SearchResourcesScreen;
