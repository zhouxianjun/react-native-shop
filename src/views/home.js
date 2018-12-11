import React, { Component } from 'react';
import {
    View, Text, FlatList, StyleSheet, TouchableOpacity, Image
} from 'react-native';
import { inject, observer } from 'mobx-react';
import { SearchBar } from 'antd-mobile-rn';
import { get } from '../lib/axios';
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
const load = cate => Array.from({ length: 20 }).map((item, index) => Object.assign({
    key: `key-${index}-${cate.key}`,
    name: `name-${index + 1}-${cate.name}`,
    img: 'https://facebook.github.io/react/logo-og.png'
}));

@inject(['UserStore'])
@observer
class Home extends Component {
    constructor (props) {
        super(props);
        this.state = {
            currentCate: null,
            categorys: [],
            goods: []
        };
    }

    async componentDidMount () {
        const { UserStore } = this.props;
        if (UserStore.member) {
            await this.loadAllCategory();
        }
    }

    selectCateHandler (item) {
        this.setState({ currentCate: item.key, goods: load(item) });
    }

    async loadAllCategory () {
        const result = await get('/api/shop/index/category');
        const categorys = result.value || [];
        this.setState({ categorys });
        return categorys;
    }

    pull () {
        console.log(this.state);
    }

    render () {
        const { currentCate, categorys, goods } = this.state;
        return (
            <View>
                <SearchBar placeholder="搜索" />
                <View style={{ flexDirection: 'row', marginBottom: 89 }}>
                    <View style={{ backgroundColor: '#F5F5F5', marginRight: 8 }}>
                        <FlatList
                            data={categorys}
                            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#eee' }} />}
                            keyExtractor={item => `cate-${item.id}`}
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
                            onEndReached={() => this.pull()}
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
            </View>
        );
    }
}

export default Home;
