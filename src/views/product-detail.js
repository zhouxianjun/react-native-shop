import React, { Component } from 'react';
import {
    View, ScrollView, StatusBar, TouchableOpacity, Image, SafeAreaView, WebView
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

/* eslint-disable no-bitwise */
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

    @computed get detail () {
        const { goods } = this.state;
        return goods.detail || '';
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
                    top: isIphoneX ? 45 : StatusBar.currentHeight + 5,
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
                                height: 30,
                                width: 30,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Icon name="ios-arrow-back" size={22} color="#FFF" />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={{
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                borderRadius: 50,
                                height: 30,
                                width: 30,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 15
                            }}
                            >
                                <Icon name="ios-cart" size={22} color="#FFF" />
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                borderRadius: 50,
                                height: 30,
                                width: 30,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            >
                                <Icon name="ios-more" size={22} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <ScrollView>
                    <SafeAreaView style={{ height: 400, backgroundColor: '#FFF' }}>
                        {
                            this.imgs && this.imgs.length
                                ? (
                                    <Swiper showsButtons autoplay>
                                        {
                                            this.imgs.map(img => <Image key={img} source={{ uri: img }} style={{ height: 400 }} resizeMode="contain" />)
                                        }
                                    </Swiper>
                                ) : <View />
                        }
                    </SafeAreaView>
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
                    <View style={{ marginTop: 15 }}>
                        {
                            Array.from({ length: 6 }).map((item, i) => <View key={`${i}`} style={{ height: 50, backgroundColor: randomColor() }} />)
                        }
                    </View>
                    <View style={{ backgroundColor: 'red', height: 500 }}>
                        <WebView originWhitelist={['*']} source={{ html: this.detail }} />
                    </View>
                </ScrollView>
                <ChooseUnit visible={chooseUnitShow} onClose={this.closeChoose} goods={goods} />
            </View>
        );
    }
}

export default ProductDetail;
