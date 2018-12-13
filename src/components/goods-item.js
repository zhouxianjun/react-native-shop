import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CachedImage } from 'react-native-img-cache';
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
        return (
            <View style={{
                flex: 1, flexDirection: 'row', paddingHorizontal: 4, paddingVertical: 8
            }}
            >
                <View style={{ width: 60, marginRight: 8, borderRadius: 5 }}>
                    <CachedImage source={{ uri: transformImgUrl(unit.picture) }} resizeMode="contain" style={{ height: 60 }} />
                </View>
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 16 }}>{unit.title}</Text>
                    {
                        unit.choose ? (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <Text style={{ fontSize: 12, color: 'crimson' }}>￥{ForceMoney(unit.price)}</Text>
                                <TouchableOpacity
                                    onPress={this.chooseHandler}
                                    style={{
                                        backgroundColor: '#ff4081',
                                        borderRadius: 25,
                                        paddingHorizontal: 8,
                                        paddingVertical: 2
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontSize: 12 }}>选规格</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View>
                                <Text style={{ fontSize: 12, color: 'gray' }}>{unit.name}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <Text style={{ fontSize: 12, color: 'crimson' }}>￥{ForceMoney(unit.price)}</Text>
                                    {
                                        quantity <= 0 ? (
                                            <TouchableOpacity style={{ marginRight: 10 }} onPress={this.add}>
                                                <Icon name="plus" color="#ff4081" size={16} />
                                            </TouchableOpacity>
                                        ) : <NumberInput min={0} max={max} value={quantity} onChange={this.changeHandler} />
                                    }
                                </View>
                            </View>
                        )
                    }
                </View>
            </View>
        );
    }
}

export default GoodsItem;
