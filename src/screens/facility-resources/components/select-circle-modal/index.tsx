import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import createStyles from './style';
import { useTheme } from '@services/hooks/useTheme';
import CTText from '@shared/components/controls/ct-text';
import { getStyle } from '@shared/theme/themes';
import fonts from '@shared/theme/fonts';
import { useAppSelector } from '@store/hook';
import { TouchableOpacity } from 'react-native';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import { Circle } from '@services/models';

type Props = {
    isOpen: boolean;
    toggle: () => void;
    callback: (circle: Circle) => void;
};

const SelectCircleModal = ({ isOpen, toggle, callback }: Props) => {
    const myCircles = useAppSelector((state) => state.club.myCircles);
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [selectedCircle, setSelectedCircle] = useState<Circle>();

    return (
        <ReactNativeModal
            isVisible={isOpen}
            statusBarTranslucent={false}
            hasBackdrop={true}
            backdropOpacity={0.1}
            animationIn="fadeIn"
            animationInTiming={100}
            animationOut="fadeOut"
            animationOutTiming={200}
            onBackdropPress={toggle}
            avoidKeyboard
        >
            <View style={styles.container}>
                <CTText fontFamily={fonts.montserrat.regular} color={colors.text} h4 style={getStyle('p-16')}>
                    Select Circle
                </CTText>
                <View style={getStyle(['px-16', 'pb-16'])}>
                    {myCircles.map((x, index) => (
                        <TouchableOpacity
                            key={x._id}
                            style={[
                                getStyle(['row', 'align-items-center', 'p-8']),
                                { backgroundColor: index % 2 === 0 ? colors.separator : colors.white },
                            ]}
                            onPress={() => setSelectedCircle(x)}
                        >
                            <Icon
                                name={selectedCircle?._id === x._id ? 'checkmark-circle-outline' : 'ellipse-outline'}
                                color={selectedCircle?._id === x._id ? colors.primary : colors.text}
                                type={IconType.Ionicons}
                                size={20}
                            />
                            <CTText
                                style={getStyle('ml-8')}
                                fontFamily={fonts.montserrat.regular}
                                color={selectedCircle?._id === x._id ? colors.primary : colors.text}
                            >
                                {x.name}
                            </CTText>
                        </TouchableOpacity>
                    ))}
                    <View style={getStyle(['row', 'align-items-center', 'justify-end'])}>
                        <TouchableOpacity style={getStyle(['px-16', 'pt-16'])} onPress={toggle}>
                            <CTText fontFamily={fonts.montserrat.regular} bold color={colors.danger}>
                                Cancel
                            </CTText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={getStyle(['px-16', 'pt-16'])}
                            disabled={!selectedCircle}
                            onPress={() => {
                                if (selectedCircle) callback(selectedCircle);
                                toggle();
                            }}
                        >
                            <CTText fontFamily={fonts.montserrat.regular} bold color={colors.primary}>
                                Select
                            </CTText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ReactNativeModal>
    );
};

export default SelectCircleModal;
