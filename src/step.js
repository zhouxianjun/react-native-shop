import React from 'react';
import { View } from 'react-native';
import App from './App';
import LoadingBar from './components/loading-bar';

export default () => (
    <View style={{ flex: 1 }}>
        <LoadingBar ref={ref => global.LoadingBar = ref} />
        <App />
    </View>
);
