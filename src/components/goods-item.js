import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity, Image
} from 'react-native';
// import { CachedImage } from 'react-native-img-cache';
import PropTypes from 'prop-types';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import NumberInput from './number-input';
import { ForceMoney, transformImgUrl } from '../lib/common';

@inject(['ShoppingCartStore'])
@observer
class GoodsItem extends Component {
    static propTypes = {
        unit: PropTypes.object.isRequired,
        onChoose: PropTypes.func,
        ShoppingCartStore: PropTypes.object.isRequired
    }

    static defaultProps = {
        onChoose: () => {}
    }

    @computed get quantity () {
        const { unit } = this.props;
        const cart = this.shoppingCart.find(item => item.id === unit.id);
        return (cart ? cart.quantity : unit.quantity) || 0;
    }

    @computed get max () {
        const { unit } = this.props;
        return this.quantity + unit.canSaleQty - this.shoppingCart
            .filter(item => item.goodsId === unit.goodsId)
            .reduce((total, current) => total + current.quantity, 0);
    }

    @computed get shoppingCart () {
        const { ShoppingCartStore } = this.props;
        return ShoppingCartStore.data;
    }

    @computed get picture () {
        const { unit } = this.props;
        return transformImgUrl(unit.picture);
    }

    @computed get price () {
        const { unit } = this.props;
        return ForceMoney(unit.price);
    }

    add = () => {
        this.changeHandler(1);
    }

    changeHandler = (quantity) => {
        const { ShoppingCartStore, unit } = this.props;
        ShoppingCartStore.changeItem({ ...unit, quantity });
    }

    chooseHandler = () => {
        const { unit, onChoose } = this.props;
        onChoose(unit);
    }

    render () {
        const { unit } = this.props;
        return (
            <View style={{
                flex: 1,
                flexDirection: 'row',
                paddingHorizontal: 6,
                paddingVertical: 10
            }}
            >
                <View style={{ marginRight: 10 }}>
                    <Image
                        source={{ uri: this.picture }}
                        resizeMode="contain"
                        style={{ height: 60, width: 60 }}
                    />
                </View>
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 14 }}>{unit.title}</Text>
                    {
                        unit.choose ? (
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'flex-end'
                            }}
                            >
                                <Text style={{ fontSize: 12, color: 'crimson' }}>￥{this.price}</Text>
                                <TouchableOpacity
                                    onPress={this.chooseHandler}
                                    style={{
                                        backgroundColor: '#ff4081',
                                        borderRadius: 25,
                                        paddingHorizontal: 12,
                                        paddingVertical: 6
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontSize: 11 }}>选规格</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={{
                                flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'flex-end'
                            }}
                            >
                                <View style={{ justifyContent: 'space-between', height: '100%', paddingTop: 6 }}>
                                    <View>
                                        <Text style={{ fontSize: 11, color: 'gray' }}>{unit.name}</Text>
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: 12, color: 'crimson' }}>￥{this.price}</Text>
                                    </View>
                                </View>
                                {
                                    this.quantity <= 0 ? (
                                        <TouchableOpacity style={{ marginRight: 10 }} onPress={this.add}>
                                            <Icon name="plus" color="#ff4081" size={14} />
                                        </TouchableOpacity>
                                    ) : <NumberInput min={0} max={this.max} value={this.quantity} onChange={this.changeHandler} />
                                }
                            </View>
                        )
                    }
                </View>
            </View>
        );
    }
}

export default GoodsItem;
