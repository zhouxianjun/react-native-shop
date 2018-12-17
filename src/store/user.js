import axios from 'axios';
import { computed, observable } from 'mobx';

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

    @computed get deliveryFee () {
        return this.member?.store?.deliveryFee || 0;
    }

    @computed get freeDelivery () {
        return this.member?.store?.freeDlvLimit || 0;
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

    async loadAuthInfo ({ force }) {
        const result = await axios('/info', { force });
        if (result.success) {
            this.member = result.value;
            this.specialGoodsCategory = result.data.specialGoodsCategory;
            return this.member;
        }
        return null;
    }
}

export default new UserStore();
