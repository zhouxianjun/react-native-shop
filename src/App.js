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
            await codePush.sync();
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
