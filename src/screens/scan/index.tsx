import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { StackScreenProps } from '@react-navigation/stack';
import createStyles from './style';
import { RootStackParamList } from '@navigation/types';
import { useTheme } from '@services/hooks/useTheme';
import { useAppNavigation } from '@services/hooks/useNavigation';
import { BarCodeReadEvent } from 'react-native-camera';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import { TouchableOpacity } from 'react-native';
import { getStyle } from '@shared/theme/themes';
import QRCodeCheckModal from './components/code-check-modal';

type ScanScreenProps = StackScreenProps<RootStackParamList, 'ScanQRCode'>;

const ScanScreen: React.FC<ScanScreenProps> = () => {
    const navigation = useAppNavigation();
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [canScan, setCanScan] = useState<boolean>(true);
    const [codeData, setCodeData] = useState<any>();

    useEffect(() => {
        setCanScan(true);
    }, []);

    const onSuccess = (e: BarCodeReadEvent) => {
        try {
            const data = JSON.parse(e.data);
            const clubId = data?._id || data?.club;
            if (!data || data.type === undefined || data.type === null || !clubId || !canScan) return;
            setCodeData(data);
            setCanScan(false);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.containerStyle}>
            <TouchableOpacity style={getStyle(['mt-48', 'px-16'])} onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" type={IconType.Ionicons} size={30} />
            </TouchableOpacity>
            {canScan && <QRCodeScanner reactivate={true} showMarker={true} onRead={onSuccess} />}
            <QRCodeCheckModal data={codeData} isOpen={!canScan} toggle={() => setCanScan(true)} />
        </View>
    );
};

export default ScanScreen;
