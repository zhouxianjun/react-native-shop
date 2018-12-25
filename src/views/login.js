import React, { Component } from 'react';
import { View } from 'react-native';
import { InputItem, List, Button } from '@ant-design/react-native';
import { inject } from 'mobx-react';
import { Actions } from 'react-native-router-flux';

@inject(['UserStore'])
class Login extends Component {
    constructor (props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    }

    async loginHandler () {
        const { username, password } = this.state;
        console.log(username, password);
        const { UserStore } = this.props;
        const result = await UserStore.login();
        if (result) {
            Actions.replace('home');
        }
    }

    render () {
        return (
            <View style={{ flex: 1 }}>
                <List>
                    <InputItem placeholder="用户名" onChange={username => this.setState({ username })} />
                    <InputItem type="password" placeholder="密码" onChange={password => this.setState({ password })} />
                </List>
                <Button onClick={() => this.loginHandler()}>登录</Button>
            </View>
        );
    }
}

export default Login;
