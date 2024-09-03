import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import BackHeader from '@navigation/components/back-header';
import CPAnimateButtonGroup from '@shared/components/button-animate-group';
import { ScreenWidth } from '@freakycoder/react-native-helpers';
import Availability from './availability';
import FindOpponents from './find';

const OpponentScreen = () => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [activeTab, setActiveTab] = useState<string>('Find');

    return (
        <View style={styles.containerStyle}>
            <BackHeader title="Opponents" style={styles.headerStyle} />
            <CPAnimateButtonGroup
                buttons={['Find', 'Availability']}
                onSelect={setActiveTab}
                activeBtn={activeTab}
                width={ScreenWidth - 32}
                style={styles.buttonGroupStyle}
            />
            {activeTab === 'Find' && <FindOpponents />}
            {activeTab === 'Availability' && <Availability />}
        </View>
    );
};

export default OpponentScreen;
