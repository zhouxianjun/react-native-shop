/** @format */

import { AppRegistry, YellowBox } from 'react-native';
import './src/lib/global';
import App from './src/App';
import { name as appName } from './app.json';

YellowBox.ignoreWarnings([
    'Remote debugger is in a background tab which may cause apps to perform slowly',
    'Require cycle: node_modules/rn-fetch-blob/index.js',
    'Require cycle: node_modules\\rn-fetch-blob\\index.js'
]);

AppRegistry.registerComponent(appName, () => App);
