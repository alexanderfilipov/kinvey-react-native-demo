/**
 * @format
 */

import {AppRegistry, Linking} from 'react-native';
import * as Kinvey from 'kinvey-react-native-sdk';
// import {register, unregister} from 'kinvey-react-native-sdk/lib/push';
import App from './App';
import {name as appName} from './app.json';

Linking.getInitialURL().then((url) => {
  console.log('Initial url: ' + url);
});

// Initialize the Kinvey React Native SDK
Kinvey.init({
  appKey: 'XXX',
  appSecret: 'YYY',
});

AppRegistry.registerComponent(appName, () => App);
