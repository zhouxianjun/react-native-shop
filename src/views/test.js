import React, { Component } from 'react';
import {
    Image, Text, View
} from 'react-native';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import NumberInput from '../components/number-input';

function load (pageNum) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                value: {
                    isLastPage: pageNum >= 3,
                    list: Array.from({ length: pageNum >= 3 ? 5 : 10 }).map((item, index) => ({
                        id: `${pageNum}-${index}`,
                        name: `test-${pageNum}-${index}`,
                        unitIds: '11',
                        unitNames: '250ml',
                        unitPictures: 'imgs/2540a6aa90fb84b3f6d965143d3e20270c5664e3.jpg',
                        unitPrices: '300'
                    }))
                }
            });
        });
    });
}

export default class Test extends Component {
    pageNum = 1;

    pageSize = 10;

    constructor (props) {
        super(props);
        this.state = {
            goods: [],
            currentCate: null,
            refreshState: RefreshState.EmptyData
        };
    }

    async componentDidMount () {
        this.setState({ currentCate: 1 });
        await this.pull(1, true);
    }

    async pull (category, force = false) {
        if (force === true) {
            this.pageNum = 1;
            this.pageSize = 10;
            this.setState({ goods: [] });
        }
        this.setState({ refreshState: force ? RefreshState.HeaderRefreshing : RefreshState.FooterRefreshing });
        const result = await load(this.pageNum);
        console.log(result);
        if (result.success) {
            this.pageNum += 1;
            this.setState({ refreshState: !result.value || result.value.isLastPage ? RefreshState.NoMoreData : RefreshState.Idle });
            const list = result.value.list || [];
            const { goods } = this.state;
            this.setState({ goods: [...goods, ...list || []] });
        } else {
            this.setState({ refreshState: RefreshState.Failure });
        }
    }

    render () {
        const { currentCate, goods, refreshState } = this.state;
        return (
            <RefreshListView
                listRef={ref => this.list = ref}
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
        );
    }
}
