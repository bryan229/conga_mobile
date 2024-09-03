import React, { useMemo } from 'react';
import { ToastProvider } from 'react-native-toast-notifications';
import { useTheme } from '@services/hooks/useTheme';
import { View } from 'react-native';
import CTText from '@shared/components/controls/ct-text';
import createStyles from './style';

interface CPToastProviderProps {
    children?: React.ReactNode;
}

interface ToastItemProps {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string | React.ReactNode;
}

const ToastContent = ({ type, title, message }: ToastItemProps) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    return (
        <View
            style={[
                styles.container,
                type === 'success'
                    ? styles.successContainer
                    : type === 'error'
                    ? styles.errorContainer
                    : type === 'warning'
                    ? styles.warningContainer
                    : styles.infoContainer,
            ]}
        >
            <CTText style={styles.titleTextStyle}>{title}</CTText>
            <CTText style={styles.messageTextStyle}>{message}</CTText>
        </View>
    );
};

const CPToastProvider: React.FC<CPToastProviderProps> = ({ children }) => {
    return (
        <ToastProvider
            placement="top"
            offset={40}
            duration={2000}
            renderType={{
                success_toast: (toast) => (
                    <ToastContent type="success" title={toast.data.title} message={toast.message} />
                ),
                warning_toast: (toast) => (
                    <ToastContent type="warning" title={toast.data.title} message={toast.message} />
                ),
                error_toast: (toast) => <ToastContent type="error" title={toast.data.title} message={toast.message} />,
                info_toast: (toast) => <ToastContent type="info" title={toast.data.title} message={toast.message} />,
            }}
        >
            {children}
        </ToastProvider>
    );
};

export default CPToastProvider;
