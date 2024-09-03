import { AppRegistry } from 'react-native';
import React from 'react';
import App from './App';
import { name as appName } from './app.json';
import NotificationService from './src/services/notification';
NotificationService.configure();

const HeadlessCheck = ({ isHeadless }) => {
    // console.log('isHeadless', isHeadless);
    // if (isHeadless) {
    //     return null;
    // }
    return <App />;
};

AppRegistry.registerComponent(appName, () => HeadlessCheck);
