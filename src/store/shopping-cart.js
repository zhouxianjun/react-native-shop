import { observable, autorun } from 'mobx';
import { AsyncStorage } from 'react-native';

class ShoppingCartStore {
    @observable
    data;

    code;

    constructor () {
        autorun(() => {
            AsyncStorage.setItem(`SHOPPING_CART_${this.code}`, JSON.stringify(this.data));
            console.log('update shopping cart', this.data);
        });
    }

    async init (code) {
        this.code = code;
        this.data = await ShoppingCartStore.load(code);
    }

    static async load (code) {
        const data = await AsyncStorage.getItem(`SHOPPING_CART_${code}`);
        try {
            return JSON.parse(data) || [];
        } catch (err) {
            return [];
        }
    }

    async changeItem (item) {
        const { id, quantity } = item;
        const index = this.data.findIndex(d => d.id === id);
        if (quantity > 0) {
            this.data.splice(index, 1, item);
        } else {
            this.data.splice(index, 1);
        }
    }
}

export default new ShoppingCartStore();
