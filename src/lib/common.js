/**
 * 把数据的每个key按照前缀分组作为新的key(前缀)的值:
 * {name: 'Alone', roleNames: 'a,b'} = {name: 'Alone', role: [{ name: 'a' }, { name: 'b' }]}
 * @param {Object | Array} vo 数据
 * @param {String} prefix 前缀
 */
/**
 * 转换图片地址
 * @param {String} url 原地址
 */
import { IMG_ADDRESS } from '../config';

export const collectionForVo = (vo, prefix, name) => {
    if (Array.isArray(vo)) {
        vo.forEach(v => collectionForVo(v, prefix));
    } else {
        let min = 0;
        const map = Object.keys(vo).filter(key => key.startsWith(prefix) && key.endsWith('s')).reduce((m, key) => {
            let newerKey = key.substring(prefix.length, key.length - 1);
            newerKey = `${newerKey.substr(0, 1).toLowerCase()}${newerKey.substring(1)}`;
            const val = vo[key].split(',');
            m.set(newerKey, val);
            min = Math.min(val.length);
            return m;
        }, new Map());
        Reflect.set(vo, name || `${prefix}s`, Array.from({ length: min }).map((n, index) => {
            const obj = Object.create(null);
            map.forEach((v, k) => Reflect.set(obj, k, v[index]));
            return obj;
        }));
    }
};

/**
 * 强制小数位 例4.5 => 4.50; 1 => 1.00; 1.123 => 1.12
 * @param {Number | String} num 源数字
 * @param {Number} count 小数位数
 */
export const ForceDecimal = (num, count = 2) => {
    const str = num.toString();
    const [start, end = ''] = str.split('.');
    return `${start}.${end.length > count ? end.substring(0, count) : end.padEnd(count, '0')}`;
};

export const ForceMoney = num => ForceDecimal(num / 100);

export const transformImgUrl = url => `${IMG_ADDRESS}${url}`;
