import React from 'react';
import {
    Router, Stack, Scene, Actions, ActionConst, Tabs, Overlay
} from 'react-native-router-flux';
import { TouchableOpacity } from 'react-native';
import { Provider } from 'mobx-react';
import { Toast } from 'antd-mobile-rn';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import store, { UserStore } from './store';
import Launch from './views/launch';
import Login from './views/login';
import Home from './views/home';
import User from './views/user';
import ShoppingCartView from './views/shopping-cart';
import Buy from './views/buy';
import BuySubmit from './components/buy-submit';
import ShoppingCart from './components/shopping-cart';

let lastBackPressed = 0;
export default function () {
    return (
        <Provider {...store}>
            <Router backAndroidHandler={() => {
                if (Actions.currentScene !== 'home') {
                    Actions.pop();
                    return true;
                }
                if (lastBackPressed + 2000 >= Date.now()) {
                    return false;
                }
                lastBackPressed = Date.now();
                Toast.info('再按一次退出应用');
                return true;
            }}
            >
                <Scene key="root" hideNavBar headerMode="screen">
                    <Scene component={Launch} on={() => UserStore.isLogin()} success="app" failure="login" />
                    <Stack key="app" type={ActionConst.RESET}>
                        <Tabs
                            key="home"
                            hideNavBar
                            tabBarComponent={ShoppingCart}
                        >
                            <Scene
                                key="_home"
                                component={Home}
                                tabs
                                title="首页"
                                titleStyle={{ alignSelf: 'center', justifyContent: 'center' }}
                                renderRightButton={() => (
                                    <TouchableOpacity onPress={Actions.user}>
                                        <Icon style={{ marginRight: 10 }} name="user" size={18} />
                                    </TouchableOpacity>
                                )}
                            />
                            <Overlay
                                key="shoppingCart"
                                back
                                title="购物车"
                                component={ShoppingCartView}
                            />
                        </Tabs>

                        <Scene
                            key="user"
                            component={User}
                            title="我的"
                        />
                        <Tabs
                            key="buy"
                            hideNavBar
                            back
                            tabBarComponent={BuySubmit}
                        >
                            <Scene
                                key="_buy"
                                component={Buy}
                                title="提交订单"
                            />
                        </Tabs>
                    </Stack>
                    <Stack key="login" title="登录" type={ActionConst.RESET}>
                        <Scene key="loginMan" component={Login} />
                    </Stack>
                </Scene>
            </Router>
        </Provider>
    );
}
