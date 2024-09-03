import { CPStyleProp } from '@services/types';
import fonts from '@shared/theme/fonts';
import React, { useMemo } from 'react';
import { useTheme } from '@services/hooks/useTheme';
import { FlatList, View } from 'react-native';
import CTText from '../ct-text';
import createStyle from './style';
export interface CTInfiniteFlatListProps<T> {
    style?: CPStyleProp;
    data: T[];
    isLoadMore?: boolean;
    isRefresh?: boolean;
    totalCount?: number;
    renderItem: ({ item, index }: { item: T; index?: number }) => React.ReactElement | null;
    onLoadMore?: () => void;
    onRefresh?: () => void;
    inverted?: boolean;
}

const CTInfiniteFlatlist = <T,>(props: CTInfiniteFlatListProps<T>) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyle(theme), [theme]);

    const {
        style,
        data,
        totalCount = props.data.length,
        isLoadMore = false,
        isRefresh = false,
        renderItem,
        onLoadMore,
        inverted = false,
    } = props;

    const LoadMore = () => {
        if (!isLoadMore) return null;
        return (
            <CTText center fontFamily={fonts.montserrat.bold} style={styles.loadMoreTextStyle}>
                Loading...
            </CTText>
        );
    };

    const onEndReached = async () => {
        if (isLoadMore || totalCount <= data.length) return;
        if (onLoadMore) onLoadMore();
    };

    const onRefresh = React.useCallback(async () => {
        if (isRefresh) return;
        if (props.onRefresh) props.onRefresh();
    }, [isRefresh]);

    return (
        <View style={[styles.container, style]}>
            <FlatList<T>
                style={styles.listStyle}
                data={data || []}
                renderItem={renderItem}
                onEndReachedThreshold={0.3}
                onEndReached={onEndReached}
                refreshing={isRefresh}
                onRefresh={onRefresh}
                ListFooterComponent={() => <LoadMore />}
                inverted={inverted}
            />
        </View>
    );
};

export default CTInfiniteFlatlist;
