import { observable, action } from 'mobx';
import { AsyncStorage } from 'react-native';
import { get } from '../lib/axios';

class UserStore {
    @observable
    member = null;

    @observable
    shoppingCart = UserStore.getShoppingCart();

    @observable
    specialGoodsCategory = null;

    @observable
    session = {}

    static async getShoppingCart (code) {
        const data = await AsyncStorage.getItem(`SHOPPING_CART_${code}`);
        try {
            return JSON.parse(data);
        } catch (err) {
            return [];
        }
    }

    @action
    async login () {
        this.session = {
            openid: 'o_tzEwA3ZqkECZnv0gSxDiMCh86I',
            sign: '6549af63029eff791d1a18d44a8a6027',
            code: '731H0001'
        };
        return this.loadAuthInfo();
    }

    @action
    async loadAuthInfo () {
        const result = await get('/info');
        if (result.success) {
            this.member = result.value;
            this.specialGoodsCategory = result.data.specialGoodsCategory;
            return this.member;
        }
        return null;
    }
}

const store = new UserStore();
export default store;
