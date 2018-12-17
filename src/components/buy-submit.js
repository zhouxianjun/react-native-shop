import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import { ForceMoney } from '../lib/common';

@inject('ShoppingCartStore')
@observer
class Submit extends Component {
    static propTypes = {
        ShoppingCartStore: PropTypes.any.isRequired
    }

    @computed get amount () {
        const { ShoppingCartStore } = this.props;
        return ShoppingCartStore.amount;
    }

    @computed get discount () {
        const { ShoppingCartStore } = this.props;
        return ForceMoney(ShoppingCartStore.discount);
    }

    render () {
        return (
            <View style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                height: 50,
                backgroundColor: '#2B2B2B',
                marginBottom: isIphoneX ? 22 : 0
            }}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 14
                }}
                >
                    <Text style={{ color: '#fff', fontSize: 12 }}>已优惠 ￥{this.discount}</Text>
                    <Text style={{ color: '#fff', fontSize: 18 }}>合计 ￥{this.amount}</Text>
                </View>
                <TouchableOpacity style={{
                    height: '100%',
                    width: 100,
                    backgroundColor: '#EEB422',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                >
                    <Text>提交订单</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default Submit;
