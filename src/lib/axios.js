import axios from 'axios';
import merge from 'merge';
import { Actions } from 'react-native-router-flux';
import { UserStore } from '../store';

axios.defaults.baseURL = process.env.BASE_URL;
axios.interceptors.request.use((config) => {
    const { session } = UserStore;
    return merge.recursive(
        false,
        {
            withCredentials: true,
            headers: {
                'x-wx-openid': session.openid,
                'x-wx-sign': session.sign,
                'x-wx-code': session.code
            }
        },
        config
    );
});
axios.interceptors.response.use(async (res) => {
    const data = { success: false, ...res.data };
    if (!data.success) {
        throw new URIError(data.msg || '操作失败!');
    }
    return data;
});

export default {
    async get (url, params, config = { showError: true }) {
        return this.fetch(url, merge.recursive(
            false,
            {
                method: 'get',
                params
            },
            config
        ));
    },

    async post (url, data, config = { showError: true }) {
        return this.fetch(url, merge.recursive(
            false,
            {
                method: 'post',
                data
            },
            config
        ));
    },

    async fetch (url, config = { showError: true }) {
        try {
            if (!url) {
                throw new Error('url must be not null');
            }
            const response = await axios(url, config);
            return response;
        } catch (err) {
            const { showError } = config;
            if (showError) {
                console.error(err.message);
            }
            if (
                (err.code && err.code === 403)
                || (err.response && err.response.status === 403)
            ) {
                Actions.login();
            }
            return { success: false };
        }
    }
};
