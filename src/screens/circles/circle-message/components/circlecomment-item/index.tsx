import { useTheme } from '@services/hooks/useTheme';
import { CircleComment } from '@services/models';
import CTText from '@shared/components/controls/ct-text';
import createStyles from './style';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import fonts from '@shared/theme/fonts';
import moment from 'moment';
import { getStyle } from '@shared/theme/themes';
import CPAvatar from '@shared/components/avatar';

interface Props {
    comment: CircleComment;
}

const CircleCommentItem = ({ comment }: Props) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <View style={styles.container}>
            <View style={getStyle(['row'])}>
                <CPAvatar size={25} source={comment.user.photoUrl} name={comment.user.fullName} />
                <View style={getStyle(['col', 'ml-8'])}>
                    <View style={getStyle(['row', 'align-items-center', 'justify-between'])}>
                        <CTText
                            fontFamily={fonts.montserrat.regular}
                            color={colors.text}
                            bold
                            style={getStyle('mb-4')}
                            size={12}
                        >
                            {comment.user.fullName}
                        </CTText>
                        <CTText fontFamily={fonts.montserrat.regular} size={10} color={colors.darkGray}>
                            {moment(comment.createdAt).format('ddd, MMM DD, h:mm A')}
                        </CTText>
                    </View>
                    <CTText fontFamily={fonts.montserrat.regular} color={colors.text} size={11}>
                        {comment.message}
                    </CTText>
                </View>
            </View>
        </View>
    );
};

export default CircleCommentItem;
