import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as Progress from 'react-native-progress';
import { TouchableOpacity, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useIsFocused } from '@react-navigation/native';
import createStyles from './style';
import { HomeStackParamList } from '@navigation/types';
import { useTheme } from '@services/hooks/useTheme';
import { SubClub } from '@services/models';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { handleError } from '@store/actions';
import { SubClubApi } from '@services/api';
import CTInfiniteFlatlist from '@shared/components/controls/ct-infinite-flatlist';
import OrganizationItem from './components/organization-item';
import MainHeader from '@navigation/components/main-header';
import OrganziationSearchOptionPanel from './components/search-option-panel';
import { CongaClubEventQuery, OrganizationQuery, ResourceQuery } from '@services/types';
import { mileToKm } from '@utils';
import { useAppNavigation } from '@services/hooks/useNavigation';
import { putCongaClubEventQuery } from '@store/actions/clubevent';
import { FILTER_DATE_REANGES } from '@shared/constants';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import CPBottomSheet from '@shared/components/bootom-sheet';
import { putResourceQuery } from '@store/actions/resource';

const LIMIT = 100;

type ScreenProps = StackScreenProps<HomeStackParamList, 'Organizations'>;

const ParticipatingOrganizationsScreen: React.FC<ScreenProps> = () => {
    const club = useAppSelector((state) => state.club.club);
    const userLocation = useAppSelector((state) => state.auth.location);
    const navigation = useAppNavigation();
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const isFocused = useIsFocused();
    const [query, setQuery] = useState<OrganizationQuery>({
        aroundMe: !!userLocation,
        address: !userLocation,
        radius: 30,
    });
    const [organizations, setOrganizations] = useState<SubClub[]>([]);
    const [selectedOrganization, setSelectedOrganization] = useState<SubClub | null>(null);
    const [isOpenAction, setIsOpenAction] = useState(false);
    const [isRefresh, setIsRefresh] = useState(false);
    const [isLoadMore, setIsLoadMore] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchOrganizations = useCallback(
        async (skip: number, displayLoading?: boolean) => {
            if (displayLoading) setLoading(true);
            try {
                const params = {
                    club: club?._id,
                    coordinates: query.aroundMe ? userLocation : undefined,
                    state: query.address ? query.state : undefined,
                    county: query.address ? query.county : undefined,
                    city: query.address ? query.city : undefined,
                    radius: mileToKm(query.radius),
                    skip: skip,
                    limit: Math.min(200, Math.max((organizations ?? []).length, LIMIT)),
                };
                const res = await SubClubApi.retrieve(params);
                if (skip === 0) setOrganizations(res.data);
                else
                    setOrganizations((prev) =>
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
        if (isFocused) fetchOrganizations(0, true);
    }, [isFocused, query]);

    const renderItem = ({ item }: { item: SubClub; index?: number }) => (
        <OrganizationItem
            organization={item}
            onPress={() => {
                setSelectedOrganization(item);
                toggle();
            }}
        />
    );

    const onLoadMore = async () => {
        setIsLoadMore(true);
        await fetchOrganizations(organizations.length);
        setIsLoadMore(false);
    };

    const onRefresh = async () => {
        setIsRefresh(true);
        await fetchOrganizations(0);
        setIsRefresh(false);
    };

    const onOpenFilter = () => {
        navigation.navigate('OrganizationSearchPanel', {
            title: 'Organization Filter',
            query,
            onChange: setQuery,
        });
    };

    const toggle = () => {
        setIsOpenAction(!isOpenAction);
    };

    const onViewEvent = () => {
        toggle();
        const eventQuery: CongaClubEventQuery = {
            dateRange: FILTER_DATE_REANGES.NINETY_DAYS,
            aroundMe: false,
            address: false,
            onlyMyCicle: false,
            eventType: undefined,
            organization: selectedOrganization?._id,
            state: undefined,
            county: undefined,
            city: undefined,
            radius: query.radius,
        };
        dispatch(putCongaClubEventQuery(eventQuery));
        navigation.navigate('ClubEvents', { screen: 'ClubEventList' });
    };

    const onViewResource = () => {
        toggle();
        const resourceQuery: ResourceQuery = {
            dateRange: FILTER_DATE_REANGES.NINETY_DAYS,
            aroundMe: false,
            address: false,
            organization: selectedOrganization?._id,
            state: undefined,
            county: undefined,
            city: undefined,
            radius: query.radius,
        };
        dispatch(putResourceQuery(resourceQuery));
        navigation.navigate('Resources');
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

    const BottomActionSheetButtons = () => (
        <View>
            <View style={styles.bottomSheetButtonGroupStyle}>
                <TouchableOpacity
                    style={[styles.bottomSheetButtonStyle, styles.borderBottomStyle]}
                    onPress={onViewEvent}
                >
                    <Icon name="calendar-outline" type={IconType.Ionicons} size={20} color={colors.primary} />
                    <CTText
                        color={colors.primary}
                        fontFamily={fonts.montserrat.semiBold}
                        style={styles.bottomSheetButtonTextStyle}
                    >
                        View Events
                    </CTText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.bottomSheetButtonStyle]} onPress={onViewResource}>
                    <Icon name="tennisball-outline" type={IconType.Ionicons} size={20} color={colors.primary} />
                    <CTText
                        color={colors.primary}
                        fontFamily={fonts.montserrat.semiBold}
                        style={styles.bottomSheetButtonTextStyle}
                    >
                        View Resource
                    </CTText>
                </TouchableOpacity>
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
            <MainHeader title="Participating Organizations" />
            <View style={styles.contentStyle}>
                <Loading />
                <OrganziationSearchOptionPanel query={query} onOpenFilter={onOpenFilter} />
                <View style={styles.listContainerStyle}>
                    <CTInfiniteFlatlist<SubClub>
                        style={styles.listStyle}
                        renderItem={renderItem}
                        totalCount={totalCount}
                        data={organizations}
                        isLoadMore={isLoadMore}
                        onLoadMore={onLoadMore}
                        isRefresh={isRefresh}
                        onRefresh={onRefresh}
                    />
                </View>
            </View>
            {selectedOrganization && (
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
    );
};

export default ParticipatingOrganizationsScreen;
