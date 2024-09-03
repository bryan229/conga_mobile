import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MQTT, { IMqttClient } from 'sp-react-native-mqtt';
import * as Progress from 'react-native-progress';
import { KeyboardAvoidingView, Platform, TextInput, View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { MQTT_CLIENT_TYPE, MSGCONTENT_TYPE } from '@shared/constants';
import { ChatMessage, User } from '@services/models';
import CTInfiniteFlatlist from '@shared/components/controls/ct-infinite-flatlist';
import ChatMessageItem from '../components/chatmessage-item';
import { handleError } from '@store/actions';
import { ChatApi } from '@services/api';
import moment from 'moment';
import { getChatTopic } from '@utils';
import { TouchableOpacity } from 'react-native';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import { getStyle } from '@shared/theme/themes';
import BackHeader from '@navigation/components/back-header';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/types';

type ScreneProps = StackScreenProps<RootStackParamList, 'ChatRoom'>;

let mqttClient: IMqttClient | null = null;

const ChatRoomScreen = ({ route }: ScreneProps) => {
    const user = useAppSelector((state) => state.auth.user!);
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isLoadMore, setIsLoadMore] = useState<boolean>(false);
    const [msgText, setMsgText] = useState<string>('');
    const [msgTextBoxHeight, setMsgTextBoxHeight] = useState<number>(0);
    const dataRef = useRef<ChatMessage[]>([]);
    const partner: User = route.params.partner as User;
    const clientId = `${MQTT_CLIENT_TYPE.CHAT}_${user._id}`;
    const mqttTopic = getChatTopic(user._id, partner._id);

    const fetchMessages = useCallback(async (displayLoading?: boolean) => {
        if (displayLoading) setLoading(true);
        try {
            const { data } = await ChatApi.retrieveMessages({ partnerId: partner._id });
            if (data.length > 0) {
                dataRef.current = data
                    .map((x: any, index: number) => {
                        return {
                            ...x,
                            showDateGroup:
                                index === 0 ||
                                moment(data[index - 1].createdAt).format('YYYY-MM-DD') !==
                                    moment(data[index].createdAt).format('YYYY-MM-DD'),
                        };
                    })
                    .reverse();
                setMessages(dataRef.current);
            }
            if (!mqttClient) connectMQTT(data.length === 0);
        } catch (error) {
            dispatch(handleError(error));
        }
        if (displayLoading) setLoading(false);
    }, []);

    useEffect(() => {
        if (partner?._id) fetchMessages(true);
        return () => {
            if (mqttClient) {
                mqttClient.unsubscribe(mqttTopic);
                mqttClient?.disconnect();
                mqttClient = null;
            }
        };
    }, []);

    const connectMQTT = async (shouldSendFirstMsg: boolean) => {
        try {
            mqttClient = await MQTT.createClient({
                uri: `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`,
                clientId,
                keepalive: 60,
                protocolLevel: 3,
                user: process.env.MQTT_USERNAME,
                pass: process.env.MQTT_PASSWORD,
            });
            if (mqttClient) {
                mqttClient.on('closed', function () {
                    console.log('mqtt.event.closed');
                });

                mqttClient.on('error', function (msg) {
                    console.log('mqtt.event.error', msg);
                });

                mqttClient.on('message', function (msg) {
                    if (msg.topic === mqttTopic && msg.data) {
                        const { clientType, data } = JSON.parse(msg.data);
                        if (clientType === MQTT_CLIENT_TYPE.CHAT)
                            addMessage({ ...data, createdAt: new Date(), msgType: data.userId !== user._id });
                    }
                });

                mqttClient.on('connect', function () {
                    console.log('connected');
                    mqttClient?.subscribe(mqttTopic, 0);
                    if (shouldSendFirstMsg)
                        sendMessage(
                            `Hello. ${partner.fullName}. \nI'm ${user.fullName}. \n I'd like to add you on my chat list.`
                        );
                });

                mqttClient.connect();
            }
        } catch (error) {
            console.log('error----', error);
        }
    };

    const sendMessage = (text: string) => {
        const message = {
            msg: text,
            userId: user._id,
            partnerId: partner._id,
            contentType: MSGCONTENT_TYPE.TEXT,
        };
        const payload = { clientType: MQTT_CLIENT_TYPE.CHAT, data: message };
        mqttClient?.publish(mqttTopic, JSON.stringify(payload), 0, false);
    };

    const addMessage = (message: ChatMessage) => {
        const newMessages = [...dataRef.current];
        if (newMessages.length > 0) {
            const latestMsgDate = moment(newMessages[0].createdAt).format('YYYY-MM-DD');
            const msgDate = moment(message.createdAt).format('YYYY-MM-DD');
            newMessages.unshift({ ...message, showDateGroup: latestMsgDate !== msgDate });
        } else {
            newMessages.push({ ...message, showDateGroup: true });
        }
        dataRef.current = newMessages;
        setMessages(dataRef.current);
    };

    const onLoadMore = async () => {
        setIsLoadMore(true);
        await fetchMessages();
        setIsLoadMore(false);
    };

    if (!partner) return null;

    const renderItem = ({ item }: { item: ChatMessage; index?: number }) => (
        <ChatMessageItem message={item} user={user} partner={partner} />
    );

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
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={getStyle('col')}>
            <View style={styles.containerStyle}>
                <BackHeader
                    titleComponent={
                        <CTText h2 color={colors.text} fontFamily={fonts.montserrat.bold}>
                            {partner.fullName}
                        </CTText>
                    }
                    style={styles.headerStyle}
                />
                <View style={styles.listContainerStyle}>
                    <Loading />
                    <CTInfiniteFlatlist<ChatMessage>
                        style={styles.listStyle}
                        renderItem={renderItem}
                        totalCount={messages.length}
                        data={messages}
                        isLoadMore={isLoadMore}
                        onLoadMore={onLoadMore}
                        inverted
                    />
                </View>
                <View style={styles.messageBoxContainer}>
                    <TextInput
                        style={[styles.messageTextStyle, { height: Math.max(40, msgTextBoxHeight) }]}
                        placeholder="Type a message"
                        onChangeText={setMsgText}
                        onContentSizeChange={(event) => setMsgTextBoxHeight(event.nativeEvent.contentSize.height)}
                        value={msgText}
                        multiline={true}
                        numberOfLines={0}
                        keyboardType="default"
                        selectionColor={'green'}
                        placeholderTextColor={colors.placeholder}
                    />
                    <TouchableOpacity
                        style={getStyle(['pl-16', 'py-8'])}
                        disabled={!msgText}
                        onPress={() => {
                            sendMessage(msgText);
                            setMsgText('');
                        }}
                    >
                        <Icon
                            name="paper-plane"
                            type={IconType.Ionicons}
                            size={25}
                            color={msgText ? colors.primary : colors.darkGray}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default ChatRoomScreen;
