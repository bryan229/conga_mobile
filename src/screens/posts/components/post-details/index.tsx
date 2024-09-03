import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Comment, Post } from '@services/models';
import CTText from '@shared/components/controls/ct-text';
import { View } from 'react-native';
import * as Progress from 'react-native-progress';
import { getStyle } from '@shared/theme/themes';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from '../post-details/style';
import fonts from '@shared/theme/fonts';
import moment from 'moment';
import { ScrollView } from 'react-native';
import { COMMENT_STATUS, COMMENT_USERTYPE } from '@shared/constants';
import { PostApi } from '@services/api';
import { useAppDispatch } from '@store/hook';
import { handleError } from '@store/actions';
import { htmlToString } from '@utils';
import CPAvatar from '@shared/components/avatar';

interface Props {
    post?: Post;
}

const PostDetails = ({ post }: Props) => {
    const theme = useTheme();
    const { colors } = theme;
    const dispatch = useAppDispatch();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchComments = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                post: post?._id!,
                status: COMMENT_STATUS.ADDED,
            };
            const { data } = await PostApi.retrieveComments(params);
            setComments(data);
        } catch (error) {
            dispatch(handleError(error));
        }
        setLoading(false);
    }, [post?._id]);

    useEffect(() => {
        if (post?._id) fetchComments();
    }, [post?._id]);

    if (!post) return null;

    const Loading = () => {
        if (!loading) return null;
        return (
            <View style={styles.loadingContainerStyle}>
                <Progress.Circle
                    size={25}
                    indeterminate={loading}
                    color="white"
                    borderWidth={3}
                    borderColor={colors.primary}
                />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={getStyle(['row', 'align-items-center', 'justify-between', 'mb-16'])}>
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
            <View style={styles.listContainerStyle}>
                <Loading />
                <ScrollView style={styles.listStyle}>
                    <View style={[styles.contentContainer, getStyle('mr-16')]}>
                        {!post.hideAuthor && (
                            <View style={getStyle(['row', 'align-items-center', 'mb-8'])}>
                                <CPAvatar source={post.author.photoUrl} name={post.author.fullName} size={25} />
                                <CTText
                                    size={9}
                                    color={colors.text}
                                    fontFamily={fonts.montserrat.bold}
                                    style={getStyle('ml-8')}
                                >
                                    {post.author.fullName}
                                </CTText>
                            </View>
                        )}
                        <CTText h5 color={colors.text} fontFamily={fonts.montserrat.regular} style={getStyle('mb-8')}>
                            {htmlToString(post.content)}
                        </CTText>
                        <CTText size={8} color={colors.text} fontFamily={fonts.montserrat.bold} left>
                            {moment(post.createdAt).format('MMM DD, YYYY hh:mm A')}
                        </CTText>
                    </View>
                    {comments.map((x) => {
                        if (x.commentUserType === COMMENT_USERTYPE.CLUB)
                            return (
                                <View style={[styles.contentContainer, getStyle('ml-16')]} key={x._id}>
                                    <View style={getStyle(['row', 'align-items-center', 'justify-end', 'mb-8'])}>
                                        <CTText
                                            size={9}
                                            color={colors.text}
                                            fontFamily={fonts.montserrat.bold}
                                            style={getStyle('mr-8')}
                                        >
                                            {x.commentClub.displayName}
                                        </CTText>
                                        <CPAvatar
                                            source={x.commentClub.logoUrl}
                                            name={x.commentClub.displayName}
                                            size={25}
                                        />
                                    </View>
                                    <CTText
                                        h5
                                        color={colors.text}
                                        fontFamily={fonts.montserrat.regular}
                                        style={getStyle('mb-8')}
                                    >
                                        {htmlToString(x.content)}
                                    </CTText>
                                    <CTText size={8} color={colors.text} fontFamily={fonts.montserrat.bold} right>
                                        {moment(x.createdAt).format('MMM DD, YYYY hh:mm A')}
                                    </CTText>
                                </View>
                            );
                        if (x.commentUserType === COMMENT_USERTYPE.MEMBER)
                            return (
                                <View style={[styles.contentContainer, getStyle('mr-16')]} key={x._id}>
                                    <View style={getStyle(['row', 'align-items-center', 'mb-8'])}>
                                        <CPAvatar
                                            source={x.commentMember.photoUrl}
                                            name={x.commentMember.fullName}
                                            size={25}
                                        />
                                        <CTText
                                            size={9}
                                            color={colors.text}
                                            fontFamily={fonts.montserrat.bold}
                                            style={getStyle('ml-8')}
                                        >
                                            {x.commentMember.fullName}
                                        </CTText>
                                    </View>
                                    <CTText
                                        h5
                                        color={colors.text}
                                        fontFamily={fonts.montserrat.regular}
                                        style={getStyle('mb-8')}
                                    >
                                        {htmlToString(x.content)}
                                    </CTText>
                                    <CTText size={8} color={colors.text} fontFamily={fonts.montserrat.bold} left>
                                        {moment(x.createdAt).format('MMM DD, YYYY hh:mm A')}
                                    </CTText>
                                </View>
                            );
                        return null;
                    })}
                </ScrollView>
            </View>
        </View>
    );
};
export default PostDetails;
