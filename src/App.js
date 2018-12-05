import React from 'react';
import {
    Router, Stack, Scene, Tabs
} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Login from './views/login';
import Home from './views/home';

export default function () {
    return (
        <Router>
            <Scene key="root" hideNavBar>
                <Tabs key="tabs" tabs>
                    <Scene
                        key="home"
                        component={Home}
                        tabBarLabel="首页"
                        initial
                        icon={() => <Icon name="home" size={20} />}
                    />
                    <Scene
                        key="user"
                        component={Login}
                        tabBarLabel="我的"
                        icon={() => <Icon name="user" size={20} />}
                    />
                </Tabs>
                <Stack key="routers">
                    <Scene key="login" component={Login} title="登录" />
                </Stack>
            </Scene>
        </Router>
    );
}
