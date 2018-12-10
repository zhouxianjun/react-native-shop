import React, { Component } from 'react';
import {
    View, Text, FlatList, StyleSheet, TouchableOpacity, Image
} from 'react-native';
import { inject } from 'mobx-react';
import { SearchBar } from 'antd-mobile-rn';
import NumberInput from '../components/number-input';

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
const load = cate => Array.from({ length: 20 }).map((item, index) => Object.assign({
    key: `key-${index}-${cate.key}`,
    name: `name-${index + 1}-${cate.name}`,
    img: 'https://facebook.github.io/react/logo-og.png'
}));

@inject(['UserStore'])
class Home extends Component {
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

    pull () {
        console.log(this.state);
    }

    render () {
        const { currentCate, goods } = this.state;
        return (
            <View>
                <SearchBar placeholder="搜索" />
                <View style={{ flexDirection: 'row', marginBottom: 89 }}>
                    <View style={{ backgroundColor: '#F5F5F5', marginRight: 8 }}>
                        <FlatList
                            data={data}
                            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#eee' }} />}
                            onEndReached={() => this.pull()}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={[styles.cateItem, currentCate === item.key ? styles.cateItemSelect : { backgroundColor: 'white' }]} onPress={() => this.selectCateHandler(item)}>
                                    <Text style={{ fontSize: 13, color: currentCate === item.key ? 'red' : '#333' }}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                    <View style={{ flex: 1, paddingRight: 4 }}>
                        <FlatList
                            data={goods}
                            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#ddd', marginVertical: 8 }} />}
                            renderItem={({ item }) => (
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={{ width: 60, marginRight: 8, borderRadius: 5 }}>
                                        <Image source={{ uri: 'https://facebook.github.io/react/logo-og.png' }} style={{ height: 60 }} />
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                                        <Text style={{ fontSize: 20 }}>{item.name}</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                            <Text style={{ fontSize: 12, color: 'red' }}>￥0.10</Text>
                                            <View style={{}}>
                                                <NumberInput min={0} />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                </View>
                <View style={{
                    height: 60,
                    backgroundColor: 'red'
                }}
                >
                    <Text>bottom</Text>
                </View>
            </View>
        );
    }
}

export default Home;
