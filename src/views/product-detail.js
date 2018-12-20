import React, { Component } from 'react';
import {
    View, Text, ScrollView, StatusBar, TouchableOpacity, Image
} from 'react-native';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import Swiper from 'react-native-swiper';
import Placeholder from 'rn-placeholder';
import { get } from '../lib/axios';
import { transformImgUrl, collectionForVo } from '../lib/common';
import GoodsItem from '../components/goods-item';
import ChooseUnit from '../components/choose-unit';

const randomColor = () => Array.from({ length: 6 }).reduce(val => val + (Math.random() * 16 | 0).toString(16), '#');

@inject('ShoppingCartStore')
@observer
class ProductDetail extends Component {
    static propTypes = {
        goodsId: PropTypes.number,
        ShoppingCartStore: PropTypes.any.isRequired
    }

    static defaultProps = {
        goodsId: 0
    }

    state = {
        goods: {},
        item: {},
        loaded: false,
        chooseUnitShow: false
    }

    componentDidMount () {
        this.load();
    }

    @computed get shoppingCart () {
        const { ShoppingCartStore } = this.props;
        return ShoppingCartStore.data;
    }

    @computed get imgs () {
        const { goods } = this.state;
        const array = Array.from(new Set([...(goods.imgs?.split(',') || []), ...(goods.unitPictures?.split(',') || [])]));
        return array.filter(v => !!v).map(v => transformImgUrl(v));
    }

    chooseHandler = () => {
        this.setState({ chooseUnitShow: true });
    }

    closeChoose = () => {
        this.setState({ chooseUnitShow: false });
    }

    async load () {
        const { goodsId } = this.props;
        if (goodsId === 0) return;
        const result = await get(`/api/shop/goods/info/${goodsId}`);
        if (result.success) {
            const goods = result.value;
            collectionForVo(goods, 'unit');
            goods.units = goods.units
                .map(v => ({
                    ...v,
                    quantity: 0,
                    id: Number(v.id),
                    price: Number(v.price),
                    goodsId: goods.id,
                    canSaleQty: goods.canSaleQty,
                    categoryId: goods.categoryId
                }))
                .sort((a, b) => a.price - b.price);
            const choose = goods.units.length > 1;
            const item = { title: goods.name, choose, ...goods.units[0] };
            if (!choose) {
                const cart = this.shoppingCart.find(v => v.id === goods.units[0].id);
                if (cart) {
                    item.quantity = cart.quantity;
                }
            }
            this.setState({ goods, item, loaded: true });
        }
    }

    render () {
        const {
            item, chooseUnitShow, goods, loaded
        } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <View style={{
                    position: 'absolute',
                    top: StatusBar.currentHeight + 5,
                    // backgroundColor: 'transparent',
                    width: '100%',
                    zIndex: 1
                }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                        <TouchableOpacity
                            onPress={Actions.pop}
                            style={{
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                borderRadius: 50,
                                height: 25,
                                width: 25,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Icon name="ios-arrow-back" size={20} color="#FFF" />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={{
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                borderRadius: 50,
                                height: 25,
                                width: 25,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 10
                            }}
                            >
                                <Icon name="ios-cart" size={20} color="#FFF" />
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                borderRadius: 50,
                                height: 25,
                                width: 25,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            >
                                <Icon name="ios-more" size={20} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <ScrollView>
                    {
                        this.imgs && this.imgs.length
                            ? (
                                <Swiper showsButtons autoplay style={{ height: 400, backgroundColor: '#FFF' }}>
                                    {
                                        this.imgs.map(img => <Image key={img} source={{ uri: img }} style={{ height: 400 }} resizeMode="contain" />)
                                    }
                                </Swiper>
                            ) : <View style={{ height: 400 }} />
                    }
                    <View style={{ marginTop: 15, backgroundColor: '#FFF' }}>
                        <Placeholder.ImageContent
                            size={60}
                            animate="fade"
                            lineNumber={3}
                            lastLineWidth="30%"
                            onReady={loaded}
                        >
                            <GoodsItem unit={item} onChoose={this.chooseHandler} />
                        </Placeholder.ImageContent>
                    </View>
                    {/* {
                        Array.from({ length: 30 }).map(() => <View style={{ height: 50, backgroundColor: randomColor() }} />)
                    } */}
                </ScrollView>
                <ChooseUnit visible={chooseUnitShow} onClose={this.closeChoose} goods={goods} />
            </View>
        );
    }
}

export default ProductDetail;
