import React, { useMemo } from 'react';
import { useTheme } from '@services/hooks/useTheme';
import * as Progress from 'react-native-progress';
import createStyles from './style';
import ReactNativeModal from 'react-native-modal';
import { useAppSelector } from '@store/hook';

const CPFullLoading: React.FC = () => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const loading = useAppSelector((state) => state.ui.loading);
    const { colors } = theme;

    return (
        <ReactNativeModal isVisible={loading} backdropOpacity={0.1} animationIn="fadeIn" animationOut="fadeOut">
            <Progress.Circle
                style={styles.loadingStyle}
                size={25}
                indeterminate={loading}
                color="white"
                borderWidth={3}
                borderColor={colors.primary}
            />
        </ReactNativeModal>
    );
};

export default CPFullLoading;
