import axios from 'axios';
import merge from 'lodash.merge';
import { Actions } from 'react-native-router-flux';
import { Toast } from 'antd-mobile-rn';
import { UserStore } from '../store';

const DEFAULT_CONFIG = { showError: true, loading: false };

axios.defaults.baseURL = process.env.BASE_URL;
console.log(axios.defaults.baseURL);
axios.interceptors.request.use((config) => {
    const { session } = UserStore;
    return merge({
        withCredentials: true,
        headers: {
            'x-wx-openid': session.openid,
            'x-wx-sign': session.sign,
            'x-wx-code': session.code,
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1 MicroMessenger/6.5.7 Language/zh_CN'
        }
    },
    config);
});
axios.interceptors.response.use(async (res) => {
    console.log(res);
    const data = { success: false, ...res.data };
    if (!data.success) {
        throw new URIError(data.msg || '操作失败!');
    }
    return data;
});

export const fetch = async (url, config = DEFAULT_CONFIG) => {
    const { showError, loading } = config;
    try {
        if (!url) {
            throw new Error('url must be not null');
        }
        if (global.LoadingBar) {
            global.LoadingBar.start();
        }
        if (loading !== false) {
            Toast.loading(loading, 0);
        }
        const response = await axios(url, config);
        if (global.LoadingBar) {
            global.LoadingBar.finish();
        }
        if (loading !== false) {
            Toast.hide();
        }
        return response;
    } catch (err) {
        if (global.LoadingBar) {
            global.LoadingBar.error();
        }
        if (loading !== false) {
            Toast.hide();
        }
        if (showError) {
            Toast.fail(err.message);
            console.warn(err.message);
        }
        if (
            (err.code && err.code === 403)
            || (err.response && err.response.status === 403)
        ) {
            Actions.login();
        }
        return { success: false };
    }
};

export const get = async (url, params, config) => fetch(url, merge({ method: 'get', params }, DEFAULT_CONFIG, config));

export const post = async (url, data, config) => fetch(url, merge({ method: 'post', data }, DEFAULT_CONFIG, config));

export default {
    get, post, fetch
};
