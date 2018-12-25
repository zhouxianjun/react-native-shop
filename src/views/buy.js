import React, { Component } from 'react';
import {
    View, Text, FlatList
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import { TextareaItem } from '@ant-design/react-native';
import GoodsItem from '../components/goods-item';
import { ForceMoney } from '../lib/common';

@inject('ShoppingCartStore', 'UserStore')
@observer
class Buy extends Component {
    static propTypes = {
        UserStore: PropTypes.any.isRequired,
        ShoppingCartStore: PropTypes.any.isRequired
    }

    componentDidMount () {
        const { UserStore } = this.props;
        UserStore.loadAuthInfo({ force: true });
    }

    @computed get list () {
        const { ShoppingCartStore } = this.props;
        return ShoppingCartStore.data.map(item => ({ ...item }));
    }

    @computed get deliveryFee () {
        const { ShoppingCartStore } = this.props;
        return ForceMoney(ShoppingCartStore.deliveryFee);
    }

    @computed get amount () {
        const { ShoppingCartStore } = this.props;
        return ShoppingCartStore.amount;
    }

    @computed get address () {
        const { UserStore } = this.props;
        return UserStore?.member?.store?.address;
    }

    render () {
        return (
            <View>
                <View style={{ padding: 14, backgroundColor: '#FFF' }}>
                    <View style={{ marginLeft: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon name="ios-pin" size={18} style={{ position: 'absolute', left: -14, bottom: -1 }} />
                            <Text style={{ fontSize: 16 }}>配送地址</Text>
                        </View>
                        <View style={{ height: 1, backgroundColor: '#eee', marginVertical: 4 }} />
                        <View>
                            <Text>Alone 18684897151</Text>
                            <Text>{this.address}</Text>
                            <Text>房号: 505</Text>
                        </View>
                    </View>
                </View>
                <View style={{ padding: 14, backgroundColor: '#FFF', marginTop: 16 }}>
                    <View style={{ marginLeft: 10 }}>
                        <View style={{ flexDirection: 'row', paddingLeft: 4 }}>
                            <Icon name="ios-briefcase" size={18} style={{ position: 'absolute', left: -14, bottom: -1 }} />
                            <Text style={{ fontSize: 16 }}>梅溪湖店</Text>
                        </View>
                        <View style={{ height: 1, backgroundColor: '#eee', marginVertical: 4 }} />
                        <FlatList
                            data={this.list}
                            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#eee' }} />}
                            keyExtractor={item => `${item.id}`}
                            renderItem={({ item }) => <GoodsItem unit={item} edit={false} />}
                        />
                    </View>
                </View>
                <View style={{ padding: 14, backgroundColor: '#FFF', marginTop: 16 }}>
                    <View style={{ alignItems: 'flex-end', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text>配送费：</Text>
                            <Text style={{ color: '#EE4000' }}>￥{this.deliveryFee}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text>商品合计：</Text>
                            <Text style={{ color: '#EE4000' }}>￥{this.amount}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ backgroundColor: '#FFF', marginTop: 16 }}>
                    <TextareaItem placeholder="请输入备注" count={45} rows={3} />
                </View>
            </View>
        );
    }
}
export default Buy;
