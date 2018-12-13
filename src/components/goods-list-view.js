import React, { Component } from 'react';
import {
    View, Image, Text, TouchableOpacity
} from 'react-native';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import PropTypes from 'prop-types';
import { computed, reaction } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Modal } from 'antd-mobile-rn';
import GoodsItem from './goods-item';
import { get } from '../lib/axios';
import NumberInput from './number-input';
import {
    collectionForVo, ForceMoney, transformImgUrl, isIphoneX
} from '../lib/common';

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

    state = {
        refreshState: RefreshState.EmptyData,
        chooseUnitShow: false,
        chooseUnit: {},
        currentUnits: [],
        list: []
    }

    constructor (props) {
        super(props);
        reaction(() => {
            const { category } = this.props;
            return category;
        }, this.refresh);
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
        const goods = list.find(item => item.id === unit.goodsId);
        if (goods) {
            const currentUnits = goods.units;
            currentUnits.forEach((v) => {
                const cart = this.shoppingCart.find(c => c.id === v.id);
                if (cart) {
                    Reflect.set(v, 'quantity', cart.quantity);
                }
            });

            this.setState({ chooseUnit: unit, currentUnits, chooseUnitShow: true });
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
        this.setState({ refreshState: force ? RefreshState.HeaderRefreshing : RefreshState.FooterRefreshing });
        const result = await get('/api/shop/index/goods', { category, pageNum: this.pageNum, pageSize: this.pageSize });
        if (result.success) {
            this.pageNum += 1;
            this.setState({ refreshState: !result.value || result.value.isLastPage ? RefreshState.NoMoreData : RefreshState.Idle });
            const data = result.value.list || [];
            collectionForVo(data, 'unit');
            data.forEach(item => Reflect.set(item, 'units', item.units
                .map(v => Object.assign({}, v, {
                    quantity: 0,
                    id: Number(v.id),
                    price: Number(v.price),
                    goodsId: item.id,
                    canSaleQty: item.canSaleQty,
                    categoryId: item.categoryId
                }))
                .sort((a, b) => a.price - b.price)));

            const { list } = this.state;
            this.setState({ list: [...list, ...data || []] });
        } else {
            this.setState({ refreshState: RefreshState.Failure });
        }
    }

    changeUnit (chooseUnit) {
        this.setState({ chooseUnit });
    }

    render () {
        const {
            refreshState, chooseUnitShow, chooseUnit, currentUnits
        } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <Modal
                    popup
                    style={{ paddingHorizontal: px2dp(8), paddingBottom: isIphoneX ? px2dp(60) : 0 }}
                    visible={chooseUnitShow}
                    maskClosable
                    onClose={this.closeChoose}
                    animationType="slide-up"
                >
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: px2dp(4)
                    }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                source={{ uri: transformImgUrl(chooseUnit.picture) }}
                                resizeMode="contain"
                                style={{ height: px2dp(120), width: px2dp(120) }}
                            />
                            <View style={{ justifyContent: 'center', marginLeft: px2dp(10) }}>
                                <Text>{chooseUnit.name}</Text>
                            </View>
                        </View>
                        <Text style={{ color: 'crimson' }}>{ForceMoney(chooseUnit.price)}</Text>
                    </View>
                    <View style={{ height: 1, backgroundColor: '#ddd' }} />
                    <View>
                        <View style={{ flexDirection: 'row' }}>
                            {currentUnits.map(u => (
                                <TouchableOpacity
                                    key={`choose-unit-${u.id}`}
                                    onPress={() => this.changeUnit(u)}
                                    style={{
                                        backgroundColor: chooseUnit.id === u.id ? '#ff4081' : 'gray',
                                        paddingHorizontal: px2dp(10),
                                        paddingVertical: px2dp(6),
                                        borderRadius: 25,
                                        marginHorizontal: px2dp(6),
                                        marginVertical: px2dp(8)
                                    }}
                                >
                                    <Text style={{ color: chooseUnit.id === u.id ? '#fff' : '#000' }}>{u.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: px2dp(10)
                        }}
                        >
                            <Text>数量</Text>
                            <NumberInput />
                        </View>
                    </View>
                </Modal>
                <RefreshListView
                    style={{ backgroundColor: '#fff' }}
                    data={this.data}
                    refreshState={refreshState}
                    onHeaderRefresh={this.refresh}
                    onFooterRefresh={this.pull}
                    footerNoMoreDataComponent={<View />}
                    ItemSeparatorComponent={() => <View style={{ height: px2dp(1), backgroundColor: '#ddd' }} />}
                    keyExtractor={item => `goods-${item.goodsId}`}
                    renderItem={({ item }) => <GoodsItem unit={item} onChoose={this.chooseHandler} />}
                />
            </View>
        );
    }
}

export default GoodsListView;
