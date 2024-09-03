import { useAppNavigation } from '@services/hooks/useNavigation';
import { useAppSelector } from '@store/hook';
import React, { ReactNode, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import createStyles from './styles';

interface AuthLayoutProps {
    hasSafeArea?: boolean;
    children: ReactNode;
}
const AuthLayout: React.FC<AuthLayoutProps> = ({ children, hasSafeArea = false }) => {
    const user = useAppSelector((state) => state.auth.user);
    const navigation = useAppNavigation();
    const styles = useMemo(() => createStyles(), []);

    useEffect(() => {
        if (!user) navigation.popToTop();
    }, [user]);

    return (
        <>
            {hasSafeArea ? (
                <SafeAreaView style={styles.authLayoutContainer}>{children}</SafeAreaView>
            ) : (
                <View style={styles.authLayoutContainer}>{children}</View>
            )}
        </>
    );
};

export default AuthLayout;
