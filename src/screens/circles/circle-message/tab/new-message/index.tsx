import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { Circle, CircleMember, FacilityResource } from '@services/models';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import CTInfiniteFlatlist from '@shared/components/controls/ct-infinite-flatlist';
import { StackScreenProps } from '@react-navigation/stack';
import { CircleMessageStackParamList } from '@navigation/types';
import CircleMemberItem from '../../components/circlemember-item';
import { getStyle } from '@shared/theme/themes';
import { CircleApi, CircleMessageApi, ResourceApi } from '@services/api';
import { handleError } from '@store/actions';
import { useIsFocused } from '@react-navigation/native';
import MQTT, { IMqttClient } from 'sp-react-native-mqtt';
import { MQTT_CLIENT_TYPE, CIRCLE_MEMBER_STATUS } from '@shared/constants';
import ResourceItem from './components/resource-item';
import CTButton from '@shared/components/controls/ct-button';
import { useAppNavigation } from '@services/hooks/useNavigation';

let mqttClient: IMqttClient | null = null;

type ScreenProps = StackScreenProps<CircleMessageStackParamList, 'NewMessage'>;

const NewCircleMessageScreen = ({ route }: ScreenProps) => {
    const user = useAppSelector((state) => state.auth.user!);
    const dispatch = useAppDispatch();
    const navigation = useAppNavigation();
    const isFocused = useIsFocused();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [loading, setLoading] = useState<boolean>(false);
    const [circle, setCircle] = useState<Circle>();
    const [resource, setResource] = useState<FacilityResource>();
    const [msgText, setMsgText] = useState<string>('');
    const [msgTextBoxHeight, setMsgTextBoxHeight] = useState<number>(0);
    const [members, setMembers] = useState<CircleMember[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<CircleMember[]>([]);
    const resourceId = route.params.resourceId;
    const mqttTopic = route.params.circle._id;
    const mqttClientId = `${MQTT_CLIENT_TYPE.CIRCLE_MESSAGE}_${mqttTopic}_${user._id}`;

    const fetchCircle = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await CircleApi.read({ _id: route.params.circle._id });
            setCircle(data as Circle);
            setMembers(
                (data as Circle).members.filter(
                    (x) => x.status === CIRCLE_MEMBER_STATUS.APPROVED && x.user?._id !== user?._id
                )
            );
            if (!mqttClient) connectMQTT();
            if (resourceId && !resource) {
                const { data: resource } = await ResourceApi.read({ _id: resourceId });
                setResource(resource);
            }
            setLoading(false);
        } catch (error) {
            dispatch(handleError(error));
            setLoading(false);
        }
    }, [route.params.circle._id]);

    useEffect(() => {
        if (isFocused && route.params.circle._id) fetchCircle();
        return () => {
            if (mqttClient) {
                mqttClient.unsubscribe(mqttTopic);
                mqttClient?.disconnect();
                mqttClient = null;
            }
        };
    }, [isFocused]);

    const connectMQTT = async () => {
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

    if (!circle) return null;

    const onSelectAll = () => {
        if (isAllSelected) setSelectedMembers([]);
        else setSelectedMembers(members);
    };

    const isAllSelected = selectedMembers.length === members.length;

    const onSendMessage = async () => {
        try {
            setLoading(true);
            const params = {
                circle: circle._id,
                poster: user._id,
                message: msgText,
                invitedMembers: selectedMembers.map((x) => x.user._id),
                referenceResourceId: resource?._id,
            };
            const { data } = await CircleMessageApi.create(params);
            setLoading(false);
            const payload = {
                clientType: MQTT_CLIENT_TYPE.CIRCLE_MESSAGE,
                data: { type: 'message', data },
            };
            mqttClient?.publish(mqttTopic, JSON.stringify(payload), 0, false);
            navigation.navigate('CircleMessageList', { circle });
        } catch (error) {
            setLoading(false);
            dispatch(handleError(error));
        }
    };

    const renderItem = ({ item }: { item: CircleMember; index?: number }) => {
        return (
            <CircleMemberItem
                member={item}
                selected={selectedMembers.some((x) => x.user._id === item.user._id)}
                showSelectSign
                onPress={() => {
                    const newSelectedMembers = [...selectedMembers];
                    const index = newSelectedMembers.findIndex((x) => x.user._id === item.user._id);
                    if (index > -1) newSelectedMembers.splice(index, 1);
                    else newSelectedMembers.push(item);
                    setSelectedMembers(newSelectedMembers);
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

    const onSeachResource = () => {
        navigation.navigate('SearchResources', { callback: setResource });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={getStyle('col')}
            keyboardVerticalOffset={150}
        >
            <View style={styles.containerStyle}>
                <View style={styles.listContainerStyle}>
                    <View style={getStyle(['row', 'justify-between', 'align-items-center', 'pt-20', 'pb-4', 'px-20'])}>
                        <CTText fontFamily={fonts.montserrat.regular}>To: {selectedMembers.length} members</CTText>
                        <TouchableOpacity>
                            <CTText
                                fontFamily={fonts.montserrat.bold}
                                bold
                                color={colors.primary}
                                onPress={onSelectAll}
                            >
                                {isAllSelected ? 'Clear All' : 'Select All'}
                            </CTText>
                        </TouchableOpacity>
                    </View>
                    <Loading />
                    <CTInfiniteFlatlist<CircleMember>
                        style={styles.listStyle}
                        renderItem={renderItem}
                        totalCount={members.length}
                        data={members}
                    />

                    <View style={styles.messageBoxContainer}>
                        {resource ? (
                            <ResourceItem resource={resource} onPress={onSeachResource} />
                        ) : (
                            <CTButton
                                color={colors.dynamicWhite}
                                borderColor={colors.border}
                                onPress={onSeachResource}
                                style={getStyle(['row', 'jusify-center'])}
                            >
                                <View style={getStyle(['row', 'jusify-center', 'align-items-center'])}>
                                    <Icon
                                        type={IconType.Ionicons}
                                        name="business-outline"
                                        size={20}
                                        color={colors.primary}
                                    />
                                    <CTText
                                        fontFamily={fonts.montserrat.regular}
                                        color={colors.primary}
                                        center
                                        style={getStyle('ml-16')}
                                    >
                                        Search Resource
                                    </CTText>
                                </View>
                            </CTButton>
                        )}
                        <View style={getStyle(['row', 'align-items-center', 'pt-8'])}>
                            <TextInput
                                style={[styles.messageTextStyle, { height: Math.max(40, msgTextBoxHeight) }]}
                                placeholder="Type a message"
                                onChangeText={setMsgText}
                                onContentSizeChange={(event) =>
                                    setMsgTextBoxHeight(event.nativeEvent.contentSize.height)
                                }
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
                                    onSendMessage();
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
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default NewCircleMessageScreen;
