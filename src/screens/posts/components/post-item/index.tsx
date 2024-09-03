import React, { useMemo } from 'react';
import { Post } from '@services/models';
import CTText from '@shared/components/controls/ct-text';
import { TouchableOpacity, View } from 'react-native';
import { getStyle } from '@shared/theme/themes';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from '../post-item/style';
import fonts from '@shared/theme/fonts';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import moment from 'moment';
import { htmlToString } from '@utils';

interface Props {
    post: Post;
    onPress: () => void;
}

const PostItem = ({ post, onPress }: Props) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.7} onPress={onPress}>
            <View style={getStyle(['row', 'align-items-center', 'justify-between'])}>
                <CTText h4 color={colors.text} fontFamily={fonts.montserrat.bold} style={styles.titleContainer}>
                    {post.title}
                </CTText>
                {post.category && (
                    <View style={styles.badgeContainer}>
                        <CTText size={9} fontFamily={fonts.montserrat.bold} color={colors.text}>
                            {post.category}
                        </CTText>
                    </View>
                )}
            </View>
            <CTText h5 color={colors.placeholder} style={getStyle('mt-8')} numberOfLines={3} ellipsizeMode="tail">
                {htmlToString(post.content)}
            </CTText>
            <View style={getStyle(['row', 'justify-between', 'align-items-center', 'mt-8'])}>
                <View style={getStyle(['row', 'justify-between', 'align-items-center'])}>
                    <Icon
                        name="chatbubble-ellipses-outline"
                        size={15}
                        type={IconType.Ionicons}
                        color={colors.iconPrimary}
                    />
                    <View style={getStyle('ml-8')}>
                        <CTText size={9} fontFamily={fonts.montserrat.bold} color={colors.text}>
                            {(post.adminCommentCount || 0) + (post.memberCommentCount || 0)} comments
                        </CTText>
                    </View>
                </View>
                <View style={getStyle(['row', 'justify-between', 'align-items-center'])}>
                    <Icon name="calendar-outline" size={15} type={IconType.Ionicons} color={colors.iconPrimary} />
                    <View style={getStyle('ml-8')}>
                        <CTText size={9} fontFamily={fonts.montserrat.bold} color={colors.text}>
                            {moment(post.createdAt).format('MMM DD, YYYY hh:mm a')}
                        </CTText>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};
export default PostItem;
