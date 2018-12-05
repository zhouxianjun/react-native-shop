import React from 'react';
import { View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { TabBar, SearchBar } from 'antd-mobile-rn';

const HomeIcon = require('../../assets/home.png');
const MyIcon = require('../../assets/my.png');

export default () => (
    <View>
        <SearchBar placeholder="搜索" />
        {/* <TabBar
            unselectedTintColor="#949494"
            tintColor="#33A3F4"
            barTintColor="#ccc"
        >
            <TabBar.Item title="首页" icon={HomeIcon}></TabBar.Item>
            <TabBar.Item title="我的" icon={MyIcon}></TabBar.Item>
        </TabBar> */}
    </View>
);
