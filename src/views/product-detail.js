import React, { Component } from 'react';
import {
    View, Text, ScrollView, StatusBar, TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import Swiper from 'react-native-swiper';
import { get } from '../lib/axios';

const randomColor = () => Array.from({ length: 6 }).reduce(val => val + (Math.random() * 16 | 0).toString(16), '#');

class ProductDetail extends Component {
    static propTypes = {
        goodsId: PropTypes.number.isRequired
    }

    componentDidMount () {
        this.load();
    }

    async load () {
        const { goodsId } = this.props;
        const result = await get(`/api/shop/goods/info/${goodsId}`);
        console.log(result);
    }

    render () {
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
                <ScrollView style={{ marginTop: 0 }}>
                    {
                        Array.from({ length: 30 }).map(() => <View style={{ height: 50, backgroundColor: randomColor() }} />)
                    }
                </ScrollView>
            </View>
        );
    }
}

export default ProductDetail;
