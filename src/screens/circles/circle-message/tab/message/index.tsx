import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { CircleMessage, ClubEvent, Schedule } from '@services/models';
import { CircleMessageApi, ClubEventApi, ScheduleApi } from '@services/api';
import { handleError, showAlertModal } from '@store/actions';
import { useIsFocused } from '@react-navigation/native';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import { CircleMessageStackParamList } from '@navigation/types';
import { StackScreenProps } from '@react-navigation/stack';
import CircleMessageItem from '../../components/circlemessage-item';
import CTButton from '@shared/components/controls/ct-button';
import { getStyle } from '@shared/theme/themes';
import CircleCommentModal from '../../components/comment-modal';
import MQTT, { IMqttClient } from 'sp-react-native-mqtt';
import { MQTT_CLIENT_TYPE, CIRCLE_STATUS } from '@shared/constants';
import { useAppNavigation } from '@services/hooks/useNavigation';
import CPBottomSheet from '@shared/components/bootom-sheet';
import ClubEventDetails from '@screens/clubevents/components/event-details';
import OpenScheduleDetails from '@screens/schedules/components/open-schedule-details';

let mqttClient: IMqttClient | null = null;

type ScreenProps = StackScreenProps<CircleMessageStackParamList, 'CircleMessageList'>;

