import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { computed } from 'mobx';
import { Actions } from 'react-native-router-flux';
import { ForceMoney } from '../lib/common';

const [HEIGHT, BOTTOM] = [50, isIphoneX ? 22 : 8];

@inject('ShoppingCartStore', 'UserStore')
@observer
class ShoppingCart extends Component {
    static propTypes = {
        ShoppingCartStore: PropTypes.any.isRequired,
        UserStore: PropTypes.any.isRequired
    }

    static height = HEIGHT

    static bottom = BOTTOM;

    static offsetHeight = HEIGHT + BOTTOM

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
                width: '100%',
                bottom: ShoppingCart.bottom,
                position: 'absolute',
                paddingHorizontal: 20
            }}
            >
                <View style={{
                    height: ShoppingCart.height,
                    borderRadius: 25,
                    backgroundColor: '#2B2B2B',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}
                >
                    <TouchableOpacity
                        onPress={() => Actions.shoppingCart()}
                        disabled={this.total <= 0}
                        style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center' }}
                    >
                        <View>
                            <Icon name="cart-plus" size={40} color={this.total > 0 ? 'yellow' : 'gray'} />
                            {
                                this.total > 0 ? (
                                    <View style={{
                                        position: 'absolute',
                                        right: -5,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'red',
                                        borderRadius: 50,
                                        width: 16,
                                        height: 16
                                    }}
                                    >
                                        <Text style={{ color: '#fff', fontSize: 11 }}>{this.total}</Text>
                                    </View>
                                ) : null
                            }
                        </View>
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{ color: this.total > 0 ? '#fff' : 'gray', fontSize: 18 }}>¥{this.amount}</Text>
                            {
                                this.deliveryFee > 0 ? (
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 12, color: '#666' }}>配送费¥{this.deliveryFee}</Text>
                                        <Text style={{ fontSize: 10, color: '#666' }}>(满¥{this.freeDelivery}免配送费)</Text>
                                    </View>
                                ) : null
                            }
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={this.total <= 0}
                        onPress={Actions.buy}
                        style={{
                            paddingRight: 10,
                            width: 80,
                            borderTopRightRadius: 25,
                            borderBottomRightRadius: 25,
                            height: '100%',
                            backgroundColor: this.total > 0 ? '#CD2626' : 'gray',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Text style={{ color: '#fff' }}>去结算</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default ShoppingCart;
