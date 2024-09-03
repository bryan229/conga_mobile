import ReactNativeModal from 'react-native-modal';
import React, { useEffect, useMemo, useState } from 'react';
import { Keyboard, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import { getStyle } from '@shared/theme/themes';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import { useForm } from 'react-hook-form';
import CTTextInput from '@shared/components/controls/ct-textinput';
import CTTextArea from '@shared/components/controls/ct-textarea';
import CTSwitch from '@shared/components/controls/ct-switch';
import CTButton from '@shared/components/controls/ct-button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { handleError } from '@store/actions';
import { PostApi } from '@services/api';

interface Props {
    isOpen: boolean;
    toggle: () => void;
    callback: () => void;
}

type FormValues = {
    title: string;
    content: string;
    hideAuthor: boolean;
};

const AddNewPostModal = ({ isOpen, toggle, callback }: Props) => {
    const user = useAppSelector((state) => state.auth.user!);
    const club = useAppSelector((state) => state.club.club!);
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [loading, setLoading] = useState<boolean>(false);
    const { handleSubmit, control, formState, reset } = useForm<FormValues>({
        defaultValues: {
            title: '',
            content: '',
            hideAuthor: false,
        },
    });

    useEffect(() => {
        if (isOpen) reset({ title: '', content: '', hideAuthor: false });
    }, [isOpen]);

    const submit = async (data: FormValues) => {
        const { title, content, hideAuthor } = data;
        setLoading(true);
        try {
            const params = {
                club: club._id,
                author: user._id,
                title,
                content,
                summary: content.slice(0, 350),
                hideAuthor,
            };
            await PostApi.create(params);
            toggle();
            callback();
        } catch (error) {
            dispatch(handleError(error));
        }
        setLoading(false);
    };

    return (
        <ReactNativeModal
            isVisible={isOpen}
            statusBarTranslucent={false}
            backdropOpacity={0.8}
            animationIn="slideInUp"
            animationInTiming={200}
            animationOut="slideOutDown"
            animationOutTiming={300}
        >
            <View style={styles.containerStyle}>
                <KeyboardAwareScrollView>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <>
                            <View style={getStyle(['row', 'justify-between', 'align-items-center', 'mb-16'])}>
                                <View />
                                <CTText h3 fontFamily={fonts.montserrat.bold} color={colors.text}>
                                    Create New Post
                                </CTText>
                                <TouchableOpacity onPress={toggle}>
                                    <Icon name="close" type={IconType.Ionicons} size={25} />
                                </TouchableOpacity>
                            </View>
                            <View style={getStyle('px-16')}>
                                <CTTextInput
                                    style={getStyle('mb-8')}
                                    name="title"
                                    label="Title"
                                    placeholder="I just want to confirm..."
                                    required
                                    validation={{ control, formState, rules: { required: true } }}
                                />
                                <CTTextArea
                                    style={getStyle('mb-8')}
                                    name="content"
                                    label="Content"
                                    placeholder="Message here."
                                    required
                                    validation={{ control, formState, rules: { required: true } }}
                                />
                                <CTSwitch
                                    name="hideAuthor"
                                    label="Do you want to post this anonymously?"
                                    style={getStyle(['mt-8', 'mb-32'])}
                                    validation={{ control, formState, rules: { required: false } }}
                                />
                                <CTButton title="Send" onPress={handleSubmit(submit)} loading={loading} />
                            </View>
                        </>
                    </TouchableWithoutFeedback>
                </KeyboardAwareScrollView>
            </View>
        </ReactNativeModal>
    );
};

export default AddNewPostModal;
