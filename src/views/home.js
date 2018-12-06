import React from 'react';
import { View, Text } from 'react-native';
import { SearchBar } from 'antd-mobile-rn';
import { Actions } from 'react-native-router-flux';

export default () => (
    <View>
        <SearchBar placeholder="搜索" />
        <Text onPress={() => Actions.login()}>去登录</Text>
    </View>
);
