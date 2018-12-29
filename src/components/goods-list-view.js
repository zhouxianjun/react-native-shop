import React, { Component } from 'react';
import { View } from 'react-native';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import PropTypes from 'prop-types';
import { computed, reaction } from 'mobx';
import { inject, observer } from 'mobx-react';
import GoodsItem from './goods-item';
import ChooseUnit from './choose-unit';
import { get } from '../lib/axios';
import { collectionForVo } from '../lib/common';
import ShoppingCart from './shopping-cart';

@inject(['ShoppingCartStore'])
@observer
class GoodsListView extends Component {
    static propTypes = {
        category: PropTypes.number,
        ShoppingCartStore: PropTypes.object.isRequired
    }

    static defaultProps = {
        category: null
    }

    pageNum = 1;

    pageSize = 10;

    changeListState = true

    state = {
        refreshState: RefreshState.EmptyData,
        chooseUnitShow: false,
        chooseGoods: {},
        list: []
    }

    constructor (props) {
        super(props);
        reaction(() => {
            const { category } = this.props;
            return category;
        }, async () => {
            this.changeListState = false;
            await this.refresh();
            this.changeListState = true;
        });
    }

    @computed get shoppingCart () {
        const { ShoppingCartStore } = this.props;
        return ShoppingCartStore.data;
    }

    @computed get data () {
        const { list } = this.state;
        return list.map((item) => {
            const choose = item.units.length > 1;
            const newer = { title: item.name, choose, ...item.units[0] };
            if (!choose) {
                const cart = this.shoppingCart.find(v => v.id === item.units[0].id);
                if (cart) {
                    newer.quantity = cart.quantity;
                }
            }
            return newer;
        });
    }

    chooseHandler = (unit) => {
        const { list } = this.state;
        const chooseGoods = list.find(item => item.id === unit.goodsId);
        if (chooseGoods) {
            this.setState({ chooseGoods, chooseUnitShow: true });
        }
    }

    closeChoose = () => {
        this.setState({ chooseUnitShow: false });
    }

    refresh = async () => this.pull(true)

    pull = async (force = false) => {
        if (force === true) {
            this.pageNum = 1;
            this.pageSize = 10;
            this.setState({ list: [] });
        }
        const { category } = this.props;
        if (this.changeListState) {
            this.setState({ refreshState: force ? RefreshState.HeaderRefreshing : RefreshState.FooterRefreshing });
        }
        const result = await get('/api/shop/index/goods', { category, pageNum: this.pageNum, pageSize: this.pageSize }, { loading: 'loading...' });
        if (result.success) {
            this.pageNum += 1;
            const data = result.value.list || [];
            collectionForVo(data, 'unit');
            data.forEach(item => Reflect.set(item, 'units', item.units
                .map(v => ({
                    ...v,
                    quantity: 0,
                    id: Number(v.id),
                    price: Number(v.price),
                    goodsId: item.id,
                    canSaleQty: item.canSaleQty,
                    categoryId: item.categoryId
                }))
                .sort((a, b) => a.price - b.price)));

            const { list } = this.state;

            const refreshState = !result.value || result.value.isLastPage ? RefreshState.NoMoreData : RefreshState.Idle;
            this.setState({ list: [...list, ...data || []], refreshState });
        } else {
            this.setState({ refreshState: RefreshState.Failure });
        }
    }

    render () {
        const {
            refreshState, chooseUnitShow, chooseGoods
        } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <RefreshListView
                    style={{ backgroundColor: '#fff' }}
                    data={this.data}
                    refreshState={refreshState}
                    onHeaderRefresh={this.refresh}
                    onFooterRefresh={this.pull}
                    footerNoMoreDataComponent={<View style={{ height: ShoppingCart.offsetHeight }} />}
                    ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#ddd' }} />}
                    keyExtractor={item => `goods-${item.goodsId}`}
                    renderItem={({ item }) => <GoodsItem unit={item} onChoose={this.chooseHandler} />}
                />
                <ChooseUnit visible={chooseUnitShow} onClose={this.closeChoose} goods={chooseGoods} />
            </View>
        );
    }
}

export default GoodsListView;
