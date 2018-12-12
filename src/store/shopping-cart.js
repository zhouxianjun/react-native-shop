import { observable, action } from 'mobx';
import { AsyncStorage } from 'react-native';
import axios from 'axios';
import UserStore from './user';

class ShoppingCartStore {
    @observable
    data;

    static async load (code) {
        const data = await AsyncStorage.getItem(`SHOPPING_CART_${code}`);
        try {
            return JSON.parse(data);
        } catch (err) {
            return [];
        }
    }

    async save (code, data) {
        await AsyncStorage.setItem(`SHOPPING_CART_${code}`, JSON.stringify(data));
        this.data = data;
    }
}

export default new ShoppingCartStore();
