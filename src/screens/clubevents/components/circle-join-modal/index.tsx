import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import createStyles from './style';
import { useTheme } from '@services/hooks/useTheme';
import CTText from '@shared/components/controls/ct-text';
import { getStyle } from '@shared/theme/themes';
import fonts from '@shared/theme/fonts';
import { TouchableOpacity } from 'react-native';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import { Circle } from '@services/models';
import CTButton from '@shared/components/controls/ct-button';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { CircleApi } from '@services/api';
import { handleError, putMyCircles, showAlert } from '@store/actions';

type Props = {
    circles: Circle[];
    isOpen: boolean;
    toggle: () => void;
};

const CircleJoinModal = ({ isOpen, toggle, circles }: Props) => {
    const theme = useTheme();
    const { colors } = theme;
    const dispatch = useAppDispatch();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const myCircles = useAppSelector((state) => state.club.myCircles);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedCircles, setSelectedCircles] = useState<string[]>([]);

    const onJoin = async () => {
        setLoading(true);
        try {
            const promise = selectedCircles.map((x) => CircleApi.joinRequest({ _id: x }));
            const joinedCircles = await Promise.all(promise);
            dispatch(putMyCircles([...myCircles, ...joinedCircles.map((x) => x.data)]));
            dispatch(
                showAlert({
                    type: 'success',
                    title: 'Success',
                    message: 'You has been joined for circles successfully',
                })
            );
            setSelectedCircles([]);
            toggle();
        } catch (error) {
            dispatch(handleError(error));
        }
        setLoading(false);
    };

    return (
        <ReactNativeModal
            isVisible={isOpen}
            statusBarTranslucent={false}
            hasBackdrop={true}
            backdropOpacity={0.7}
            animationIn="fadeIn"
            animationInTiming={100}
            animationOut="fadeOut"
            animationOutTiming={200}
            avoidKeyboard
        >
            <View style={styles.container}>
                <View style={getStyle(['row', 'justify-between', 'align-items-center', 'pb-16'])}>
                    <CTText size={14} bold color={colors.text} center style={getStyle('col')}>
                        Join Circles
                    </CTText>
                    <TouchableOpacity onPress={toggle}>
                        <Icon type={IconType.Ionicons} name="close" size={25} />
                    </TouchableOpacity>
                </View>
                {circles.map((x) => (
                    <TouchableOpacity
                        key={x._id}
                        style={[getStyle(['row', 'align-items-center', 'p-8'])]}
                        onPress={() => {
                            const newSelectedCircles = [...selectedCircles];
                            const index = newSelectedCircles.indexOf(x._id);
                            if (index > -1) newSelectedCircles.splice(index, 1);
                            else newSelectedCircles.push(x._id);
                            setSelectedCircles(newSelectedCircles);
                        }}
                    >
                        <Icon
                            name={selectedCircles.includes(x._id) ? 'checkmark-circle-outline' : 'ellipse-outline'}
                            color={selectedCircles.includes(x._id) ? colors.primary : colors.text}
                            type={IconType.Ionicons}
                            size={20}
                        />
                        <CTText
                            style={getStyle('ml-8')}
                            fontFamily={fonts.montserrat.regular}
                            color={selectedCircles.includes(x._id) ? colors.primary : colors.text}
                        >
                            {x.name}
                        </CTText>
                    </TouchableOpacity>
                ))}
                <CTButton
                    loading={loading}
                    color={colors.primary}
                    disabled={selectedCircles.length === 0}
                    onPress={onJoin}
                    style={getStyle('mt-16')}
                >
                    <CTText center fontFamily={fonts.montserrat.regular} color={colors.white} bold>
                        Join
                    </CTText>
                </CTButton>
            </View>
        </ReactNativeModal>
    );
};

export default CircleJoinModal;
