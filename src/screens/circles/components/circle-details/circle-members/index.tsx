import React, { useMemo } from 'react';
import { Circle, CircleMember } from '@services/models';
import { View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import { CIRCLE_MEMBER_STATUS } from '@shared/constants';
import CTInfiniteFlatlist from '@shared/components/controls/ct-infinite-flatlist';
import CircleMemberItem from '@screens/circles/circle-message/components/circlemember-item';

interface Props {
    circle: Circle;
}

const CircleMembers = ({ circle }: Props) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const getMembers = () => {
        return circle.members.sort((a, b) => {
            const aValue =
                a.status === CIRCLE_MEMBER_STATUS.REQUESTED ? 0 : a.status === CIRCLE_MEMBER_STATUS.APPROVED ? 1 : 2;
            const bValue =
                b.status === CIRCLE_MEMBER_STATUS.REQUESTED ? 0 : b.status === CIRCLE_MEMBER_STATUS.APPROVED ? 1 : 2;
            return aValue - bValue;
        });
    };

    const renderItem = ({ item }: { item: CircleMember; index?: number }) => (
        <CircleMemberItem
            isLeader={item.user?._id === circle.leader?._id}
            member={item}
            selected={false}
            showSelectSign={false}
            onPress={() => {}}
        />
    );

    return (
        <View style={styles.containerStyle}>
            <CTInfiniteFlatlist<CircleMember>
                style={styles.listStyle}
                renderItem={renderItem}
                totalCount={getMembers().length}
                data={getMembers()}
            />
        </View>
    );
};

export default CircleMembers;
