/**
 * @format
 */
import './gesture-handler';

import './shim';
import {AppRegistry} from 'react-native';
import {enableScreens} from 'react-native-screens';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-get-random-values'


enableScreens();

AppRegistry.registerComponent(appName, () => App);
