import React from 'react';
import { Router, Stack, Scene } from 'react-native-router-flux';
import Login from './views/login';
import Home from './views/home';

export default function () {
    return (
        <Router>
            <Stack key="root">
                <Scene key="login" component={Login} title="登录" />
                <Scene key="home" component={Home} initial />
            </Stack>
        </Router>
    );
}
