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
import { Post } from '@services/models';
import CTInfiniteFlatlist from '@shared/components/controls/ct-infinite-flatlist';
import PostItem from '@screens/posts/components/post-item';
import CPBottomSheet from '@shared/components/bootom-sheet';
import MyPostDetails from '@screens/posts/components/mypost-details';
import { useIsFocused } from '@react-navigation/native';
import CPCircleControls from '@shared/components/circle-controls';
import CTCircleButton from '@shared/components/controls/ct-circle-icon-button';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import AddNewPostModal from '@screens/posts/components/add-new-modal';

type MyPostsScreenProps = StackScreenProps<PostTabStackParamList, 'MyPosts'>;

const MyPostsScreen = ({}: MyPostsScreenProps) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user!);
    const club = useAppSelector((state) => state.club.club!);
    const isFocused = useIsFocused();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpenDetails, setIsOpenDetails] = useState<boolean>(false);
    const [isOpenNewPost, setIsOpenNewPost] = useState<boolean>(false);
    const [selectedPost, setSelectedPost] = useState<Post>();

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                club: club._id,
                author: user?._id,
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

    const toggleNewPost = () => {
        setIsOpenNewPost(!isOpenNewPost);
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

    const CircleButtons = () => (
        <CPCircleControls style={styles.addNewPostButtonStyle}>
            <CTCircleButton color={colors.secondary} size={60} onPress={toggleNewPost}>
                <Icon name="add" type={IconType.Ionicons} size={30} color={colors.dynamicWhite} />
            </CTCircleButton>
        </CPCircleControls>
    );

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
                {isOpenDetails && (
                    <MyPostDetails
                        post={selectedPost}
                        callback={() => {
                            setIsOpenDetails(false);
                            const newPosts = [...posts].filter((x) => x._id !== selectedPost?._id);
                            setPosts(newPosts);
                        }}
                    />
                )}
            </CPBottomSheet>
            <CircleButtons />
            <AddNewPostModal isOpen={isOpenNewPost} toggle={toggleNewPost} callback={fetchPosts} />
        </View>
    );
};

export default MyPostsScreen;
