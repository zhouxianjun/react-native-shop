import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { computed } from 'mobx';
import { ForceMoney } from '../lib/common';

@inject('ShoppingCartStore', 'UserStore')
@observer
class ShoppingCart extends Component {
    static propTypes = {
        ShoppingCartStore: PropTypes.any.isRequired,
        UserStore: PropTypes.any.isRequired
    }

    @computed get total () {
        const { ShoppingCartStore } = this.props;
        return ShoppingCartStore.total;
    }

    @computed get deliveryFee () {
        const { ShoppingCartStore } = this.props;
        return ForceMoney(ShoppingCartStore.deliveryFee);
    }

    @computed get amount () {
        const { ShoppingCartStore } = this.props;
        return ShoppingCartStore.amount;
    }

    @computed get freeDelivery () {
        const { UserStore } = this.props;
        return ForceMoney(UserStore.freeDelivery);
    }

    render () {
        return (
            <View style={{
                height: px2dp(80),
                marginBottom: px2dp(isIphoneX ? 15 : 8),
                marginHorizontal: px2dp(20),
                borderRadius: 25,
                backgroundColor: '#2B2B2B',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}
            >
                <View style={{ marginLeft: px2dp(20), flexDirection: 'row', alignItems: 'center' }}>
                    <View>
                        <Icon name="cart-plus" size={fontSize(40)} color={this.total > 0 ? 'yellow' : 'gray'} />
                        {
                            this.total > 0 ? (
                                <View style={{
                                    position: 'absolute',
                                    right: -5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'red',
                                    borderRadius: 50,
                                    width: px2dp(25),
                                    height: px2dp(25)
                                }}
                                >
                                    <Text style={{ color: '#fff', fontSize: fontSize(11) }}>{this.total}</Text>
                                </View>
                            ) : null
                        }
                    </View>
                    <View style={{ marginLeft: 8 }}>
                        <Text style={{ color: '#fff', fontSize: fontSize(18) }}>¥{this.amount}</Text>
                        {
                            this.deliveryFee > 0 ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: fontSize(12), color: '#666' }}>配送费¥{this.deliveryFee}</Text>
                                    <Text style={{ fontSize: fontSize(10), color: '#666' }}>(满¥{this.freeDelivery}免配送费)</Text>
                                </View>
                            ) : null
                        }
                    </View>
                </View>
                <TouchableOpacity style={{
                    paddingRight: px2dp(10),
                    width: px2dp(120),
                    borderTopRightRadius: 25,
                    borderBottomRightRadius: 25,
                    height: '100%',
                    backgroundColor: '#CD2626',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                >
                    <Text style={{ color: '#fff' }}>去结算</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default ShoppingCart;
