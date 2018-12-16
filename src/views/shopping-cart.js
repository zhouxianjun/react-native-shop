import React, { Component } from 'react';
import { View, FlatList, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import PropTypes from 'prop-types';
import GoodsItem from '../components/goods-item';

@inject('ShoppingCartStore')
@observer
class ShoppingCartView extends Component {
    static propTypes = {
        ShoppingCartStore: PropTypes.any.isRequired
    }

    @computed get list () {
        const { ShoppingCartStore } = this.props;
        return ShoppingCartStore.data.map(item => ({ ...item }));
    }

    render () {
        return !this.list || this.list.length <= 0 ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>空空如也</Text>
            </View>
        ) : (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <FlatList
                    data={this.list}
                    ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#ddd' }} />}
                    keyExtractor={item => `${item.id}`}
                    renderItem={({ item }) => <GoodsItem unit={item} />}
                />
            </View>
        );
    }
}

export default ShoppingCartView;
