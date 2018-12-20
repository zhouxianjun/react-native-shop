import React, { Component } from 'react';
import {
    View, Image, Text, TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { computed, reaction } from 'mobx';
import { Modal } from 'antd-mobile-rn';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import NumberInput from './number-input';
import { ForceMoney, transformImgUrl } from '../lib/common';

@inject(['ShoppingCartStore'])
@observer
class ChooseUnit extends Component {
    static propTypes = {
        visible: PropTypes.bool,
        onClose: PropTypes.func,
        goods: PropTypes.object.isRequired,
        ShoppingCartStore: PropTypes.object.isRequired
    }

    static defaultProps = {
        visible: false,
        onClose: () => {}
    }

    state = {
        unit: {}
    }

    constructor (props) {
        super(props);
        this.dispose = reaction(() => {
            const { goods } = this.props;
            if (goods.units) {
                const find = this.shoppingCart.find(item => item.goodsId === goods.id && item.quantity > 0);
                const { unit } = this.state;
                return find || (unit?.id ? unit : goods.units[0]);
            }
            return {};
        }, unit => this.setState({ unit }));
    }

    componentWillUnmount () {
        this.dispose();
    }

    @computed get units () {
        const { goods } = this.props;
        return goods.units;
    }

    @computed get quantity () {
        const { unit } = this.state;
        const cart = this.shoppingCart.find(item => item.id === unit.id);
        return cart?.quantity || 0;
    }

    @computed get max () {
        const { unit } = this.state;
        return this.quantity + unit.canSaleQty - this.shoppingCart
            .filter(item => item.goodsId === unit.goodsId)
            .reduce((total, current) => total + current.quantity, 0);
    }

    @computed get shoppingCart () {
        const { ShoppingCartStore } = this.props;
        return ShoppingCartStore.data;
    }

    @computed get picture () {
        const { unit } = this.state;
        return transformImgUrl(unit.picture);
    }

    @computed get price () {
        const { unit } = this.state;
        return ForceMoney(unit.price);
    }

    add = () => {
        this.changeQuantityHandler(1);
    }

    changeQuantityHandler = (quantity) => {
        const { unit } = this.state;
        const { goods } = this.props;
        const newer = { ...unit, quantity, title: goods.name };
        this.setState({ unit: newer });
        const { ShoppingCartStore } = this.props;
        ShoppingCartStore.changeItem(newer);
    }

    changeUnit (unit) {
        this.setState({ unit });
    }

    render () {
        const { visible, goods, onClose } = this.props;
        if (!visible || !goods || !this.units) {
            return <View />;
        }
        const { unit } = this.state;
        return (
            <Modal
                visible={visible}
                maskClosable
                transparent
                title={goods.name}
                onClose={onClose}
                style={{ paddingTop: 6 }}
                bodyStyle={{ paddingBottom: 0, paddingHorizontal: 0 }}
            >
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 10
                }}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            source={{ uri: this.picture }}
                            resizeMode="contain"
                            style={{ height: 80, width: 80 }}
                        />
                        <View style={{ justifyContent: 'center', marginLeft: 10 }}>
                            <Text>{unit.name}</Text>
                        </View>
                    </View>
                    <Text style={{ color: 'crimson', fontSize: 16 }}>￥{this.price}</Text>
                </View>
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        {this.units.map(u => (
                            <TouchableOpacity
                                key={`choose-unit-${u.id}`}
                                onPress={() => this.changeUnit(u)}
                                style={{
                                    backgroundColor: unit.id === u.id ? '#ff4081' : 'gray',
                                    paddingHorizontal: 14,
                                    paddingVertical: 6,
                                    borderRadius: 25,
                                    marginHorizontal: 8,
                                    marginVertical: 8
                                }}
                            >
                                <Text style={{ color: unit.id === u.id ? '#fff' : '#000', fontSize: 12 }}>{u.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10,
                        paddingVertical: 16,
                        paddingHorizontal: 10,
                        backgroundColor: '#eee'
                    }}
                    >
                        <Text>数量</Text>
                        {this.quantity > 0
                            ? <NumberInput min={0} max={this.max} value={this.quantity} onChange={this.changeQuantityHandler} /> : (
                                <TouchableOpacity
                                    onPress={this.add}
                                    style={{
                                        flexDirection: 'row',
                                        backgroundColor: '#ff4081',
                                        borderRadius: 25,
                                        paddingHorizontal: 14,
                                        paddingVertical: 6
                                    }}
                                >
                                    <Icon name="md-add" color="#fff" size={16} />
                                    <Text style={{ color: '#fff', fontSize: 12, marginLeft: 4 }}>加入购物车</Text>
                                </TouchableOpacity>
                            )}
                    </View>
                </View>
            </Modal>
        );
    }
}

export default ChooseUnit;
