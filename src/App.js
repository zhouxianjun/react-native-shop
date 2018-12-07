import React from 'react';
import {
    Router, Stack, Scene, Modal, Actions
} from 'react-native-router-flux';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Login from './views/login';
import Home from './views/home';
import User from './views/user';

export default function () {
    return (
        <Router>
            <Modal key="root" hideNavBar>
                <Stack key="common">
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
                        icon={() => <Icon name="home" size={20} />}
                    />
                    <Scene
                        key="user"
                        component={User}
                        title="我的"
                        // on={() => false}
                        // failure="login"
                        icon={() => <Icon name="user" size={20} />}
                    />
                </Stack>
                <Stack key="login" title="登录">
                    <Scene key="loginMan" component={Login} />
                </Stack>
            </Modal>
        </Router>
    );
}
