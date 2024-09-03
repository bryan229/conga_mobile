import React, { ReactNode, useEffect, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import ReactNativeModal from 'react-native-modal';
import createStyles from './style';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import { CPStyleProp } from '@services/types';

interface CPBottomSheetProps {
    isHideButton?: boolean;
    style?: CPStyleProp;
    isVisible: boolean;
    toggle: () => void;
    children: ReactNode;
    statusBarTranslucent?: boolean; //true  android keyboard issue (when keyboard is open, move modal up to keyboard)
}

const CPBottomSheet: React.FC<CPBottomSheetProps> = ({
    style,
    isVisible,
    toggle,
    children,
    isHideButton = true,
    statusBarTranslucent = false,
}) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);

    useEffect(() => {
        return () => {
            if (toggle) toggle();
        };
    }, []);

    const HideIconButton = () => (
        <TouchableOpacity onPress={toggle}>
            <Icon
                type={IconType.Ionicons}
                name="remove"
                size={40}
                color={colors.iconPrimary}
                style={styles.hideIconStyle}
            />
        </TouchableOpacity>
    );

    return (
        <ReactNativeModal
            isVisible={isVisible}
            statusBarTranslucent={statusBarTranslucent}
            // hasBackdrop={false}
            backdropOpacity={0.8}
            animationIn="slideInUp"
            animationInTiming={200}
            animationOut="slideOutDown"
            animationOutTiming={300}
            onBackdropPress={toggle}
        >
            <View style={[styles.container, style]}>
                {isHideButton && <HideIconButton />}
                {children}
            </View>
        </ReactNativeModal>
    );
};

export default CPBottomSheet;
