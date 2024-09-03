import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Comment, Post } from '@services/models';
import CTText from '@shared/components/controls/ct-text';
import { TouchableOpacity, View } from 'react-native';
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
import CTButton from '@shared/components/controls/ct-button';
import AddCommentModal from './add-comment-modal';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import { AlertModalState } from '@services/types';
import CPAlertModal from '@shared/components/alert-modal';

interface Props {
    post?: Post;
    callback: () => void;
}

const MyPostDetails = ({ post, callback }: Props) => {
    const theme = useTheme();
    const { colors } = theme;
    const dispatch = useAppDispatch();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isOpenAlert, setIsOpenAlert] = useState<boolean>(false);
    const [alertData, setAlertData] = useState<AlertModalState>({ message: '' });
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

    const fetchComments = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                post: post?._id!,
                status: COMMENT_STATUS.ADDED,
            };
            const { data } = await PostApi.retrieveComments(params);
            setComments(data.filter((x: Comment) => x.commentUserType !== COMMENT_USERTYPE.ADVISOR));
        } catch (error) {
            dispatch(handleError(error));
        }
        setLoading(false);
    }, [post?._id]);

    useEffect(() => {
        if (post?._id) fetchComments();
    }, [post?._id]);

    if (!post) return null;

    const toggle = () => {
        setIsOpen(!isOpen);
    };

    const addNewComment = (comment: Comment) => {
        const newComments = [...comments, comment];
        setComments(newComments);
    };

    const onDeletePost = () => {
        showAlertModal({
            type: 'warning',
            title: 'Warning',
            message: 'Do you want to delete this post?',
            buttons: [
                {
                    type: 'ok',
                    label: 'Yes',
                    value: 'yes',
                },
                {
                    type: 'ok',
                    label: 'No',
                    value: 'no',
                },
            ],
            handler: async (value: string) => {
                if (value === 'no') return;
                setDeleteLoading(true);
                try {
                    const params = { _id: post._id };
                    await PostApi.delete(params);
                    callback();
                } catch (error) {
                    dispatch(handleError(error));
                }
                setDeleteLoading(false);
            },
        });
    };

    const onDeleteComment = (comment: Comment) => {
        showAlertModal({
            type: 'warning',
            title: 'Warning',
            message: 'Do you want to delete this comment?',
            buttons: [
                {
                    type: 'ok',
                    label: 'Yes',
                    value: 'yes',
                },
                {
                    type: 'ok',
                    label: 'No',
                    value: 'no',
                },
            ],
            handler: async (value: string) => {
                if (value === 'no') return;
                setLoading(true);
                try {
                    const params = { _id: comment._id };
                    await PostApi.deleteComment(params);
                    const newComments = [...comments].filter((x) => x._id !== comment._id);
                    setComments(newComments);
                } catch (error) {
                    dispatch(handleError(error));
                }
                setLoading(false);
            },
        });
    };

    const showAlertModal = (alrtData: AlertModalState) => {
        setIsOpenAlert(true);
        setAlertData(alrtData);
    };

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
                        <CTText h5 color={colors.text} fontFamily={fonts.montserrat.regular} style={getStyle('mb-8')}>
                            {htmlToString(post.content)}
                        </CTText>
                        <CTText size={8} color={colors.text} fontFamily={fonts.montserrat.bold} left>
                            {moment(post.createdAt).format('MMM DD, YYYY hh:mm A')}
                        </CTText>
                    </View>
                    {comments.map((x, index) => {
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
                                    <View style={getStyle(['row', 'align-items-center', 'justify-between', 'mb-8'])}>
                                        <View style={getStyle(['row', 'align-items-center'])}>
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
                                        {index === comments.length - 1 && (
                                            <TouchableOpacity onPress={() => onDeleteComment(x)}>
                                                <Icon
                                                    name="trash"
                                                    type={IconType.Ionicons}
                                                    size={20}
                                                    color={colors.danger}
                                                />
                                            </TouchableOpacity>
                                        )}
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
                    <View style={getStyle(['row', 'align-items-center', 'mt-8'])}>
                        <CTButton
                            title="Delete"
                            color={colors.secondary}
                            style={getStyle('col')}
                            onPress={onDeletePost}
                            loading={deleteLoading}
                        />
                        {comments.length > 0 && (
                            <CTButton title="Add Comment" style={getStyle(['col', 'ml-8'])} onPress={toggle} />
                        )}
                    </View>
                </ScrollView>
            </View>
            <AddCommentModal post={post} isOpen={isOpen} toggle={toggle} callback={addNewComment} />
            <CPAlertModal isVisible={isOpenAlert} toggle={() => setIsOpenAlert(false)} alertData={alertData} />
        </View>
    );
};
export default MyPostDetails;
