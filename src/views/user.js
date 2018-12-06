import React from 'react';
import { View, Text } from 'react-native';
import UserAvatar from 'react-native-user-avatar';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { Card } from 'antd-mobile-rn';

export default function () {
    return (
        <View style={{ height: 'auto' }}>
            <View style={{
                height: 150, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center'
            }}
            >
                <UserAvatar size="50" name="Alone" src="https://avatars2.githubusercontent.com/u/5254523?s=400&u=03d3b6870da5dc89eabf15e4c06e6a32b95a0ffa&v=4" />
                <Text style={{ fontSize: 16, color: '#fff' }}>Alone</Text>
            </View>
            <Card full style={{ marginTop: 10 }}>
                <Card.Header title="我的订单" style={{ height: 40 }}></Card.Header>
                <Card.Body>
                    <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Icon name="list-alt" size={50} />
                            <Text>全部订单</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Icon name="bars" size={50} />
                            <Text>代支付</Text>
                        </View>
                    </View>
                </Card.Body>
            </Card>
        </View>
    );
}
