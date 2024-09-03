import { useTheme } from '@services/hooks/useTheme';
import React, { useEffect, useMemo, useState } from 'react';
import createStyles from './style';
import { View, TouchableOpacity } from 'react-native';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import Slider from '@react-native-community/slider';
import CTAudio from '@services/audio';

let playerInterval: any;

interface AudioPlayerProps {
    sourceName: string;
}
const AudioPalyer: React.FC<AudioPlayerProps> = ({ sourceName }) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [duration, setDuration] = useState<number>(0);
    const [isPlaying, setIsPalying] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);

    useEffect(() => {
        initPalyer();
        return () => {
            CTAudio.release();
            if (playerInterval) {
                clearInterval(playerInterval);
            }
        };
    }, [sourceName]);

    const initPalyer = async () => {
        const audioDuration = await CTAudio.init(sourceName);
        if (audioDuration) {
            setDuration(audioDuration || 0);
        }
    };

    const playAndPause = () => {
        if (isPlaying) {
            CTAudio.pause();
            if (playerInterval) clearInterval(playerInterval);
        } else {
            CTAudio.play();
            startMonitoring();
        }
        setIsPalying(!isPlaying);
    };

    const startMonitoring = () => {
        playerInterval = setInterval(async () => {
            const { second, isPlaying: playing } = await CTAudio.getCurrentTime();
            if (!playing) {
                clearInterval(playerInterval);
                CTAudio.stop();
                setCurrentTime(0);
                setIsPalying(false);
            } else setCurrentTime(second);
        }, 100);
    };

    const onSlidingComplete = (value: number) => {
        setCurrentTime(value);
        CTAudio.setCurrentTime(value);
    };

    return (
        <View style={styles.containerStyle}>
            <TouchableOpacity onPress={playAndPause}>
                <Icon name={isPlaying ? 'controller-paus' : 'controller-play'} type={IconType.Entypo} size={25} />
            </TouchableOpacity>
            <Slider
                style={styles.sliderStyle}
                minimumValue={0}
                maximumValue={duration}
                minimumTrackTintColor={colors.darkGray}
                maximumTrackTintColor={colors.borderColor}
                thumbTintColor={colors.calpyse}
                value={currentTime}
                onSlidingComplete={onSlidingComplete}
                step={0.01}
            />
        </View>
    );
};

export default AudioPalyer;
