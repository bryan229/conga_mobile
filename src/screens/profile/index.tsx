import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import createStyles from './style';
import { useTheme } from '@services/hooks/useTheme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/types';
import BackHeader from '@navigation/components/back-header';
import CPAnimateButtonGroup from '@shared/components/button-animate-group';
import { ScreenWidth } from '@freakycoder/react-native-helpers';
import Profile from './profileInfo';
import Availability from './availability';
import { useAppSelector } from '@store/hook';
import { CLUB_TYPE } from '@shared/constants';

type ProfileScreenProps = StackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen: React.FC<ProfileScreenProps> = () => {
    const club = useAppSelector((state) => state.club.club);
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [activeTab, setActiveTab] = useState<string>('Profile');

    const isVirtualClub = () => {
        return club?.type === CLUB_TYPE.VIRTUAL;
    };

    return (
        <View style={styles.containerStyle}>
            <BackHeader title="Profile" style={styles.headerStyle} />
            {!isVirtualClub && (
                <CPAnimateButtonGroup
                    buttons={['Profile', 'Availability']}
                    onSelect={setActiveTab}
                    activeBtn={activeTab}
                    width={ScreenWidth - 32}
                    style={styles.buttonGroupStyle}
                />
            )}
            {activeTab === 'Profile' && <Profile />}
            {activeTab === 'Availability' && <Availability />}
        </View>
    );
};

export default ProfileScreen;
