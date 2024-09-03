import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './auth';
import clubReducer from './club';
import clubEventReducer from './clubevent';
import resourceReducer from './resource';
import uiReducer from './ui';
import notificationReducer from './notification';

const rootPersistConfig = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['ui', 'club', 'clubEvent'],
};

const authPersistConfig = {
    key: 'auth',
    storage: AsyncStorage,
};

const notificationPersistConfig = {
    key: 'notification',
    storage: AsyncStorage,
};

const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
    notification: persistReducer(notificationPersistConfig, notificationReducer),
    club: clubReducer,
    ui: uiReducer,
    clubEvent: clubEventReducer,
    resource: resourceReducer,
});

export default persistReducer(rootPersistConfig, rootReducer);
