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

    constructor ({ unit }) {
        super();
        this.state = {
            quantity: unit.quantity || 0,
            max: unit.canSaleQty || 0
        };
    }

    @computed get max () {
        const { ShoppingCartStore, unit } = this.props;
        const { quantity } = this.state;
        return quantity + unit.canSaleQty - ShoppingCartStore.data
            .filter(item => item.goodsId === unit.goodsId)
            .reduce((total, current) => total + current.quantity, 0);
    }

    add = () => {
        this.changeHandler(1);
    }

    changeHandler = (quantity) => {
        this.setState({ quantity });
        const { ShoppingCartStore, unit } = this.props;
        ShoppingCartStore.changeItem({ ...unit, quantity });
    }

    chooseHandler = () => {
        const { unit, onChoose } = this.props;
        onChoose(unit);
    }

    render () {
        const { unit } = this.props;
        const { quantity, max } = this.state;
        console.log(transformImgUrl(unit.picture));
        return (
            <View style={{
                flex: 1,
                flexDirection: 'row',
                paddingHorizontal: px2dp(6),
                paddingVertical: px2dp(10)
            }}
            >
                <View style={{ marginRight: px2dp(10), borderRadius: 5 }}>
                    <Image
                        source={{ uri: transformImgUrl(unit.picture) }}
                        resizeMode="contain"
                        style={{ height: px2dp(120), width: px2dp(120) }}
                    />
                </View>
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: fontSize(14) }}>{unit.title}</Text>
                    {
                        unit.choose ? (
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'flex-end'
                            }}
                            >
                                <Text style={{ fontSize: fontSize(12), color: 'crimson' }}>￥{ForceMoney(unit.price)}</Text>
                                <TouchableOpacity
                                    onPress={this.chooseHandler}
                                    style={{
                                        backgroundColor: '#ff4081',
                                        borderRadius: 25,
                                        paddingHorizontal: px2dp(12),
                                        paddingVertical: px2dp(6)
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontSize: fontSize(10) }}>选规格</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={{
                                flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'flex-end'
                            }}
                            >
                                <View style={{ justifyContent: 'space-between', height: '100%', paddingTop: px2dp(6) }}>
                                    <View>
                                        <Text style={{ fontSize: fontSize(10), color: 'gray' }}>{unit.name}</Text>
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: fontSize(12), color: 'crimson' }}>￥{ForceMoney(unit.price)}</Text>
                                    </View>
                                </View>
                                {
                                    quantity <= 0 ? (
                                        <TouchableOpacity style={{ marginRight: px2dp(10) }} onPress={this.add}>
                                            <Icon name="plus" color="#ff4081" size={fontSize(14)} />
                                        </TouchableOpacity>
                                    ) : <NumberInput min={0} max={max} value={quantity} onChange={this.changeHandler} />
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
