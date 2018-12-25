import axios from 'axios';
import merge from 'lodash.merge';
import { Actions } from 'react-native-router-flux';
import { Toast, Portal } from '@ant-design/react-native';
import { UserStore } from '../store';
import HttpError from './HttpError';
import { BASE_URL } from '../config';

const DEFAULT_CONFIG = { showError: true, loading: false };

axios.defaults.baseURL = BASE_URL;
console.log('BASE_URL:', axios.defaults.baseURL);
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
    const data = { success: false, ...res.data };
    if (!data.success) {
        throw new HttpError(data.msg || '操作失败!', res, data);
    }
    return data;
});

export const fetch = async (url, config = DEFAULT_CONFIG) => {
    const { showError, loading } = config;
    let loadingToast;
    try {
        if (!url) {
            throw new Error('url must be not null');
        }
        if (loading !== false) {
            loadingToast = Toast.loading(typeof loading === 'boolean' ? '加载中...' : loading, 0);
        }
        const response = await axios(url, config);
        console.log(url, config, response);
        return response;
    } catch (err) {
        console.warn(err);
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
    } finally {
        if (loadingToast) {
            Portal.remove(loadingToast);
        }
    }
};

export const get = async (url, params, config) => fetch(url, merge({ method: 'get', params }, DEFAULT_CONFIG, config));

export const post = async (url, data, config) => fetch(url, merge({ method: 'post', data }, DEFAULT_CONFIG, config));

export default {
    get, post, fetch
};
