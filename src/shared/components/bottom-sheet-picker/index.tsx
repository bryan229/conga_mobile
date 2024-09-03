import React, { useEffect, useMemo, useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import ReactNativeModal from 'react-native-modal';
import createStyles from './style';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import { FlatList } from 'react-native';
import { CPStyleProp, PickerOption } from '@services/types';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { closeBottomSheetPicker } from '@store/actions/ui';
import CPPickerItem from '../picker-item';
import CTText from '../controls/ct-text';

export interface CPBottomSheetPickerProps {
    style?: CPStyleProp;
    onSelect?: (value: string | string[] | null, index: number) => void;
    isMulti?: boolean;
    values?: string[];
    value?: string;
    options: PickerOption[];
}

const CPBottomSheetPicker: React.FC = () => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const dropUpPicker = useAppSelector((state) => state.ui.dropUpPicker);
    const isOpen = useAppSelector((state) => state.ui.isOpenDropUpPicker);
    const { style, onSelect, isMulti, values, value, options } = dropUpPicker || {};
    const [displayOptions, setDisplayOptions] = useState(options);
    const [searchWord, setSearchWord] = useState<string>('');

    useEffect(() => {
        setSearchWord('');
        setDisplayOptions(options);
    }, [isOpen]);

    const onSearchOptions = (value: string) => {
        setDisplayOptions((options ?? [])?.filter((x) => x.label.toLowerCase().includes(value.trim().toLowerCase())));
    };

    const HideIconButton = () => (
        <TouchableOpacity
            onPress={() => {
                if (onSelect) onSelect(null, -1);
                dispatch(closeBottomSheetPicker());
            }}
        >
            <Icon
                type={IconType.Ionicons}
                name="remove"
                size={40}
                color={colors.iconPrimary}
                style={styles.hideIconStyle}
            />
        </TouchableOpacity>
    );

    const _renderItem = ({ item, index }: { item: PickerOption; index: number }) => {
        const isSelected = isMulti ? (values || []).includes(item.value) : item.value === value;
        return (
            <CPPickerItem
                selected={isSelected}
                index={index}
                onPress={() => {
                    if (onSelect) {
                        if (isMulti) {
                            const newValue = [...(values || [])];
                            const idx = newValue.indexOf(item.value);
                            if (idx > -1) newValue.splice(idx, 1);
                            else newValue.push(item.value);
                            onSelect(newValue, index);
                        } else onSelect(item.value, index);
                    }
                    dispatch(closeBottomSheetPicker());
                }}
            >
                <CTText>{item.label}</CTText>
            </CPPickerItem>
        );
    };

    return (
        <ReactNativeModal
            isVisible={isOpen}
            style={style}
            // hasBackdrop={false}
            backdropOpacity={0.8}
            animationIn="slideInUp"
            animationInTiming={800}
            animationOut="slideOutDown"
            animationOutTiming={400}
            onBackdropPress={() => {
                if (onSelect) onSelect(null, -1);
                dispatch(closeBottomSheetPicker());
            }}
            avoidKeyboard
        >
            <View style={styles.container}>
                <HideIconButton />
                {(options ?? [])?.length > 30 && (
                    <TextInput
                        placeholder="Search option..."
                        style={[styles.searchFieldStyle]}
                        onChangeText={(value) => {
                            setSearchWord(value);
                            onSearchOptions(value);
                        }}
                        selectionColor={'green'}
                        value={searchWord}
                    />
                )}
                <FlatList renderItem={_renderItem} data={displayOptions} style={styles.listStyle} />
            </View>
        </ReactNativeModal>
    );
};

export default CPBottomSheetPicker;
