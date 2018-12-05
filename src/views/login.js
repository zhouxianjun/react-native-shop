import React, { Component } from 'react';
import { View } from 'react-native';
import { InputItem, List, Button } from 'antd-mobile-rn';

export default class Login extends Component {
    constructor (props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    }

    loginHandler () {
        const { username, password } = this.state;
        console.log(username, password);
    }

    render () {
        return (
            <View style={{ flex: 1 }}>
                <List>
                    <InputItem placeholder="用户名" onChange={username => this.setState({ username })} />
                    <InputItem type="password" placeholder="密码" onChange={password => this.setState({ password })} />
                </List>
                <Button onClick={() => this.loginHandler()} />
            </View>
        );
    }
}
