import React, { Component } from 'react';
import {
    View, ScrollView, StatusBar, TouchableOpacity, Image, SafeAreaView, StyleSheet, Text
} from 'react-native';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import Swiper from 'react-native-swiper';
import Placeholder from 'rn-placeholder';
import HTML from 'react-native-render-html';
import { get } from '../lib/axios';
import { transformImgUrl, collectionForVo } from '../lib/common';
import GoodsItem from '../components/goods-item';
import ChooseUnit from '../components/choose-unit';

const styles = StyleSheet.create({
    topNav: {
        position: 'absolute',
        zIndex: 1,
        top: isIphoneX ? 45 : StatusBar.currentHeight + 5,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    fullTopNav: {
        top: 0,
        paddingTop: isIphoneX ? 45 : StatusBar.currentHeight + 3,
        paddingBottom: 5,
        backgroundColor: '#FFF'
    },
    navRadiusBtn: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 50
    },
    navBtn: {
        height: 30,
        width: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    navTab: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 100
    },
    navTabLabel: {
        paddingBottom: 5
    },
    navTabLabelActive: {
        color: '#FF6347',
        borderBottomWidth: 1,
        borderBottomColor: '#FF6347'
    }
});

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

    // banner图片 + margin + 商品选择 + margin - 导航栏(导航栏高度 + 3 + paddingBottom + 图标高度)
    detailY = 400 + 15 + 80 + 15 - (StatusBar.currentHeight + 3 + 5 + 30)

    state = {
        goods: {},
        item: {},
        loaded: false,
        chooseUnitShow: false,
        opacity: 1,
        activeTab: 1
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
        return goods.detail || '<div/>';
    }

    chooseHandler = () => {
        this.setState({ chooseUnitShow: true });
    }

    closeChoose = () => {
        this.setState({ chooseUnitShow: false });
    }

    scrollHandler = (e) => {
        const { nativeEvent: { contentOffset: { y } } } = e;
        if (y >= this.detailY) {
            this.setState({ activeTab: 2 });
        } else {
            this.setState({ opacity: (100 - y) / 100, activeTab: 1 });
        }
    }

    scrollToTop = () => this.scroll.scrollTo({ y: 0, animated: true })

    scrollToDetail = () => this.scroll.scrollTo({ y: this.detailY, animated: true })

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
            item, chooseUnitShow, goods, loaded, opacity, activeTab
        } = this.state;
        return (
            <View style={{ flex: 1 }}>
                {
                    opacity > 0 ? (
                        <View style={[styles.topNav, { opacity }]}>
                            <TouchableOpacity onPress={Actions.pop} style={[styles.navBtn, styles.navRadiusBtn]}>
                                <Icon name="ios-arrow-back" size={22} color="#FFF" />
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity style={[styles.navBtn, styles.navRadiusBtn, { marginRight: 15 }]}>
                                    <Icon name="ios-cart" size={22} color="#FFF" />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.navBtn, styles.navRadiusBtn]}>
                                    <Icon name="ios-more" size={22} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : <View />
                }
                {
                    opacity < 1 ? (
                        <View style={[styles.topNav, styles.fullTopNav, { opacity: 1 - opacity }]}>
                            <TouchableOpacity onPress={Actions.pop} style={[styles.navBtn]}>
                                <Icon name="ios-arrow-back" size={22} />
                            </TouchableOpacity>
                            <View style={[styles.navTab]}>
                                <Text onPress={this.scrollToTop} style={[styles.navTabLabel, activeTab === 1 && styles.navTabLabelActive]}>宝贝</Text>
                                <Text onPress={this.scrollToDetail} style={[styles.navTabLabel, activeTab === 2 && styles.navTabLabelActive]}>详情</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity style={[styles.navBtn, { marginRight: 15 }]}>
                                    <Icon name="ios-cart" size={22} />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.navBtn]}>
                                    <Icon name="ios-more" size={22} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : <View />
                }
                <ScrollView onScroll={this.scrollHandler} ref={ref => this.scroll = ref}>
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
                    <HTML style={{ marginTop: 15 }} html={this.detail} imagesMaxWidth={SCREEN_WIDTH} />
                </ScrollView>
                <ChooseUnit visible={chooseUnitShow} onClose={this.closeChoose} goods={goods} />
            </View>
        );
    }
}

export default ProductDetail;
