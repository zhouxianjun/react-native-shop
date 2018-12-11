import React from 'react';
import {
    Router, Stack, Scene, Actions, ActionConst
} from 'react-native-router-flux';
import { TouchableOpacity } from 'react-native';
import { Provider } from 'mobx-react';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import store, { UserStore } from './store';
import Launch from './views/launch';
import Login from './views/login';
import Home from './views/home';
import User from './views/user';

export default function () {
    return (
        <Provider {...store}>
            <Router>
                <Scene key="root" hideNavBar headerMode="screen">
                    <Scene component={Launch} on={() => UserStore.isLogin()} success="app" failure="login" />
                    <Stack key="app" type={ActionConst.RESET}>
                        <Scene
                            key="home"
                            component={Home}
                            title="首页"
                            type="reset"
                            titleStyle={{ alignSelf: 'center', justifyContent: 'center' }}
                            renderRightButton={() => (
                                <TouchableOpacity onPress={() => Actions.user()}>
                                    <Icon style={{ marginRight: 10 }} name="user" size={18} />
                                </TouchableOpacity>
                            )}
                            icon={() => <Icon name="home" size={20} />}
                        />
                        <Scene
                            key="user"
                            component={User}
                            title="我的"
                            icon={() => <Icon name="user" size={20} />}
                        />
                    </Stack>
                    <Stack key="login" title="登录" type={ActionConst.RESET}>
                        <Scene key="loginMan" component={Login} />
                    </Stack>
                </Scene>
            </Router>
        </Provider>
    );
}
