import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@services/hooks/useTheme';
import * as Progress from 'react-native-progress';
import createStyles from './style';
import CTText from '../controls/ct-text';
import { User } from '@services/models';
import CTDebounceTextInput from '../controls/ct-debounce-textinput';
import { UserApi } from '@services/api';
import { getStyle } from '@shared/theme/themes';
import { CPStyleProp } from '@services/types';
import Icon, { IconType } from 'react-native-dynamic-vector-icons';
import fonts from '@shared/theme/fonts';

interface Props {
    style?: CPStyleProp;
    query?: any;
    isMulti?: boolean;
    onResult: (user: User[]) => void;
}

const SearchMemberContent: React.FC<Props> = ({ style, isMulti = false, query = {}, onResult }) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [searchLastName, setSearchLastName] = useState('');
    const [candidates, setCandidates] = useState<User[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const searchCandidates = useCallback(() => {
        if (!searchLastName) return setCandidates([]);
        const params = { lastName: searchLastName.toLowerCase(), skip: 0, ...query };
        setLoading(true);
        UserApi.retrieve(params)
            .then((data) => {
                setCandidates(data.data);
                setLoading(false);
            })
            .catch((_) => {
                setLoading(false);
            });
    }, [searchLastName]);

    useEffect(() => {
        searchCandidates();
    }, [searchLastName]);

    const _renderItem = ({ item, index }: { item: User; index: number }) => {
        return (
            <TouchableOpacity
                style={[
                    getStyle('p-12'),
                    { backgroundColor: index % 2 === 0 ? colors.separator : colors.dynamicWhite },
                ]}
                onPress={() => {
                    if (isMulti) {
                        const newSelectedMembers = [...selectedMembers];
                        const index = newSelectedMembers.findIndex((x) => x._id === item._id);
                        if (index < 0) newSelectedMembers.push(item);
                        else newSelectedMembers.splice(index, 1);
                        setSelectedMembers(newSelectedMembers);
                        onResult(newSelectedMembers);
                    } else {
                        onResult([item]);
                    }
                }}
            >
                <View style={getStyle(['row', 'align-items-center', 'justify-between'])}>
                    <CTText fontFamily={fonts.montserrat.regular} style={getStyle('mr-8')}>
                        {item.fullName}
                    </CTText>
                    {isMulti && selectedMembers.some((x) => x._id === item._id) && (
                        <Icon name="checkmark" type={IconType.Ionicons} color={colors.iconPrimary} size={15} />
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.containerStyle, style]}>
            <CTDebounceTextInput
                placeholder="Search Members with lastname"
                initValue={searchLastName}
                onChange={setSearchLastName}
            />
            {loading ? (
                <View style={styles.loadingContainerStyle}>
                    <Progress.Circle
                        size={20}
                        indeterminate={loading}
                        color="white"
                        borderWidth={3}
                        borderColor={colors.primary}
                    />
                    <CTText style={getStyle('mt-16')}>Searching...</CTText>
                </View>
            ) : (
                <FlatList renderItem={_renderItem} data={candidates} style={styles.listStyle} />
            )}
        </View>
    );
};

export default SearchMemberContent;
