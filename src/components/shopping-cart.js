import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { observer, inject } from 'mobx-react';

@inject(['ShoppingCartStore'])
@observer
class ShoppingCart extends Component {
    componentDidMount () {
        console.log(this.props.ShoppingCartStore.data);
    }

    render () {
        return (
            <View style={{
                height: 50,
                marginBottom: 15,
                marginHorizontal: 20,
                borderRadius: 25,
                backgroundColor: '#2B2B2B',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}
            >
                <View style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center' }}>
                    <View>
                        <Icon name="cart-plus" size={40} color="yellow" />
                        <View style={{
                            position: 'absolute',
                            right: -5,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'red',
                            borderRadius: 50,
                            width: 15,
                            height: 15
                        }}
                        >
                            <Text style={{ color: '#fff', fontSize: 10 }}>3</Text>
                        </View>
                    </View>
                    <View style={{ marginLeft: 8 }}>
                        <Text style={{ color: '#fff', fontSize: 18 }}>¥19.82</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 12, color: '#666' }}>配送费¥2.00</Text>
                            <Text style={{ fontSize: 10, color: '#666' }}>(满¥10免配送费)</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={{
                    paddingRight: 10,
                    width: 80,
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
