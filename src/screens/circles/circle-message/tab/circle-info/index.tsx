import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import { useAppSelector } from '@store/hook';
import { StackScreenProps } from '@react-navigation/stack';
import { CircleMessageStackParamList } from '@navigation/types';
import CPAnimateButtonGroup from '@shared/components/button-animate-group';
import { ScreenWidth } from '@freakycoder/react-native-helpers';
import CircleMembers from './circle-members';
import OwnerCircleInfo from './owner-circleinfo';
import MemberCircleInfo from './member-circleinfo';

type ScreenProps = StackScreenProps<CircleMessageStackParamList, 'CircleInfo'>;

const CircleInfoScreen = ({ route }: ScreenProps) => {
    const user = useAppSelector((state) => state.auth.user!);
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const circle = route.params.circle;
    const isOwnCircle = circle.leader._id === user._id;
    const [activeTab, setActiveTab] = useState<string>(isOwnCircle ? 'Members' : 'Circle Info');

    return (
        <View style={styles.containerStyle}>
            <CPAnimateButtonGroup
                buttons={['Members', 'Circle Info']}
                onSelect={setActiveTab}
                activeBtn={activeTab}
                width={ScreenWidth - 32}
                style={styles.buttonGroupStyle}
            />
            {activeTab === 'Circle Info' && (
                <>{isOwnCircle ? <OwnerCircleInfo circle={circle} /> : <MemberCircleInfo circle={circle} />}</>
            )}
            {activeTab === 'Members' && <CircleMembers circle={circle} />}
        </View>
    );
};

export default CircleInfoScreen;
