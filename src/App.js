import React from 'react';
import { Provider } from 'mobx-react';
import store from './store';
import Router from './router';

export default function () {
    return (
        <Provider {...store}>
            <Router />
        </Provider>
    );
}
