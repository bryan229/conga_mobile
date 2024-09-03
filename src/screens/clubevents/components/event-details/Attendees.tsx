import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme } from '@services/hooks/useTheme';
import { ClubEvent, ClubEventRegUser } from '@services/models';
import CTText from '@shared/components/controls/ct-text';
import { useAppDispatch } from '@store/hook';
import { View } from 'react-native';
import * as Progress from 'react-native-progress';
import createStyles from './style';
import { handleError } from '@store/actions/ui';
import { ClubEventApi } from '@services/api';
import CPAvatar from '@shared/components/avatar';
import { canEventAddGuest } from '@services/helpers/clubevent';
import moment from 'moment';
import { ScrollView } from 'react-native';

interface Props {
    event: ClubEvent;
    height: number;
}

const Attendees = ({ event, height }: Props) => {
    const theme = useTheme();
    const { colors, getStyle } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const [regUsers, setRegUsers] = useState<ClubEventRegUser[]>([]);

    const fetchRegUsers = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await ClubEventApi.retrieveRegUsers({ _id: event._id });
            setRegUsers(data);
        } catch (error) {
            dispatch(handleError(error));
        }
        setLoading(false);
    }, [event._id]);

    useEffect(() => {
        fetchRegUsers();
    }, [event._id]);

    const RegUserItem = ({ regUser }: { regUser: ClubEventRegUser }) => {
        return (
            <View style={styles.regUserItemContainer}>
                <CPAvatar source={regUser.user.photoUrl} name={regUser.user.fullName} size={45} />
                <View style={getStyle('ml-8')}>
                    <CTText size={12} bold color={colors.text}>
                        {regUser.user.fullName}
                    </CTText>
                    {canEventAddGuest(event) && <CTText size={8}>Guests: {regUser.guests || 0}</CTText>}
                    <CTText size={8}>{moment(regUser.createdAt).format('MMM DD, YYYY')}</CTText>
                </View>
            </View>
        );
    };

    const Loading = () => {
        if (!loading) return null;
        return (
            <View style={[styles.loadingContainerStyle, { height }]}>
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
        <ScrollView style={[styles.regUsersContainerStyle, { height }]}>
            <Loading />
            {regUsers.map((x) => (
                <RegUserItem regUser={x} key={x._id} />
            ))}
        </ScrollView>
    );
};

export default Attendees;
