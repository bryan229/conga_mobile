import React, { useMemo, useState } from 'react';
import { WebView, WebViewNavigation } from 'react-native-webview';
import queryString from 'query-string';
import { useAppDispatch } from '@store/hook';
import { useTheme } from '@services/hooks/useTheme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/types';
import stripeCheckoutRedirectHTML from './stripe-setting';
import createStyles from './style';
import { NativeSyntheticEvent, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { useAppNavigation } from '@services/hooks/useNavigation';
import { PAYMENT_TYPE } from '@shared/constants';
import { fetchMe } from '@store/actions';

type ScreenProps = StackScreenProps<RootStackParamList, 'StripeCheckout'>;

const ScripeCheckoutScreen: React.FC<ScreenProps> = ({ route }) => {
    const navigation = useAppNavigation();
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [stripeStatus, setStripeStatus] = useState('checkout');
    const [loading, setLoading] = useState<boolean>(false);
    const { sessionId } = route.params;

    const onSuccessHandler = async (session_id: string, type: PAYMENT_TYPE) => {
        setStripeStatus('checkout_success');
        if (!session_id || !session_id.startsWith('cs_')) return navigation.goBack();
        try {
            if (type === PAYMENT_TYPE.CLUB_SUBSCRIPTION) dispatch(fetchMe({}));
            navigation.goBack();
        } catch (error) {
            setLoading(false);
            navigation.goBack();
        }
    };

    const onCanceledHandler = async () => {
        setStripeStatus('checkout_cancel');
        try {
            navigation.goBack();
        } catch (error) {
            setLoading(false);
            navigation.goBack();
        }
    };

    const onLoadStart = (syntheticEvent: NativeSyntheticEvent<WebViewNavigation>) => {
        const { nativeEvent } = syntheticEvent;
        if (nativeEvent.url.includes('subscribe/complete')) {
            const { query } = queryString.parseUrl(nativeEvent.url);
            if (query && query.session_id) onSuccessHandler(query.session_id as string, PAYMENT_TYPE.CLUB_SUBSCRIPTION);
        } else if (nativeEvent.url.includes('payments/complete')) {
            const { query } = queryString.parseUrl(nativeEvent.url);
            if (query && query.session_id) onSuccessHandler(query.session_id as string, PAYMENT_TYPE.CLUB_EVENT);
        } else if (nativeEvent.url.includes('subscribe/cancel') || nativeEvent.url.includes('payments/cancel')) {
            const { query } = queryString.parseUrl(nativeEvent.url);
            if (query && query.token) onCanceledHandler();
            else navigation.goBack();
        }
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

    return (
        <View style={styles.containerStyle}>
            <Loading />
            <View style={styles.webViewContainerStyle}>
                {stripeStatus === 'checkout' && (
                    <WebView
                        style={styles.contentStyle}
                        originWhitelist={['*']}
                        source={{ html: stripeCheckoutRedirectHTML(process.env.STRIP_PUBLICKEY || '', sessionId) }}
                        onLoadStart={onLoadStart}
                    />
                )}
            </View>
        </View>
    );
};

export default ScripeCheckoutScreen;
