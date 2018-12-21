import React, { Component } from 'react';
import {
    Router, Stack, Scene, Actions, ActionConst, Tabs, Overlay
} from 'react-native-router-flux';
import { TouchableOpacity, StatusBar } from 'react-native';
import { inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { Toast } from 'antd-mobile-rn';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import SplashScreen from 'react-native-splash-screen';

import Launch from './views/launch';
import Login from './views/login';
import Home from './views/home';
import User from './views/user';
import ProductDetail from './views/product-detail';
import ShoppingCartView from './views/shopping-cart';
import Buy from './views/buy';
import BuySubmit from './components/buy-submit';
import ShoppingCart from './components/shopping-cart';

@inject('UserStore')
class RootRouter extends Component {
    static propTypes = {
        UserStore: PropTypes.any.isRequired
    }

    lastBackPressed = 0

    isLogin = async () => {
        const { UserStore } = this.props;
        const result = await UserStore.isLogin();
        SplashScreen.hide();
        return result;
    }

    backHandler = () => {
        if (Actions.currentScene !== 'home') {
            Actions.pop();
            return true;
        }
        const now = Date.now();
        if (this.lastBackPressed + 2000 >= now) {
            return false;
        }
        this.lastBackPressed = now;
        Toast.info('再按一次退出应用');
        return true;
    }

    resetStatusBar = () => {
        if (isAndroid) {
            StatusBar.setBackgroundColor('gray');
            StatusBar.setBarStyle('default');
            StatusBar.setTranslucent(false);
        }
    }

    enterHome = () => {
        this.resetStatusBar();
    }

    enterGoodsDetail = () => {
        if (isAndroid) {
            StatusBar.setBackgroundColor('transparent');
            StatusBar.setBarStyle('dark-content');
            StatusBar.setTranslucent(true);
        }
    }

    render () {
        return (
            <Router backAndroidHandler={this.backHandler}>
                <Scene key="root" hideNavBar headerMode="screen">
                    <Scene component={Launch} on={this.isLogin} success="app" failure="login" />
                    <Stack key="app" type={ActionConst.RESET}>
                        <Tabs
                            key="appTabs"
                            hideNavBar
                            tabBarComponent={ShoppingCart}
                        >
                            <Stack key="appTabsStack">
                                <Scene
                                    key="home"
                                    component={Home}
                                    tabs
                                    title="首页"
                                    on={this.enterHome}
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
                                <Scene
                                    hideNavBar
                                    key="productDetail"
                                    component={ProductDetail}
                                    title="详情"
                                    on={this.enterGoodsDetail}
                                />
                            </Stack>
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
        );
    }
}

export default RootRouter;