const CircleMessageListScreen = ({ route }: ScreenProps) => {
    const user = useAppSelector((state) => state.auth.user!);
    const navigation = useAppNavigation();
    const isFocused = useIsFocused();
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { colors } = theme;
    const circle = route.params.circle;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [loading, setLoading] = useState<boolean>(false);
    const [messages, setMessages] = useState<CircleMessage[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<ClubEvent>();
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule>();
    const [isOpenEventOrScheduleDetails, setIsOpenEventOrScheduleDetails] = useState<boolean>(false);
    const dataRef = useRef<CircleMessage[]>([]);
    const [selectedMessage, setSelectMessage] = useState<CircleMessage>();
    const [isOpenCommentModal, setIsOpenCommentModal] = useState<boolean>(false);
    const flatListRef = useRef<FlatList>(null);
    const mqttTopic = circle._id;
    const mqttClientId = `${MQTT_CLIENT_TYPE.CIRCLE_MESSAGE}_${mqttTopic}_${user._id}`;
    let totalCount = 0;

    const LIMIT = 10;

    const fetchMessages = useCallback(
        async (skip: number) => {
            try {
                setLoading(true);
                const { data, totalCount: tc } = await CircleMessageApi.retrieve({
                    circle: circle?._id,
                    member: user?._id,
                    skip,
                    limit: LIMIT,
                });
                if (skip > 0 && dataRef.current.length > 0) {
                    dataRef.current = [...dataRef.current, ...data];
                } else dataRef.current = data;
                setMessages(dataRef.current);
                totalCount = tc;
                setLoading(false);
                showInitMessageOrComment();
            } catch (error) {
                setLoading(false);
                dispatch(handleError(error));
            }
        },
        [user?._id, circle?._id]
    );

    useEffect(() => {
        if (circle && user && isFocused) {
            fetchMessages(0);
            if (!mqttClient) connectMQTT();
        }
        return () => {
            if (mqttClient) {
                mqttClient.unsubscribe(mqttTopic);
                mqttClient?.disconnect();
                mqttClient = null;
            }
        };
    }, [user?._id, circle?._id, isFocused]);

    if (!circle) return null;

    const showInitMessageOrComment = () => {
        if (route.params.messageId) {
            const index = dataRef.current.findIndex((x) => x._id === route.params.messageId);
            if (index < 0) return;
            setTimeout(() => {
                if (flatListRef.current) flatListRef.current?.scrollToIndex({ index, animated: true });
            }, 300);
            if (route.params.commentId) {
                setTimeout(() => {
                    setSelectMessage(dataRef.current[index]);
                    setIsOpenCommentModal(true);
                }, 500);
            }
        }
    };

    const connectMQTT = async () => {
        if (circle.status !== CIRCLE_STATUS.ACTIVATED) return;
        try {
            mqttClient = await MQTT.createClient({
                uri: `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`,
                clientId: mqttClientId,
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
                        const { clientType, data: msgData } = JSON.parse(msg.data);
                        if (clientType !== MQTT_CLIENT_TYPE.CIRCLE_MESSAGE) return;
                        const { type, data } = msgData;
                        if (type === 'comment') {
                            const { messageId, ...newComment } = data;
                            const newMessages = [...dataRef.current];
                            const index = newMessages.findIndex((x) => x._id === messageId);
                            const newMessage = newMessages[index];
                            newMessage.comments.push(newComment);
                            newMessage.totalComments += 1;
                            newMessages.splice(index, 1, newMessage);
                            dataRef.current = newMessages;
                            setMessages(newMessages);
                        } else {
                            const message = data;
                            const newMessages = [...dataRef.current];
                            const index = newMessages.findIndex((x) => x._id === message._id);
                            if (index < 0) {
                                newMessages.unshift(message);
                                dataRef.current = newMessages;
                                setMessages(newMessages);
                                totalCount += 1;
                            }
                        }
                    }
                });

                mqttClient.on('connect', function () {
                    console.log('connected');
                    mqttClient?.subscribe(mqttTopic, 0);
                });

                mqttClient.connect();
            }
        } catch (error) {
            console.log('error----', error);
        }
    };

    const onRegEvent = async (item: CircleMessage) => {
        if (!item.eventId) return;
        try {
            setLoading(true);
            const { data } = await ClubEventApi.read({ _id: item.eventId });
            if (data) {
                setSelectedEvent(data);
                setIsOpenEventOrScheduleDetails(true);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            dispatch(handleError(error));
        }
    };

    const onRegSchedule = async (item: CircleMessage) => {
        if (!item.schedule) return;

        try {
            setLoading(true);
            const { data } = await ScheduleApi.read({
                _id: item.schedule._id,
            });
            if (data) {
                setSelectedSchedule(data);
                setIsOpenEventOrScheduleDetails(true);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            dispatch(handleError(error));
        }
    };

    const onLoadMore = () => {
        if (loading) return;
        fetchMessages(messages.length);
    };

    const goNewMessage = () => {
        if (circle.status !== CIRCLE_STATUS.ACTIVATED)
            dispatch(
                showAlertModal({
                    type: 'warning',
                    title: 'Warning',
                    message: `This circle has been ${circle.status}`,
                })
            );
        else navigation.navigate('NewMessage', { circle });
    };

    const renderItem = ({ item }: { item: CircleMessage; index?: number }) => (
        <CircleMessageItem
            message={item}
            onAddComment={() => {
                if (circle.status !== CIRCLE_STATUS.ACTIVATED)
                    dispatch(
                        showAlertModal({
                            type: 'warning',
                            title: 'Warning',
                            message: `This circle has been ${circle.status}`,
                        })
                    );
                else {
                    setSelectMessage(item);
                    setIsOpenCommentModal(true);
                }
            }}
            onCreateEvent={() => navigation.navigate('CreateNewEvent', { circleMessage: item })}
            onEditEvent={() => {
                if (item.eventId) navigation.navigate('EditClubEvent', { eventId: item.eventId });
            }}
            onRegEvent={() => onRegEvent(item)}
            onGoSchedule={() => navigation.navigate('MySchedules')}
            onRegSchedule={() => onRegSchedule(item)}
        />
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
        <View style={styles.containerStyle}>
            <View style={styles.listContainerStyle}>
                <Loading />
                {totalCount > messages.length && (
                    <TouchableOpacity style={styles.loadMoreContainer} onPress={onLoadMore}>
                        <CTText fontFamily={fonts.montserrat.regular} size={12} center>
                            Load More...
                        </CTText>
                    </TouchableOpacity>
                )}
                {messages.length > 0 && (
                    <FlatList<CircleMessage>
                        style={styles.listStyle}
                        renderItem={renderItem}
                        ref={flatListRef}
                        data={messages}
                        inverted
                    />
                )}
            </View>
            <View style={styles.newMessageBtnContainer}>
                <CTButton style={getStyle(['row', 'justify-center', 'align-items-center'])} onPress={goNewMessage}>
                    <Icon type={IconType.Ionicons} name="paper-plane-outline" color={colors.white} />
                    <CTText fontFamily={fonts.montserrat.regular} bold color={colors.white} style={getStyle('ml-8')}>
                        Send New Message
                    </CTText>
                </CTButton>
            </View>
            <CircleCommentModal
                isOpen={isOpenCommentModal}
                message={selectedMessage}
                toggle={() => setIsOpenCommentModal(false)}
                callback={(data) => {
                    const { messageId, newComment } = data;
                    const payload = {
                        clientType: MQTT_CLIENT_TYPE.CIRCLE_MESSAGE,
                        data: { type: 'comment', data: { messageId, ...newComment } },
                    };
                    mqttClient?.publish(mqttTopic, JSON.stringify(payload), 0, false);
                }}
            />
            <CPBottomSheet
                isVisible={isOpenEventOrScheduleDetails}
                toggle={() => setIsOpenEventOrScheduleDetails(false)}
            >
                {selectedEvent && (
                    <ClubEventDetails
                        event={selectedEvent}
                        callBack={() => {
                            setIsOpenEventOrScheduleDetails(false);
                            fetchMessages(0);
                        }}
                        toggle={() => setIsOpenEventOrScheduleDetails(false)}
                        showCircleMsgOption={false}
                    />
                )}
                {selectedSchedule && (
                    <OpenScheduleDetails
                        schedule={selectedSchedule}
                        callback={() => {
                            setIsOpenEventOrScheduleDetails(false);
                            fetchMessages(0);
                        }}
                    />
                )}
            </CPBottomSheet>
        </View>
    );
};

export default CircleMessageListScreen;
