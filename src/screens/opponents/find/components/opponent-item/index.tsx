import React, { useMemo } from 'react';
import { User } from '@services/models';
import { View } from 'react-native';
import CTText from '@shared/components/controls/ct-text';
import * as Progress from 'react-native-progress';
import createStyles from './style';
import { useTheme } from '@services/hooks/useTheme';
import { getStyle } from '@shared/theme/themes';
import CPAvatar from '@shared/components/avatar';
import fonts from '@shared/theme/fonts';
import { LEVEL_TYPE, LevelTypes } from '@shared/constants';
import { TouchableOpacity } from 'react-native';

interface Props {
    loading?: boolean;
    opponent: User;
    onPress: () => void;
}

const OpponentItem = ({ opponent, onPress, loading }: Props) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={getStyle(['row', 'align-items-center'])}>
                <CPAvatar source={opponent.photoUrl} name={opponent.fullName} size={40} />
                <View style={getStyle('ml-8')}>
                    <CTText color={colors.text} fontFamily={fonts.montserrat.bold}>
                        {opponent.fullName}
                    </CTText>
                    {!!opponent.gameLevel && !!opponent.levelType && (
                        <CTText color={colors.darkGray} size={9} style={getStyle('mt-4')}>
                            {LevelTypes[opponent.levelType || LEVEL_TYPE.USTA]} {opponent.gameLevel}
                        </CTText>
                    )}
                </View>
            </View>
            {loading && (
                <Progress.Circle
                    size={20}
                    indeterminate={loading}
                    color="white"
                    borderWidth={3}
                    borderColor={colors.primary}
                />
            )}
        </TouchableOpacity>
    );
};

export default OpponentItem;
