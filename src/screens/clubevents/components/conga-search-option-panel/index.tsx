import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import { getStyle } from '@shared/theme/themes';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import { getFilterDateRangeLabel } from '@utils';
import { useAppSelector } from '@store/hook';

interface Props {
    onOpenFilter: () => void;
}

const HotEventSearchOptionPanel = ({ onOpenFilter }: Props) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const userLocation = useAppSelector((state) => state.auth.location);
    const subClubs = useAppSelector((state) => state.club.subClubs);
    const query = useAppSelector((state) => state.clubEvent.congaClubEventQuery);

    return (
        <View style={styles.container}>
            <View style={getStyle(['row', 'align-items-center', 'col', 'flex-wrap'])}>
                <TouchableOpacity style={[styles.itemStyle, getStyle('mb-4')]} onPress={onOpenFilter}>
                    <CTText
                        fontFamily={fonts.montserrat.regular}
                        color={colors.primary}
                        style={getStyle(['py-8', 'px-16'])}
                    >
                        {getFilterDateRangeLabel(query.dateRange)}
                    </CTText>
                </TouchableOpacity>
                {query.onlyMyCicle && (
                    <TouchableOpacity style={[styles.itemStyle, getStyle('mb-4')]} onPress={onOpenFilter}>
                        <CTText
                            fontFamily={fonts.montserrat.regular}
                            color={colors.primary}
                            style={getStyle(['py-8', 'px-16'])}
                        >
                            Only My Circle
                        </CTText>
                    </TouchableOpacity>
                )}
                {((userLocation && query.aroundMe) ||
                    (query.address && (query.state || query.county || query.city))) && (
                    <TouchableOpacity style={[styles.itemStyle, getStyle('mb-4')]} onPress={onOpenFilter}>
                        <CTText
                            fontFamily={fonts.montserrat.regular}
                            color={colors.primary}
                            style={getStyle(['py-8', 'px-16'])}
                        >
                            {query.radius} Miles{' '}
                            {query.aroundMe ? 'around me' : `from ${query.city || query.county || query.state}`}
                        </CTText>
                    </TouchableOpacity>
                )}
                {query.eventType && (
                    <TouchableOpacity style={styles.itemStyle} onPress={onOpenFilter}>
                        <CTText
                            fontFamily={fonts.montserrat.regular}
                            color={colors.primary}
                            style={getStyle(['py-8', 'px-16'])}
                        >
                            {query.eventType}
                        </CTText>
                    </TouchableOpacity>
                )}
                {query.organization && (
                    <TouchableOpacity style={styles.itemStyle} onPress={onOpenFilter}>
                        <CTText
                            fontFamily={fonts.montserrat.regular}
                            color={colors.primary}
                            style={getStyle(['py-8', 'px-16'])}
                        >
                            {subClubs.find((x) => x._id === query.organization)?.name}
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

export default HotEventSearchOptionPanel;
