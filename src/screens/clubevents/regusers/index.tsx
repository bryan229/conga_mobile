import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import Header from '@navigation/components/main-header';
import CTText from '@shared/components/controls/ct-text';

const RegUsersScreen = () => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <View style={styles.containerStyle}>
            <Header title="Messages" />
            <CTText>Reg Users</CTText>
        </View>
    );
};

export default RegUsersScreen;
