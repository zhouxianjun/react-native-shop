import React, { Component } from 'react';
import { StatusBar, View, ActivityIndicator } from 'react-native';

export default class Launch extends Component {
    componentDidMount () {
        StatusBar.setHidden(false, true);
    }

    render () {
        return (
            <View style={{
                flex: 1,
                flexDirection: 'column',
                backgroundColor: '#E9EBEE',
                justifyContent: 'center',
                alignItems: 'center'
            }}
            >
                <ActivityIndicator animating size="large" color="#C1C5C8" />
            </View>
        );
    }
}
