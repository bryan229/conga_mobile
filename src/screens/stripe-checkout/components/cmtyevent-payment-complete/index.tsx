import React, { useMemo } from 'react';
import { useTheme } from '@services/hooks/useTheme';
import CTButton from '@shared/components/controls/ct-button';
import CTText from '@shared/components/controls/ct-text';
import fonts from '@shared/theme/fonts';
import { getStyle } from '@shared/theme/themes';
import { View } from 'react-native';
import createStyles from './style';

type CmtyEventPaymentCompleteProps = {
    paymentStatus: string;
    isDonated?: boolean;
    goBack: () => void;
};

const CmtyEventPaymentComplete: React.FC<CmtyEventPaymentCompleteProps> = ({
    paymentStatus,
    isDonated = false,
    goBack,
}) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <View style={styles.containerStyle}>
            <View style={styles.titleContainerStyle}>
                <View>
                    <CTText
                        h2
                        color={colors.dynamicPrimary}
                        fontFamily={fonts.montserrat.bold}
                        center
                        style={[getStyle('mb-8')]}
                    >
                        Thank you
                    </CTText>
                    <CTText h4 color={colors.dynamicPrimary} center style={[getStyle('mb-16')]}>
                        {isDonated ? 'Donation' : 'Payment Completed!'}
                    </CTText>
                </View>
                {paymentStatus !== 'paid' && (
                    <CTText h6 color={colors.danger} center>
                        Your payment is in pending. we will let you know soon via email when payment is completed
                    </CTText>
                )}
            </View>
            <CTButton onPress={goBack} title="Go Back" style={getStyle('mt-100')} />
        </View>
    );
};

export default CmtyEventPaymentComplete;
