import { observable } from 'mobx';
import axios from 'axios';
import ShoppingCartStore from './shopping-cart';

class UserStore {
    @observable
    member = null;

    @observable
    specialGoodsCategory = null;

    @observable
    session = {
        openid: 'o_tzEwA3ZqkECZnv0gSxDiMCh86I',
        sign: '6549af63029eff791d1a18d44a8a6027',
        code: '731H0001'
    }

    async login () {
        return this.loadAuthInfo();
    }

    async isLogin () {
        if (!this.member) {
            const result = await this.loadAuthInfo();
            return !!result;
        }
        return true;
    }

    async loadAuthInfo () {
        const result = await axios('/info', {});
        if (result.success) {
            await ShoppingCartStore.init(this.session.code);
            this.member = result.value;
            this.specialGoodsCategory = result.data.specialGoodsCategory;
            return this.member;
        }
        return null;
    }
}

export default new UserStore();
