import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import createStyles from './style';
import { useAppDispatch } from '@store/hook';
import { handleError } from '@store/actions';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import BackHeader from '@navigation/components/back-header';
import { getStyle } from '@shared/theme/themes';
import CTButton from '@shared/components/controls/ct-button';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/types';
import { UserApi } from '@services/api';
import CPClubLogo from '@shared/components/club-logo';
import { DEFAULT_LOGO, SUBSCRIPTION_PERIOD } from '@shared/constants';
import CTTextInput from '@shared/components/controls/ct-textinput';

type ScreenProps = StackScreenProps<RootStackParamList, 'Subscription'>;

const SubscriptionScreen = ({ route, navigation }: ScreenProps) => {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { user, club } = route.params;
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [loading, setLoading] = useState<boolean>(false);
    const [couponCode, setCouponCode] = useState<string>('');

    const onSubscribe = async () => {
        try {
            setLoading(true);
            const { sessionId } = await UserApi.subscribe({ couponCode });
            if (sessionId) navigation.replace('StripeCheckout', { sessionId });
            else navigation.goBack();
        } catch (error) {
            setLoading(false);
            dispatch(handleError(error));
        }
    };

    if (!user || !club) return null;

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={getStyle('col')}>
            <View style={styles.containerStyle}>
                <BackHeader title="Subscription" />
                <View style={styles.contentContainerStyle}>
                    <View style={styles.contentStyle}>
                        <View style={getStyle(['row', 'justify-center', 'mb-8'])}>
                            <CPClubLogo source={club.logoUrl || DEFAULT_LOGO} name={club.displayName} size={150} />
                        </View>
                        <CTText
                            color={colors.primary}
                            center
                            size={20}
                            fontFamily={fonts.montserrat.regular}
                            bold
                            style={getStyle('mb-16')}
                        >
                            {club.displayName}
                        </CTText>
                        <CTText color={colors.secondary} center size={50} fontFamily={fonts.montserrat.regular} bold>
                            ${club.setting?.subscription?.price}
                            <CTText
                                color={colors.secondary}
                                center
                                size={18}
                                fontFamily={fonts.montserrat.regular}
                                bold
                            >
                                / {club.setting?.subscription.period === SUBSCRIPTION_PERIOD.MONTH ? 'Month' : 'Year'}
                            </CTText>
                        </CTText>
                        <CTTextInput
                            style={getStyle('mt-8')}
                            name="coupon"
                            label="Coupon Code"
                            placeholder="XXXXXX"
                            value={couponCode}
                            onChange={(value) => setCouponCode(value.toUpperCase())}
                        />
                        <CTButton loading={loading} onPress={onSubscribe} style={getStyle('my-32')}>
                            <CTText fontFamily={fonts.montserrat.regular} bold color={colors.white} center>
                                Subscribe
                            </CTText>
                        </CTButton>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default SubscriptionScreen;
