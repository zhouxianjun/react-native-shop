import { Dimensions, PixelRatio, Platform } from 'react-native';

const { height, width } = Dimensions.get('window');
// iPhoneX
const X_WIDTH = 375;
const X_HEIGHT = 812;
// 获取屏幕宽度
global.SCREEN_WIDTH = width;
// 获取屏幕高度
global.SCREEN_HEIGHT = height;

global.isIos = Platform.OS === 'ios';
global.isAndroid = Platform.OS === 'android';
// 判断是否为iphoneX
global.isIphoneX = Platform.OS === 'ios'
&& ((global.SCREEN_HEIGHT === X_HEIGHT && global.SCREEN_WIDTH === X_WIDTH)
    || (global.SCREEN_HEIGHT === X_WIDTH && global.SCREEN_WIDTH === X_HEIGHT));
// 获取屏幕分辨率
global.PixelRatio = PixelRatio.get();
