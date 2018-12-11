import React from 'react';
import {
    Router, Stack, Scene, Modal, Actions, ActionConst
} from 'react-native-router-flux';
import { TouchableOpacity } from 'react-native';
import { Provider } from 'mobx-react';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import store, { UserStore } from './store';
import Login from './views/login';
import Home from './views/home';
import User from './views/user';

export default function () {
    return (
        <Provider {...store}>
            <Router>
                <Modal key="root" hideNavBar>
                    <Stack key="common" type={ActionConst.REPLACE}>
                        <Scene
                            key="home"
                            component={Home}
                            title="首页"
                            initial
                            titleStyle={{ alignSelf: 'center', justifyContent: 'center' }}
                            renderRightButton={() => (
                                <TouchableOpacity onPress={() => Actions.user()}>
                                    <Icon style={{ marginRight: 10 }} name="user" size={18} />
                                </TouchableOpacity>
                            )}
                            on={() => {
                                console.log(!!UserStore.member);
                                return !!UserStore.member;
                            }}
                            failure="login"
                            icon={() => <Icon name="home" size={20} />}
                        />
                        <Scene
                            key="user"
                            component={User}
                            title="我的"
                            on={() => !!UserStore.member}
                            failure="login"
                            icon={() => <Icon name="user" size={20} />}
                        />
                    </Stack>
                    <Stack key="login" title="登录" type={ActionConst.REPLACE}>
                        <Scene key="loginMan" component={Login} />
                    </Stack>
                </Modal>
            </Router>
        </Provider>
    );
}
