import { Dimensions, PixelRatio, Platform } from 'react-native';

// 设计图上的比例，宽度
const BASE_PX = Platform.OS === 'ios' ? 750 : 720;
// 通过系统API获得屏幕宽高
const { height, width } = Dimensions.get('window');
// 获取屏幕宽度
global.SCREEN_WIDTH = width;
// 获取屏幕高度
global.SCREEN_HEIGHT = height;
// 获取屏幕分辨率
global.PixelRatio = PixelRatio.get();
global.px2dp = px => px / BASE_PX * global.SCREEN_WIDTH;
global.fontSize = (size) => {
    if (global.PixelRatio === 2) {
        // iphone 5s and older Androids
        if (global.SCREEN_WIDTH < 360) {
            return size * 0.95;
        }
        // iphone 5
        if (global.SCREEN_HEIGHT < 667) {
            return size;
            // iphone 6-6s
        } if (global.SCREEN_HEIGHT >= 667 && global.SCREEN_HEIGHT <= 735) {
            return size * 1.15;
        }
        // older phablets
        return size * 1.25;
    }
    if (global.PixelRatio === 3) {
        // catch Android font scaling on small machines
        // where pixel ratio / font scale ratio => 3:3
        if (global.SCREEN_WIDTH <= 360) {
            return size;
        }
        // Catch other weird android width sizings
        if (global.SCREEN_HEIGHT < 667) {
            return size * 1.15;
            // catch in-between size Androids and scale font up
            // a tad but not too much
        }
        if (global.SCREEN_HEIGHT >= 667 && global.SCREEN_HEIGHT <= 735) {
            return size * 1.2;
        }
        // catch larger devices
        // ie iphone 6s plus / 7 plus / mi note 等等
        return size * 1.27;
    }
    if (global.PixelRatio === 3.5) {
        // catch Android font scaling on small machines
        // where pixel ratio / font scale ratio => 3:3
        if (global.SCREEN_WIDTH <= 360) {
            return size;
            // Catch other smaller android height sizings
        }
        if (global.SCREEN_HEIGHT < 667) {
            return size * 1.20;
            // catch in-between size Androids and scale font up
            // a tad but not too much
        }
        if (global.SCREEN_HEIGHT >= 667 && global.SCREEN_HEIGHT <= 735) {
            return size * 1.25;
        }
        // catch larger phablet devices
        return size * 1.40;
    }
    // if older device ie pixelRatio !== 2 || 3 || 3.5
    return size;
};
