import { observable, reaction, computed } from 'mobx';
import { AsyncStorage } from 'react-native';
import UserStore from './user';

class ShoppingCartStore {
    @observable
    data = [];

    code;

    constructor () {
        reaction(() => {
            const { member } = UserStore;
            return member?.store?.code;
        }, code => this.init(code));
    }

    @computed get total () {
        return this.data.reduce((total, current) => total + current.quantity, 0);
    }

    @computed get price () {
        return this.data.reduce((total, current) => total + current.quantity * current.price, 0);
    }

    @computed get isAllSpecial () {
        const { specialGoodsCategory } = UserStore;
        return this.data.every(item => item.categoryId === specialGoodsCategory);
    }

    @computed get deliveryFee () {
        const { deliveryFee } = UserStore;
        return this.isNeedDeliveryFee ? deliveryFee : 0;
    }

    @computed get isNeedDeliveryFee () {
        const { deliveryFee, freeDelivery } = UserStore;
        return !this.isAllSpecial && deliveryFee > 0 && this.price < freeDelivery;
    }

    @computed get amount () {
        return ((this.price + this.deliveryFee) / 100).toFixed(2);
    }

    async init (code) {
        this.code = code;
        this.data = await ShoppingCartStore.load(code);
        console.log(`init shopping cart ${code}`, this.data);
    }

    async save () {
        AsyncStorage.setItem(`SHOPPING_CART_${this.code}`, JSON.stringify(this.data));
        console.log(`update shopping cart ${this.code}`, this.data);
    }

    static async load (code) {
        const data = await AsyncStorage.getItem(`SHOPPING_CART_${code}`);
        try {
            return !data ? [] : JSON.parse(data) || [];
        } catch (err) {
            return [];
        }
    }

    async changeItem (item) {
        const { id, quantity } = item;
        const index = this.data.findIndex(d => d.id === id);
        if (index !== -1) {
            if (quantity > 0) {
                this.data.splice(index, 1, item);
            } else {
                this.data.splice(index, 1);
            }
        } else if (quantity > 0) {
            this.data.push(item);
        }

        this.save();
    }
}

export default new ShoppingCartStore();
