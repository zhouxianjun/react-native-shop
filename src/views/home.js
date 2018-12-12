import { SearchBar } from 'antd-mobile-rn';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import {
    FlatList, Image, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
// import { CachedImage } from 'react-native-img-cache';
import NumberInput from '../components/number-input';
import { get } from '../lib/axios';
import { collectionForVo } from '../lib/common';

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

@inject(['UserStore'])
@observer
class Home extends Component {
    pageNum = 1;

    pageSize = 10;

    constructor (props) {
        super(props);
        this.state = {
            currentCate: null,
            categorys: [],
            goods: [],
            refreshState: RefreshState.EmptyData
        };
    }

    async componentDidMount () {
        const { UserStore } = this.props;
        if (UserStore.member) {
            const categorys = await this.loadAllCategory();
            if (categorys && categorys[0]) {
                await this.selectCateHandler(categorys[0]);
            }
        }
    }

    async selectCateHandler (item) {
        this.setState({ currentCate: item.id });
        await this.pull(item.id, true);
    }

    async loadAllCategory () {
        const result = await get('/api/shop/index/category');
        const categorys = result.value || [];
        this.setState({ categorys });
        return categorys;
    }

    async pull (category, force = false) {
        if (force === true) {
            this.pageNum = 1;
            this.pageSize = 10;
            this.setState({ goods: [] });
        }
        this.setState({ refreshState: force ? RefreshState.HeaderRefreshing : RefreshState.FooterRefreshing });
        const result = await get('/api/shop/index/goods', { category, pageNum: this.pageNum, pageSize: this.pageSize });
        if (result.success) {
            this.pageNum += 1;
            this.setState({ refreshState: !result.value || result.value.isLastPage ? RefreshState.NoMoreData : RefreshState.Idle });
            const list = result.value.list || [];
            collectionForVo(list, 'unit');
            list.forEach(item => Reflect.set(item, 'units', item.units
                .map(v => Object.assign({}, v, {
                    quantity: 0,
                    id: Number(v.id),
                    price: Number(v.price),
                    goodsId: item.id,
                    canSaleQty: item.canSaleQty,
                    categoryId: item.categoryId
                }))
                .sort((a, b) => a.price - b.price)));

            const { goods } = this.state;
            this.setState({ goods: [...goods, ...list || []] });
        } else {
            this.setState({ refreshState: RefreshState.Failure });
        }
    }

    render () {
        const {
            currentCate, categorys, goods, refreshState
        } = this.state;
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
                                <TouchableOpacity
                                    style={[styles.cateItem, currentCate === item.id ? styles.cateItemSelect : { backgroundColor: 'white' }]}
                                    onPress={() => this.selectCateHandler(item)}
                                >
                                    <Text style={{ fontSize: 13, color: currentCate === item.id ? 'red' : '#333' }}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                    <View style={{ flex: 1, paddingRight: 4 }}>
                        <RefreshListView
                            data={goods}
                            refreshState={refreshState}
                            onHeaderRefresh={() => this.pull(currentCate, true)}
                            onFooterRefresh={() => this.pull(currentCate)}
                            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#ddd', marginVertical: 8 }} />}
                            keyExtractor={good => `good-${good.id}`}
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
