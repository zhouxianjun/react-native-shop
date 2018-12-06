import React from 'react';
import {
    Router, Stack, Scene, Tabs
} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Login from './views/login';
import Home from './views/home';
import User from './views/user';

export default function () {
    return (
        <Router>
            <Stack key="root">
                <Tabs key="tabs" hideNavBar>
                    <Scene
                        key="home"
                        component={Home}
                        tabBarLabel="首页"
                        title="首页"
                        initial
                        icon={() => <Icon name="home" size={20} />}
                    />
                    <Scene
                        key="user"
                        component={User}
                        tabBarLabel="我的"
                        icon={() => <Icon name="user" size={20} />}
                    />
                </Tabs>
                <Scene key="login" component={Login} title="登录" failure={() => false} on={() => false} />
            </Stack>
        </Router>
    );
}
