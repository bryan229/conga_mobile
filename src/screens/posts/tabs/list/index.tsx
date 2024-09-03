import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useAppDispatch, useAppSelector } from '@store/hook';
import * as Progress from 'react-native-progress';
import { useTheme } from '@services/hooks/useTheme';
import { StackScreenProps } from '@react-navigation/stack';
import { PostTabStackParamList } from '@navigation/types';
import createStyles from './style';
import { PostApi } from '@services/api';
import { handleError } from '@store/actions/ui';
import { POST_STATUS } from '@shared/constants';
import { Post } from '@services/models';
import CTInfiniteFlatlist from '@shared/components/controls/ct-infinite-flatlist';
import PostItem from '@screens/posts/components/post-item';
import CPBottomSheet from '@shared/components/bootom-sheet';
import PostDetails from '@screens/posts/components/post-details';
import { useIsFocused } from '@react-navigation/native';

type PostsScreenProps = StackScreenProps<PostTabStackParamList, 'Posts'>;

const PostsScreen: React.FC<PostsScreenProps> = () => {
    const dispatch = useAppDispatch();
    const club = useAppSelector((state) => state.club.club!);
    const isFocused = useIsFocused();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpenDetails, setIsOpenDetails] = useState<boolean>(false);
    const [selectedPost, setSelectedPost] = useState<Post>();

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                club: club._id,
                status: POST_STATUS.PUBLISHED,
            };
            const { data } = await PostApi.retrieve(params);
            setPosts(data);
        } catch (error) {
            dispatch(handleError(error));
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (isFocused) fetchPosts();
    }, [isFocused]);

    const renderItem = ({ item }: { item: Post; index?: number }) => {
        return (
            <PostItem
                post={item}
                onPress={() => {
                    setSelectedPost(item);
                    setIsOpenDetails(true);
                }}
            />
        );
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
        <View style={styles.containerStyle}>
            <View style={styles.listContainerStyle}>
                <Loading />
                <CTInfiniteFlatlist<Post>
                    style={styles.listStyle}
                    renderItem={renderItem}
                    totalCount={posts.length}
                    data={posts}
                />
            </View>
            <CPBottomSheet isVisible={isOpenDetails} toggle={() => setIsOpenDetails(false)}>
                {isOpenDetails && <PostDetails post={selectedPost} />}
            </CPBottomSheet>
        </View>
    );
};

export default PostsScreen;
