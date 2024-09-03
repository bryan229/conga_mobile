import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { StatusBar, useColorScheme } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { persistStore } from 'redux-persist';
import store from '@store';
import Navigation from '@navigation';
import { isAndroid } from '@freakycoder/react-native-helpers';
import CPToastProvider from '@shared/components/toast-provider';
import { EventProvider } from 'react-native-outside-press';
import SplashScreen from 'react-native-splash-screen';
import GlobalAlertModal from '@shared/components/global-alert-modal';

const persistor = persistStore(store);
LogBox.ignoreLogs([
    "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);
LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

const App = () => {
    const scheme = useColorScheme();
    const isDarkMode = scheme === 'dark';

    useEffect(() => {
        SplashScreen.hide();
    }, []);

    useEffect(() => {
        StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content');
        if (isAndroid) {
            StatusBar.setBackgroundColor('rgba(0,0,0,0)');
            StatusBar.setTranslucent(true);
        }
    }, [scheme]);

    return (
        <EventProvider>
            <Provider store={store}>
                <PersistGate persistor={persistor}>
                    <CPToastProvider>
                        <Navigation />
                        <GlobalAlertModal />
                    </CPToastProvider>
                </PersistGate>
            </Provider>
        </EventProvider>
    );
};

export default App;
