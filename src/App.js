import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import codePush from 'react-native-code-push';
import { Provider as AntProvider, Toast } from '@ant-design/react-native';
import store from './store';
import Router from './router';

@codePush
class App extends Component {
    async componentWillMount () {
        codePush.disallowRestart();
        try {
            await codePush.sync({
                updateDialog: {
                    // 是否显示更新描述
                    appendReleaseDescription: true,
                    // 更新描述的前缀。 默认为"Description"
                    descriptionPrefix: '\n更新内容：\n',
                    // 强制更新按钮文字，默认为continue
                    mandatoryContinueButtonLabel: '立即更新',
                    // 强制更新时的信息. 默认为"An update is available that must be installed."
                    mandatoryUpdateMessage: '必须更新后才能使用',
                    // 非强制更新时，按钮文字,默认为"ignore"
                    optionalIgnoreButtonLabel: '稍后',
                    // 非强制更新时，确认按钮文字. 默认为"Install"
                    optionalInstallButtonLabel: '后台更新',
                    // 非强制更新时，检查到更新的消息文本
                    optionalUpdateMessage: '有新版本了，是否更新？',
                    // Alert窗口的标题
                    title: '更新提示'
                },
                installMode: codePush.InstallMode.IMMEDIATE
            });
        } catch (err) {
            Toast.info('检查更新失败', 1, undefined, false);
            console.warn(err?.message || err);
        }
    }

    async componentDidMount () {
        codePush.allowRestart();
    }

    render () {
        return (
            <Provider {...store}>
                <AntProvider>
                    <Router />
                </AntProvider>
            </Provider>
        );
    }
}
export default App;
