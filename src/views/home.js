import { SearchBar } from '@ant-design/react-native';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import {
    FlatList, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { get } from '../lib/axios';
import GoodsListView from '../components/goods-list-view';

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
    constructor (props) {
        super(props);
        this.state = {
            currentCate: null,
            categorys: []
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
    }

    async loadAllCategory () {
        const result = await get('/api/shop/index/category');
        const categorys = result.value || [];
        this.setState({ categorys });
        return categorys;
    }

    render () {
        const { currentCate, categorys } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <SearchBar placeholder="搜索" styles={{ search: { top: 10, height: 20, width: 20 } }} />
                <View style={{ flexDirection: 'row', flex: 1 }}>
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
                                    <Text style={{ fontSize: 14, color: currentCate === item.id ? 'red' : '#333' }}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <GoodsListView
                            category={currentCate}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

export default Home;
