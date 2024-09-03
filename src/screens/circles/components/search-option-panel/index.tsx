import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import { getStyle } from '@shared/theme/themes';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import { useAppSelector } from '@store/hook';
import { CircleQuery } from '@services/types';

interface Props {
    query: CircleQuery;
    onOpenFilter: () => void;
}

const CircleSearchOptionPanel = ({ onOpenFilter, query }: Props) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const subClubs = useAppSelector((state) => state.club.subClubs);

    return (
        <View style={styles.container}>
            <View style={getStyle(['row', 'align-items-center', 'col', 'flex-wrap'])}>
                {(query.state || query.county || query.city) && (
                    <TouchableOpacity style={[styles.itemStyle, getStyle('mb-4')]} onPress={onOpenFilter}>
                        <CTText
                            fontFamily={fonts.montserrat.regular}
                            color={colors.primary}
                            style={getStyle(['py-8', 'px-16'])}
                        >
                            {[query.state, query.county, query.city].filter((x) => x).join(', ')}
                        </CTText>
                    </TouchableOpacity>
                )}
                {query.subClub && query.subClub !== 'all' && (
                    <TouchableOpacity style={styles.itemStyle} onPress={onOpenFilter}>
                        <CTText
                            fontFamily={fonts.montserrat.regular}
                            color={colors.primary}
                            style={getStyle(['py-8', 'px-16'])}
                        >
                            {subClubs.find((x) => x._id === query.subClub)?.name}
                        </CTText>
                    </TouchableOpacity>
                )}
            </View>
            <TouchableOpacity onPress={onOpenFilter}>
                <Icon type={IconType.Ionicons} name="search" size={25} color={colors.primary} />
            </TouchableOpacity>
        </View>
    );
};

export default CircleSearchOptionPanel;
