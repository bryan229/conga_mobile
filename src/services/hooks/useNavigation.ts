import { StackParamList } from '@navigation/types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export const useAppNavigation = () => {
    return useNavigation<StackNavigationProp<StackParamList>>();
};
