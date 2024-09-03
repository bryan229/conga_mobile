import React, { useMemo, useState } from 'react';
import { Comment, Post } from '@services/models';
import CTText from '@shared/components/controls/ct-text';
import { getStyle } from '@shared/theme/themes';
import { View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import { TouchableOpacity } from 'react-native';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import fonts from '@shared/theme/fonts';
import CTTextArea from '@shared/components/controls/ct-textarea';
import CTButton from '@shared/components/controls/ct-button';
import { useAppDispatch } from '@store/hook';
import { handleError } from '@store/actions';
import { useForm } from 'react-hook-form';
import { COMMENT_STATUS, COMMENT_USERTYPE } from '@shared/constants';
import { PostApi } from '@services/api';

interface Props {
    post: Post;
    isOpen: boolean;
    toggle: () => void;
    callback: (comment: Comment) => void;
}

type FormValues = {
    message: string;
};

const AddCommentModal = ({ post, isOpen, toggle, callback }: Props) => {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [loading, setLoading] = useState<boolean>(false);

    const { handleSubmit, control, formState } = useForm<FormValues>({
        defaultValues: {
            message: '',
        },
    });

    const sendComment = async (data: FormValues) => {
        setLoading(true);
        try {
            const params = {
                post: post._id,
                content: data.message,
                commentUserType: COMMENT_USERTYPE.MEMBER,
                status: COMMENT_STATUS.ADDED,
            };
            const { data: newComment } = await PostApi.createComment(params);
            callback(newComment);
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
            backdropOpacity={0.8}
            animationIn="fadeIn"
            animationInTiming={100}
            animationOut="fadeOut"
            animationOutTiming={200}
            onBackdropPress={toggle}
        >
            <View style={styles.container}>
                <View style={getStyle(['row', 'justify-between', 'align-items-center', 'p-16'])}>
                    <View />
                    <CTText size={12} color={colors.text} fontFamily={fonts.montserrat.bold}>
                        Add Comment
                    </CTText>
                    <TouchableOpacity onPress={toggle}>
                        <Icon name="close" type={IconType.Ionicons} size={25} color={colors.danger} />
                    </TouchableOpacity>
                </View>
                <View style={getStyle(['px-16', 'pb-16'])}>
                    <CTTextArea
                        style={getStyle('mb-8')}
                        name="message"
                        placeholder="Comment Here"
                        validation={{ control, formState, rules: { required: true } }}
                    />
                    <CTButton loading={loading} title="Send" onPress={handleSubmit(sendComment)} />
                </View>
            </View>
        </ReactNativeModal>
    );
};

export default AddCommentModal;
