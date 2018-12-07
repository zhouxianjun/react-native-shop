import React, { Component } from 'react';
import {
    View, Text, FlatList, StyleSheet, TouchableOpacity, Image
} from 'react-native';
import { SearchBar } from 'antd-mobile-rn';
import { Actions } from 'react-native-router-flux';

const styles = StyleSheet.create({
    cateItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 40
    },
    cateItemSelect: {
        backgroundColor: '#F5F5F5',
        borderLeftWidth: 3,
        borderLeftColor: 'red'
    }
});
const data = Array.from({ length: 20 }).map((item, index) => Object.assign({
    key: `key-${index}`,
    name: `name-${index + 1}`
}));
const load = cate => Array.from({ length: 30 }).map((item, index) => Object.assign({
    key: `key-${index}-${cate.key}`,
    name: `name-${index + 1}-${cate.name}`
}));
export default class Home extends Component {
    constructor (props) {
        super(props);
        this.state = {
            currentCate: null,
            goods: []
        };
    }

    selectCateHandler (item) {
        this.setState({ currentCate: item.key, goods: load(item) });
    }

    render () {
        const { currentCate, goods } = this.state;
        return (
            <View>
                <SearchBar placeholder="搜索" />
                <View style={{ flexDirection: 'row', marginBottom: 89 }}>
                    <View style={{ backgroundColor: '#F5F5F5' }}>
                        <FlatList
                            data={data}
                            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#eee' }} />}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={[styles.cateItem, currentCate === item.key ? styles.cateItemSelect : { backgroundColor: 'white' }]} onPress={() => this.selectCateHandler(item)}>
                                    <Text style={{ fontSize: 13, color: currentCate === item.key ? 'red' : '#333' }}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={goods}
                            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#eee' }} />}
                            renderItem={({ item }) => (
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={{ width: 60 }}>
                                        <Image />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text>{item.name}</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text>￥0.10</Text>
                                            <View style={{ marginRight: 'auto' }}>
                                                <Text>
                                                +
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                </View>
            </View>
        );
    }
}
