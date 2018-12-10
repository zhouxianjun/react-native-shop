import { observable } from 'mobx';
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

    async login () {
        this.session = {
            openid: 'o_tzEwA3ZqkECZnv0gSxDiMCh86I',
            sign: '6549af63029eff791d1a18d44a8a6027',
            code: '731H0001'
        };
    }

    async loadAuthInfo () {
        const result = await get('/info');
        console.log(result);
    }
}

const store = new UserStore();
export default store;
