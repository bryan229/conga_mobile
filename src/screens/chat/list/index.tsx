import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import BackHeader from '@navigation/components/back-header';
import * as Progress from 'react-native-progress';
import { useIsFocused } from '@react-navigation/native';
import { useAppNavigation } from '@services/hooks/useNavigation';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { handleError } from '@store/actions';
import { ChatApi } from '@services/api';
import { ChatList, User } from '@services/models';
import CTInfiniteFlatlist from '@shared/components/controls/ct-infinite-flatlist';
import ChatListItem from '../components/chatlist-item';
import CPCircleControls from '@shared/components/circle-controls';
import CTCircleButton from '@shared/components/controls/ct-circle-icon-button';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import ReactNativeModal from 'react-native-modal';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import SearchMemberContent from '@shared/components/search-member-content';
import { getStyle } from '@shared/theme/themes';

const ChatListScreen = () => {
    const club = useAppSelector((state) => state.club.club!);
    const user = useAppSelector((state) => state.auth.user!);
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const { colors } = theme;
    const navigation = useAppNavigation();
    const isFocused = useIsFocused();
    const [chatList, setChatList] = useState<ChatList[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpenSearchMemberModal, setIsOpenSearchMemberModal] = useState<boolean>(false);

    const fetchChatList = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await ChatApi.retrieveList({});
            setChatList(data);
        } catch (error) {
            dispatch(handleError(error));
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (isFocused) fetchChatList();
    }, [isFocused]);

    const renderItem = ({ item }: { item: ChatList; index?: number }) => (
        <ChatListItem chatList={item} onPress={() => goChatRoom(item)} />
    );

    const goChatRoom = async (item: ChatList) => {
        await ChatApi.readUnReadChatList({ chatListId: item._id });
        navigation.navigate('ChatRoom', { partner: item.partnerId });
    };

    const toggle = () => {
        setIsOpenSearchMemberModal(!isOpenSearchMemberModal);
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
        <CPCircleControls style={styles.addNewChatButtonStyle}>
            <CTCircleButton color={colors.secondary} size={60} onPress={toggle}>
                <Icon name="add" type={IconType.Ionicons} size={30} color={colors.white} />
            </CTCircleButton>
        </CPCircleControls>
    );

    return (
        <View style={styles.containerStyle}>
            <BackHeader title="Chat" style={styles.headerStyle} />
            <View style={styles.listContainerStyle}>
                <Loading />
                <CTInfiniteFlatlist<ChatList>
                    style={styles.listStyle}
                    renderItem={renderItem}
                    totalCount={chatList.length}
                    data={chatList}
                />
            </View>
            <CircleButtons />
            <ReactNativeModal
                isVisible={isOpenSearchMemberModal}
                statusBarTranslucent={false}
                backdropOpacity={0.8}
                animationIn="slideInUp"
                animationInTiming={200}
                animationOut="slideOutDown"
                animationOutTiming={300}
                onBackdropPress={toggle}
            >
                <View style={styles.searchMemberModalContainer}>
                    <View style={getStyle(['row', 'justify-between', 'align-items-center', 'mb-16'])}>
                        <View />
                        <CTText h3 fontFamily={fonts.montserrat.bold} color={colors.text}>
                            Seach Members
                        </CTText>
                        <TouchableOpacity onPress={toggle}>
                            <Icon name="close" type={IconType.Ionicons} size={25} />
                        </TouchableOpacity>
                    </View>
                    <SearchMemberContent
                        style={styles.searchMemberContentStyle}
                        query={{ club: club._id }}
                        onResult={(value: User[]) => {
                            if (value[0]._id === user._id) return;
                            toggle();
                            navigation.navigate('ChatRoom', { partner: value[0] });
                        }}
                    />
                </View>
            </ReactNativeModal>
        </View>
    );
};

export default ChatListScreen;
