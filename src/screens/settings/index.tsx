import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { useTheme } from '@services/hooks/useTheme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/types';
import createStyles from './style';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import { getStyle } from '@shared/theme/themes';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import { ScrollView } from 'react-native';
import BackHeader from '@navigation/components/back-header';
import CTSwitch from '@shared/components/controls/ct-switch';
import { putUser } from '@store/actions';
import { AuthApi } from '@services/api';
import { handleError, setLoading } from '@store/actions/ui';

type SettingScreenProps = StackScreenProps<RootStackParamList, 'Settings'>;

const SettingScreen: React.FC<SettingScreenProps> = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);

    if (!user) return null;

    const onChangeNotificationSetting = async (value: boolean) => {
        const params = {
            _id: user?._id,
            isRecevieNotification: value,
        };
        try {
            dispatch(setLoading(true));
            const { data } = await AuthApi.update(params);
            dispatch(putUser(data));
            dispatch(setLoading(false));
        } catch (error) {
            dispatch(handleError(error));
            dispatch(setLoading(false));
        }
    };

    return (
        <View style={styles.containerStyle}>
            <BackHeader title="Settings" style={styles.headerStyle} />
            <ScrollView style={styles.menuContainerStyle}>
                <View style={[styles.menuItemContainerStyle, getStyle('my-16')]}>
                    <View style={styles.labelContainerStyle}>
                        <Icon name="notifications-circle-outline" type={IconType.Ionicons} size={30} />
                        <View style={getStyle('ml-8')}>
                            <CTText
                                color={colors.text}
                                fontFamily={fonts.montserrat.medium}
                                style={[styles.labelTextStyle, getStyle('mb-4')]}
                            >
                                Allow Notification
                            </CTText>
                            <CTText style={styles.descriptionTextStyle}>Enable or Disable notification</CTText>
                        </View>
                    </View>
                    <CTSwitch
                        name="allownotification"
                        style={getStyle('my-8')}
                        value={user.isRecevieNotification}
                        onChange={onChangeNotificationSetting}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default SettingScreen;
